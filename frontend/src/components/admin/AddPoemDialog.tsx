import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// --- Form Types ---
type PoemFormValues = {
  title?: string;
  status: "draft" | "published";
  verses: Array<{ text: string }>;
  poetId: string;
  tags: string[];
  description?: string;
};

const STORAGE_KEY = "poem-draft-v1";

type PrefillPoem = {
  title?: string;
  tags?: string[];
  verses?: string[];
};

export function AddPoemDialog({
  children,
  onSuccess,
  prefillPoem,
}: {
  children?: React.ReactNode;
  onSuccess?: () => void;
  prefillPoem?: PrefillPoem;
}) {
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const utils = trpc.useUtils();

  // Queries (Mock or Real)
  // Using people router as figures router doesn't exist yet
  const { data: peopleData } = trpc.people.getAll.useQuery(undefined, { enabled: open });
  
  // Prepare poets list from people
  const poets = peopleData?.map(p => ({ id: p.id.toString(), name: p.nameAr || p.nameEn })) || [];

  // Build default verses, optionally from a prefilled poem
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
      status: "draft",
      verses: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }], // Start with 4 empty slots like image
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

  // --- Draft Persistence / Prefill Logic ---
  // When used for creation (no prefillPoem), load any saved draft
  useEffect(() => {
    if (!open || prefillPoem) return;
    
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Only reset if we have valid data
        if (parsed) {
          form.reset(parsed);
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [open, form, prefillPoem]);

  // When used with prefilled poem data, reset the form each time dialog opens
  useEffect(() => {
    if (!open || !prefillPoem) return;

    form.reset({
      title: prefillPoem.title ?? "",
      status: "draft",
      verses: buildDefaultVerses(),
      poetId: "",
      tags: prefillPoem.tags ?? [],
      description: "",
    });
  }, [open, prefillPoem, form]);

  // Save draft on change (creation mode only)
  useEffect(() => {
    if (!open || prefillPoem) return;

    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, open, prefillPoem]);

  // --- Handlers ---
  const createMutation = trpc.poems.create.useMutation({
    onSuccess: () => {
      toast.success("Poem created successfully");
      localStorage.removeItem(STORAGE_KEY);
      form.reset();
      setOpen(false);
      utils.poems.getAll.invalidate();
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(`Failed to create poem: ${err.message}`);
    }
  });

  const onSubmit = (data: PoemFormValues) => {
    // Validation
    if (!data.poetId || data.poetId.trim() === "") {
      form.setError("poetId", { message: "Poet is required" });
      return;
    }

    // Transform data for API
    // verses array -> newline separated string for content
    const content = data.verses.map(v => v.text).filter(t => t.trim() !== "").join("\n");
    
    if (!content) {
      form.setError("verses", { message: "At least one verse is required" });
      return;
    }

    // If title is empty, use first verse
    const title = data.title || data.verses[0]?.text || "Untitled Poem";

    const selectedPoet = poets.find(p => p.id === data.poetId);

    createMutation.mutate({
      titleEn: title, // Simplified: using same title for both langs for now
      titleAr: title,
      contentEn: content,
      contentAr: content,
      slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      status: data.status,
      // figureId: parseInt(data.poetId), // Removed as router doesn't support it yet
      poetEn: selectedPoet?.name || "",
      poetAr: selectedPoet?.name || "",
      tags: data.tags,
      // Mapping description to one of the description fields
      descriptionEn: data.description,
      descriptionAr: data.description,
      // Required fields by schema
      // authorId: 1, // Handled by backend context
    } as any); // Casting to any to avoid strict type checks against router input if they mismatch temporarily
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
    const currentTags: string[] = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((t: string) => t !== tagToRemove)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="fixed bottom-8 right-8 shadow-lg rounded-full px-6 py-6 h-auto text-lg z-50 animate-in fade-in zoom-in duration-300">
             <Plus className="mr-2 h-5 w-5" /> Add Poem
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl w-[95vw] bg-background border-border p-0 overflow-hidden gap-0 shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-background">
              <DialogTitle className="text-2xl font-light tracking-wide text-foreground">Add New Poem</DialogTitle>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center gap-3">
                           <span className="text-sm text-muted-foreground mr-1 font-light">Status:</span>
                           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => field.onChange("draft")}>
                             <div className={`w-2 h-2 rounded-full ${field.value === 'draft' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                             <Label htmlFor="r-draft" className={`text-sm cursor-pointer font-light ${field.value === 'draft' ? 'text-primary' : 'text-muted-foreground'}`}>Draft</Label>
                           </div>
                           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => field.onChange("published")}>
                             <div className={`w-2 h-2 rounded-full ${field.value === 'published' ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                             <Label htmlFor="r-published" className={`text-sm cursor-pointer font-light ${field.value === 'published' ? 'text-emerald-500' : 'text-muted-foreground'}`}>Published</Label>
                           </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 bg-background">
              
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-baseline justify-between">
                       <FormLabel className="text-base font-light text-foreground">Title <span className="text-muted-foreground text-sm ml-1">(optional)</span></FormLabel>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="" 
                        {...field} 
                        className="bg-muted/40 border-border h-14 rounded-md focus:border-primary focus:ring-0 text-foreground placeholder:text-muted-foreground/70 transition-colors" 
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-xs font-light">
                      If left blank, the first verse will be used as the title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verses Grid */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-base font-light text-foreground">Poem Verses *</FormLabel>
                  {form.formState.errors.verses && (
                    <span className="text-sm text-destructive">{form.formState.errors.verses.message}</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`verses.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder={index === 0 ? "Verse 1" : index === 1 ? "Verse 2 (bait 2)" : index === 2 ? "Verse 3" : `Verse ${index + 1}`}
                              className="bg-muted/40 border-border h-12 rounded-md focus:border-primary focus:ring-0 text-foreground placeholder:text-muted-foreground/70" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => append({ text: "" })}
                  className="text-muted-foreground hover:text-foreground pl-0 h-auto py-2 font-light hover:bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add new verse
                </Button>
              </div>

              {/* Poet and Tags Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Poet */}
                <FormField
                  control={form.control}
                  name="poetId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-light text-foreground">Poet *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/40 border-border h-12 rounded-md focus:ring-0 focus:border-primary text-foreground">
                            <SelectValue placeholder="Select poet..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                          {poets.map((poet) => (
                            <SelectItem key={poet.id} value={poet.id} className="focus:bg-white/10 focus:text-white cursor-pointer">
                              {poet.name}
                            </SelectItem>
                          ))}
                          {poets.length === 0 && <div className="p-3 text-sm text-muted-foreground">No poets found. Add Figures first.</div>}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-light text-foreground">Tags</FormLabel>
                      <div className="flex flex-wrap gap-2 px-3 py-2 rounded-md border border-border bg-muted/40 min-h-[48px] items-center">
                        {(field.value as string[]).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="gap-1 pr-1 bg-muted text-foreground hover:bg-muted/80 border-none font-light">
                            {tag}
                            <span className="cursor-pointer hover:text-red-400" onClick={() => removeTag(tag)}>
                              <X className="h-3 w-3" />
                            </span>
                          </Badge>
                        ))}
                        <input
                          className="flex-1 bg-transparent border-none outline-none min-w-[120px] text-sm h-8 my-auto text-foreground placeholder:text-muted-foreground/70"
                          placeholder={field.value.length === 0 ? "Tag 1, Tag 2..." : "Add tag..."}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                        <div className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors p-1" onClick={() => {
                           if(tagInput.trim() && !field.value.includes(tagInput.trim())) {
                             field.onChange([...field.value, tagInput.trim()]);
                             setTagInput("");
                           }
                        }}>
                          <Plus className="h-4 w-4" />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="text-base font-light text-foreground">Description <span className="text-muted-foreground text-sm ml-1">(optional)</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a brief description..." 
                        className="bg-muted/40 border-border resize-none h-32 rounded-md focus:border-primary focus:ring-0 text-foreground placeholder:text-muted-foreground/70" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Footer */}
            <div className="p-8 pt-4 border-t border-border bg-background flex justify-center pb-10">
              <Button
                type="submit"
                size="lg"
                className="min-w-[200px] h-12 font-medium text-base rounded-md shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]"
              >
                Save
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Helper Label component since import was missing
function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
}
