import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Form Types ---
type PoemFormValues = {
  title?: string;
  period?: string;
  status: "draft" | "review" | "published";
  verses: Array<{ text: string }>;
  poetId: string;
  tags: string[];
  description?: string;
};

type PrefillPoem = {
  title?: string;
  tags?: string[];
  verses?: string[];
};

type EditingPoem = {
  id: number;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  slug: string;
  poetId?: number | null;
  poetEn?: string | null;
  poetAr?: string | null;
  period?: string | null;
  tags?: string[] | null;
  status: string;
  isFeatured?: boolean;
};

const PERIOD_OPTIONS = ["1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s"];

export function AddPoemDialog({
  children,
  onSuccess,
  prefillPoem,
  editingPoem,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children?: React.ReactNode;
  onSuccess?: () => void;
  prefillPoem?: PrefillPoem;
  editingPoem?: EditingPoem | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen;
  const [tagInput, setTagInput] = useState("");
  const utils = trpc.useUtils();

  const { data: poetsData } = trpc.poets.getAll.useQuery(undefined, { enabled: open });
  const poets = poetsData?.map(p => ({
    id: p.id.toString(),
    name: p.nameAr || p.nameEn,
  })) || [];

  const buildDefaultVerses = () => {
    if (prefillPoem?.verses && prefillPoem.verses.length > 0) {
      const mapped = prefillPoem.verses.map((text) => ({ text }));
      while (mapped.length < 4) {
        mapped.push({ text: "" });
      }
      return mapped;
    }
    return [{ text: "" }, { text: "" }, { text: "" }, { text: "" }];
  };

  const form = useForm<PoemFormValues>({
    defaultValues: {
      title: "",
      period: "",
      status: "draft",
      verses: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      poetId: "",
      tags: [],
      description: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "verses",
  });

  useEffect(() => {
    if (!open || !editingPoem) return;
    const verses = editingPoem.contentEn ? editingPoem.contentEn.split("\n").filter(Boolean) : [];
    const verseFields = verses.length >= 4 ? verses : [...verses, ...Array(Math.max(0, 4 - verses.length)).fill("")];

    form.reset({
      title: editingPoem.titleEn ?? "",
      period: editingPoem.period ?? "",
      status: (editingPoem.status === "published" || editingPoem.status === "review" ? editingPoem.status : "draft") as "draft" | "review" | "published",
      verses: verseFields.map((text) => ({ text })),
      poetId: editingPoem.poetId?.toString() ?? "",
      tags: editingPoem.tags ?? [],
      description: "",
    });
  }, [open, editingPoem, form]);

  useEffect(() => {
    if (!open || prefillPoem || editingPoem) return;
    form.reset({
      title: "",
      period: "",
      status: "draft",
      verses: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      poetId: "",
      tags: [],
      description: "",
    });
  }, [open, form, prefillPoem, editingPoem]);

  useEffect(() => {
    if (!open || !prefillPoem || editingPoem) return;
    form.reset({
      title: prefillPoem.title ?? "",
      period: "",
      status: "draft",
      verses: buildDefaultVerses(),
      poetId: "",
      tags: prefillPoem.tags ?? [],
      description: "",
    });
  }, [open, prefillPoem, editingPoem, form]);

  const createMutation = trpc.poems.create.useMutation({
    onSuccess: () => {
      toast.success("Poem created successfully");
      form.reset();
      setOpen(false);
      utils.poems.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(`Failed to create poem: ${err.message}`);
    },
  });

  const updateMutation = trpc.poems.update.useMutation({
    onSuccess: () => {
      toast.success("Poem updated successfully");
      form.reset();
      setOpen(false);
      utils.poems.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(`Failed to update poem: ${err.message}`);
    },
  });

  const onSubmit = (data: PoemFormValues) => {
    if (!data.poetId?.trim()) {
      form.setError("poetId", { message: "Poet is required" });
      return;
    }

    const content = data.verses.map(v => v.text).filter(t => t.trim() !== "").join("\n");
    if (!content) {
      form.setError("verses", { message: "At least one verse is required" });
      return;
    }

    const title = data.title || data.verses[0]?.text || "Untitled Poem";
    const selectedPoet = poets.find(p => p.id === data.poetId);
    const payload = {
      titleEn: title,
      titleAr: title,
      contentEn: content,
      contentAr: content,
      status: data.status,
      poetId: parseInt(data.poetId),
      poetEn: selectedPoet?.name || "",
      poetAr: selectedPoet?.name || "",
      period: (data.period && data.period !== "__none__") ? data.period.trim() : undefined,
      tags: data.tags,
    };

    if (editingPoem) {
      updateMutation.mutate({
        id: editingPoem.id,
        slug: editingPoem.slug,
        ...payload,
      });
    } else {
      createMutation.mutate({
        ...payload,
        slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]+/g, "") + "-" + Date.now(),
      } as any);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !form.getValues("tags").includes(val)) {
        form.setValue("tags", [...form.getValues("tags"), val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue("tags", (form.getValues("tags") || []).filter((t: string) => t !== tagToRemove));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const statusConfig = {
    draft: { label: "Draft", dotClass: "bg-amber-500", activeBg: "bg-amber-500/15", activeText: "text-amber-700 dark:text-amber-400" },
    review: { label: "Review", dotClass: "bg-blue-500", activeBg: "bg-blue-500/15", activeText: "text-blue-700 dark:text-blue-400" },
    published: { label: "Published", dotClass: "bg-emerald-500", activeBg: "bg-emerald-500/15", activeText: "text-emerald-700 dark:text-emerald-400" },
  } as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!editingPoem && (
        <DialogTrigger asChild>
          {children || (
            <Button className="fixed bottom-8 right-8 shadow-lg rounded-full px-6 py-6 h-auto text-lg z-50">
              <Plus className="mr-2 h-5 w-5" /> Add Poem
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-2xl bg-background border-border p-0 overflow-hidden shadow-2xl rounded-2xl gap-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                {editingPoem ? "Edit Poem" : "Add Poem"}
              </DialogTitle>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-1 rounded-xl bg-muted/40 p-1">
                        {(["draft", "review", "published"] as const).map((s) => {
                          const config = statusConfig[s];
                          const isActive = field.value === s;
                          return (
                            <label
                              key={s}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                                isActive ? cn(config.activeBg, config.activeText) : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                              )}
                            >
                              <input type="radio" value={s} checked={isActive} onChange={() => field.onChange(s)} className="sr-only" />
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

            {/* Body */}
            <div className="flex-1 overflow-y-auto space-y-5 px-6 py-5">
              {/* Row 1: Period (top) + Title */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Period</FormLabel>
                      <Select onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)} value={field.value || "__none__"}>
                        <FormControl>
                          <SelectTrigger className="h-9 rounded-lg">
                            <SelectValue placeholder="e.g. 1930s" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">—</SelectItem>
                          {PERIOD_OPTIONS.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2 sm:col-span-3">
                      <FormLabel className="text-sm font-medium">Title <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Poem title" {...field} className="h-9 rounded-lg px-3" />
                      </FormControl>
                      <FormDescription className="text-xs">First verse used if blank</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Verses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Verses *</FormLabel>
                  {form.formState.errors.verses && (
                    <span className="text-xs text-destructive">{form.formState.errors.verses.message}</span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(() => {
                    const ordered: number[] = [];
                    for (let row = 0; row < Math.ceil(fields.length / 2); row++) {
                      const right = row * 2;
                      const left = row * 2 + 1;
                      if (left < fields.length) ordered.push(left);
                      ordered.push(right);
                    }
                    return ordered.map((idx) => (
                      <FormField
                        key={fields[idx].id}
                        control={form.control}
                        name={`verses.${idx}.text`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={`Verse ${idx + 1}`}
                                className="h-9 rounded-lg px-3 bg-muted/30"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ));
                  })()}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => append({ text: "" })} className="h-8 text-muted-foreground hover:text-foreground -ml-1">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add verse
                </Button>
              </div>

              {/* Poet + Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="poetId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Poet *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 rounded-lg">
                            <SelectValue placeholder="Select poet..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {poets.map((poet) => (
                            <SelectItem key={poet.id} value={poet.id}>{poet.name}</SelectItem>
                          ))}
                          {poets.length === 0 && <div className="p-3 text-sm text-muted-foreground">Add poets in the Poets tab first.</div>}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Tags</FormLabel>
                      <div className="flex flex-wrap gap-1.5 rounded-lg border border-input bg-muted/30 px-3 py-2 min-h-[36px] items-center">
                        {(field.value as string[]).map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs font-normal h-6 rounded-md">
                            {tag}
                            <span className="cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)}>
                              <X className="h-2.5 w-2.5" />
                            </span>
                          </Badge>
                        ))}
                        <input
                          className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm h-7 text-foreground placeholder:text-muted-foreground"
                          placeholder={field.value.length === 0 ? "Add tags..." : "+"}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description..." {...field} rows={2} className="resize-none rounded-lg px-3 py-2 text-sm bg-muted/30" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4 rounded-b-2xl">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-lg px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-lg px-5">
                {editingPoem ? (isPending ? "Saving…" : "Save") : (isPending ? "Creating…" : "Create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
