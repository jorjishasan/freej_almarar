import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { PenLine, Upload, Loader2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const UPLOAD_FOLDER = "poets";
const UPLOAD_URL = `/api/upload/${UPLOAD_FOLDER}`;

type PoetFormValues = {
  nameEn: string;
  nameAr: string;
  slug: string;
  originEn?: string;
  originAr?: string;
  bioEn?: string;
  bioAr?: string;
  profileImageUrl?: string;
  status: "draft" | "review" | "published";
  isFeatured: boolean;
};

type EditingPoet = {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  originEn?: string | null;
  originAr?: string | null;
  bioEn?: string | null;
  bioAr?: string | null;
  profileImageUrl?: string | null;
  status: string;
  isFeatured?: boolean;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AddPoetDialog({
  children,
  onSuccess,
  editingPoem,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children?: React.ReactNode;
  onSuccess?: () => void;
  editingPoem?: EditingPoet | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen;
  const [uploading, setUploading] = useState(false);
  const utils = trpc.useUtils();

  const form = useForm<PoetFormValues>({
    defaultValues: {
      nameEn: "",
      nameAr: "",
      slug: "",
      originEn: "",
      originAr: "",
      bioEn: "",
      bioAr: "",
      profileImageUrl: "",
      status: "draft",
      isFeatured: false,
    },
    mode: "onChange",
  });

  const nameEn = form.watch("nameEn");
  const nameAr = form.watch("nameAr");
  const profileImageUrl = form.watch("profileImageUrl");

  useEffect(() => {
    if (!open || !editingPoem) return;
    form.reset({
      nameEn: editingPoem.nameEn ?? "",
      nameAr: editingPoem.nameAr ?? "",
      slug: editingPoem.slug ?? "",
      originEn: editingPoem.originEn ?? "",
      originAr: editingPoem.originAr ?? "",
      bioEn: editingPoem.bioEn ?? "",
      bioAr: editingPoem.bioAr ?? "",
      profileImageUrl: editingPoem.profileImageUrl ?? "",
      status: (editingPoem.status === "published" || editingPoem.status === "review" ? editingPoem.status : "draft") as "draft" | "review" | "published",
      isFeatured: editingPoem.isFeatured ?? false,
    });
  }, [open, editingPoem, form]);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Upload failed: ${res.status}`);
        }
        const { url } = await res.json();
        form.setValue("profileImageUrl", url);
        toast.success("Image uploaded");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [form]
  );

  const removeImage = useCallback(() => {
    form.setValue("profileImageUrl", "");
  }, [form]);

  const createMutation = trpc.poets.create.useMutation({
    onSuccess: () => {
      toast.success("Poet created successfully");
      form.reset();
      setOpen(false);
      utils.poets.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(`Failed to create poet: ${err.message}`);
    },
  });

  const updateMutation = trpc.poets.update.useMutation({
    onSuccess: () => {
      toast.success("Poet updated successfully");
      form.reset();
      setOpen(false);
      utils.poets.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(`Failed to update poet: ${err.message}`);
    },
  });

  const onSubmit = (data: PoetFormValues) => {
    if (!data.nameEn?.trim() || !data.nameAr?.trim()) {
      form.setError("nameEn", { message: "Name (EN) is required" });
      form.setError("nameAr", { message: "Name (AR) is required" });
      return;
    }
    const slug = data.slug?.trim() || slugify(data.nameEn || data.nameAr);
    const payload = {
      nameEn: data.nameEn.trim(),
      nameAr: data.nameAr.trim(),
      slug,
      originEn: data.originEn?.trim() || undefined,
      originAr: data.originAr?.trim() || undefined,
      bioEn: data.bioEn?.trim() || undefined,
      bioAr: data.bioAr?.trim() || undefined,
      profileImageUrl: data.profileImageUrl?.trim() || undefined,
      status: data.status,
      isFeatured: data.isFeatured,
    };
    if (editingPoem) {
      updateMutation.mutate({ id: editingPoem.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const syncSlug = () => {
    const s = slugify(nameEn || nameAr || "");
    if (s) form.setValue("slug", s);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!editingPoem && (
        <DialogTrigger asChild>
          {children || (
            <Button>
              <PenLine className="h-4 w-4 mr-2" />
              Add Poet
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-xl bg-background border-border p-0 overflow-hidden shadow-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <DialogTitle className="text-xl font-semibold">
                {editingPoem ? "Edit Poet" : "Add New Poet"}
              </DialogTitle>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center gap-4"
                      >
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="radio"
                            value="draft"
                            checked={field.value === "draft"}
                            onChange={() => field.onChange("draft")}
                            className="rounded-full"
                          />
                          Draft
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="radio"
                            value="review"
                            checked={field.value === "review"}
                            onChange={() => field.onChange("review")}
                            className="rounded-full"
                          />
                          Review
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="radio"
                            value="published"
                            checked={field.value === "published"}
                            onChange={() => field.onChange("published")}
                            className="rounded-full"
                          />
                          Published
                        </label>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Profile image */}
              <FormField
                control={form.control}
                name="profileImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Profile Image
                    </FormLabel>
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/50 transition-colors",
                          field.value
                            ? "border-primary/50"
                            : "border-muted-foreground/30 hover:border-muted-foreground/50"
                        )}
                      >
                        {field.value ? (
                          <div className="relative w-full h-full group">
                            <img
                              src={field.value}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <X className="h-6 w-6 text-white" />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                            {uploading ? (
                              <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                              <>
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Upload</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleUpload}
                              disabled={uploading}
                            />
                          </label>
                        )}
                      </div>
                      <div className="flex-1 text-sm text-muted-foreground">
                        <p>Recommended: square image, at least 200×200px.</p>
                        <p className="mt-1">
                          Files upload directly to S3. Max 10MB.
                        </p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name EN / AR */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Name (English) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Poet name in English"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Name (Arabic) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="اسم الشاعر"
                          dir="rtl"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Slug</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="url-friendly-slug"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={syncSlug}
                      >
                        Auto
                      </Button>
                    </div>
                    <FormDescription>
                      URL-friendly identifier. Auto-generated from name if empty.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Origin EN / AR */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Origin (English)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Kuwait, Najd"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Origin (Arabic)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="مثال: الكويت، نجد"
                          dir="rtl"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bio */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bioEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Bio (English)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief biography..."
                          {...field}
                          rows={3}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bioAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Bio (Arabic)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="نبذة مختصرة..."
                          dir="rtl"
                          {...field}
                          rows={3}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Featured */}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-input"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Featured poet
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingPoem ? (updateMutation.isPending ? "Updating..." : "Update") : (createMutation.isPending ? "Saving..." : "Create Poet")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
