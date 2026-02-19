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
import { getUploadUrl } from "@/const";

const UPLOAD_FOLDER = "poets";

type PoetFormValues = {
  name: string;
  slug: string;
  origin?: string;
  bio?: string;
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
      name: "",
      slug: "",
      origin: "",
      bio: "",
      profileImageUrl: "",
      status: "draft",
      isFeatured: false,
    },
    mode: "onChange",
  });

  const name = form.watch("name");
  const profileImageUrl = form.watch("profileImageUrl");

  useEffect(() => {
    if (!open || !editingPoem) return;
    form.reset({
      name: editingPoem.nameEn ?? editingPoem.nameAr ?? "",
      slug: editingPoem.slug ?? "",
      origin: editingPoem.originEn ?? editingPoem.originAr ?? "",
      bio: editingPoem.bioEn ?? editingPoem.bioAr ?? "",
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
        const res = await fetch(getUploadUrl(UPLOAD_FOLDER), {
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
    const trimmedName = data.name?.trim();
    if (!trimmedName) {
      form.setError("name", { message: "Name is required" });
      return;
    }
    const slug = data.slug?.trim() || slugify(trimmedName);
    const payload = {
      nameEn: trimmedName,
      nameAr: trimmedName,
      slug,
      originEn: data.origin?.trim() || undefined,
      originAr: data.origin?.trim() || undefined,
      bioEn: data.bio?.trim() || undefined,
      bioAr: data.bio?.trim() || undefined,
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
    const s = slugify(name || "");
    if (s) form.setValue("slug", s);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const statusConfig = {
    draft: {
      label: "Draft",
      dotClass: "bg-amber-500",
      activeBg: "bg-amber-500/15",
      activeText: "text-amber-700 dark:text-amber-400",
    },
    review: {
      label: "Review",
      dotClass: "bg-blue-500",
      activeBg: "bg-blue-500/15",
      activeText: "text-blue-700 dark:text-blue-400",
    },
    published: {
      label: "Publish",
      dotClass: "bg-emerald-500",
      activeBg: "bg-emerald-500/15",
      activeText: "text-emerald-700 dark:text-emerald-400",
    },
  } as const;

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
      <DialogContent className="sm:max-w-xl bg-background border-border p-0 overflow-hidden shadow-2xl rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                {editingPoem ? "Edit Poet" : "Add Poet"}
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
                        className="flex items-center gap-1 rounded-xl bg-muted/40 p-1"
                      >
                        {(["draft", "review", "published"] as const).map((s) => {
                          const config = statusConfig[s];
                          const isActive = field.value === s;
                          return (
                            <label
                              key={s}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                                isActive
                                  ? cn(config.activeBg, config.activeText)
                                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                              )}
                            >
                              <input
                                type="radio"
                                value={s}
                                checked={isActive}
                                onChange={() => field.onChange(s)}
                                className="sr-only"
                              />
                              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", config.dotClass, !isActive && "opacity-50")} />
                              {config.label}
                            </label>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Body - compact grid layout */}
            <div className="space-y-4 px-6 py-5">
              {/* Row 1: Image + Name + Origin */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="profileImageUrl"
                  render={({ field }) => (
                    <FormItem className="space-y-2 shrink-0">
                      <FormLabel className="text-sm font-medium">Photo</FormLabel>
                      <div
                        className={cn(
                          "flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200",
                          field.value
                            ? "border-primary/30 bg-muted/20"
                            : "border-muted-foreground/20 bg-muted/30 hover:border-muted-foreground/35 hover:bg-muted/40"
                        )}
                      >
                        {field.value ? (
                          <div className="relative h-full w-full group">
                            <img src={field.value} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <X className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground">
                            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" strokeWidth={1.5} />}
                            <span className="text-[10px] font-medium">Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                          </label>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <div className="grid flex-1 grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Poet name" {...field} className="h-9 rounded-lg px-3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Origin</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Kuwait, Najd" {...field} className="h-9 rounded-lg px-3" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Slug - commented out
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Slug</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="url-slug" {...field} className="h-9 flex-1 rounded-lg px-3" />
                      </FormControl>
                      <Button type="button" variant="outline" size="sm" onClick={syncSlug} className="h-9 shrink-0 rounded-lg px-3">
                        Auto
                      </Button>
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">From name if empty</FormDescription>
                  </FormItem>
                )}
              />
              */}

              {/* Row 3: Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief biography..." {...field} rows={2} className="resize-none rounded-lg px-3 py-2 text-sm" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Row 4: Featured */}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-input accent-primary"
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm font-medium">Featured poet</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4 rounded-b-2xl">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-lg px-4 hover:bg-muted/80">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-lg px-5 shadow-sm">
                {editingPoem ? (isPending ? "Saving…" : "Save") : (isPending ? "Creating…" : "Create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
