import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// --- Schema ---
const poemFormSchema = z.object({
  title: z.string().optional(),
  status: z.enum(["draft", "published"]),
  verses: z.array(z.object({
    text: z.string()
  })).min(1, "At least one verse is required"),
  poetId: z.string().min(1, "Poet is required"),
  tags: z.array(z.string()).default([]),
  description: z.string().optional(),
});

type PoemFormValues = z.infer<typeof poemFormSchema>;

const STORAGE_KEY = "poem-draft-v1";

export function AddPoemDialog({ children, onSuccess }: { children?: React.ReactNode; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const utils = trpc.useUtils();

  // Queries (Mock or Real)
  // Using people router as figures router doesn't exist yet
  const { data: peopleData } = trpc.people.getAll.useQuery(undefined, { enabled: open });
  
  // Prepare poets list from people
  const poets = peopleData?.map(p => ({ id: p.id.toString(), name: p.nameAr || p.nameEn })) || [];

  const form = useForm<PoemFormValues>({
    resolver: zodResolver(poemFormSchema),
    defaultValues: {
      title: "",
      status: "draft",
      verses: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }], // Start with 4 empty slots like image
      poetId: "",
      tags: [],
      description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "verses",
  });

  // --- Draft Persistence Logic ---
  // Load draft on mount
  useEffect(() => {
    if (!open) return;
    
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
  }, [open, form]);

  // Save draft on change
  useEffect(() => {
    if (!open) return;

    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, open]);

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
    // Transform data for API
    // verses array -> newline separated string for content
    const content = data.verses.map(v => v.text).filter(t => t.trim() !== "").join("\n");
    
    if (!content) {
      form.setError("root", { message: "Poem content cannot be empty" });
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
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(t => t !== tagToRemove));
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
      <DialogContent className="sm:max-w-5xl w-[95vw] bg-[#0A0A0A] border-white/5 p-0 overflow-hidden gap-0 shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#0A0A0A]">
              <DialogTitle className="text-2xl font-light tracking-wide text-white/90">Add New Poem</DialogTitle>
              
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
                           <span className="text-sm text-white/40 mr-1 font-light">Status:</span>
                           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => field.onChange("draft")}>
                             <div className={`w-2 h-2 rounded-full ${field.value === 'draft' ? 'bg-[#E8D4B4]' : 'bg-white/20'}`} />
                             <Label htmlFor="r-draft" className={`text-sm cursor-pointer font-light ${field.value === 'draft' ? 'text-[#E8D4B4]' : 'text-white/40'}`}>Draft</Label>
                           </div>
                           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => field.onChange("published")}>
                             <div className={`w-2 h-2 rounded-full ${field.value === 'published' ? 'bg-green-500' : 'bg-white/20'}`} />
                             <Label htmlFor="r-published" className={`text-sm cursor-pointer font-light ${field.value === 'published' ? 'text-green-500' : 'text-white/40'}`}>Published</Label>
                           </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 bg-[#0A0A0A]">
              
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-baseline justify-between">
                       <FormLabel className="text-base font-light text-white/80">Title <span className="text-white/30 text-sm ml-1">(optional)</span></FormLabel>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="" 
                        {...field} 
                        className="bg-white/[0.03] border-white/10 h-14 rounded-md focus:border-white/20 focus:ring-0 text-white/90 placeholder:text-white/20 transition-colors" 
                      />
                    </FormControl>
                    <FormDescription className="text-white/30 text-xs font-light">
                      If left blank, the first verse will be used as the title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verses Grid */}
              <div className="space-y-4">
                <FormLabel className="text-base font-light text-white/80">Poem Verses</FormLabel>
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
                              className="bg-white/[0.03] border-white/10 h-12 rounded-md focus:border-white/20 focus:ring-0 text-white/90 placeholder:text-white/20" 
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
                  className="text-white/40 hover:text-white pl-0 h-auto py-2 font-light hover:bg-transparent"
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
                      <FormLabel className="text-base font-light text-white/80">Poet *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/[0.03] border-white/10 h-12 rounded-md focus:ring-0 focus:border-white/20 text-white/90">
                            <SelectValue placeholder="Select poet..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                          {poets.map((poet) => (
                            <SelectItem key={poet.id} value={poet.id} className="focus:bg-white/10 focus:text-white cursor-pointer">
                              {poet.name}
                            </SelectItem>
                          ))}
                          {poets.length === 0 && <div className="p-3 text-sm text-white/40">No poets found. Add Figures first.</div>}
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
                      <FormLabel className="text-base font-light text-white/80">Tags</FormLabel>
                      <div className="flex flex-wrap gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/[0.03] min-h-[48px] items-center">
                        {field.value.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1 pr-1 bg-white/10 text-white hover:bg-white/20 border-none font-light">
                            {tag}
                            <span className="cursor-pointer hover:text-red-400" onClick={() => removeTag(tag)}>
                              <X className="h-3 w-3" />
                            </span>
                          </Badge>
                        ))}
                        <input
                          className="flex-1 bg-transparent border-none outline-none min-w-[120px] text-sm h-8 my-auto text-white/90 placeholder:text-white/20"
                          placeholder={field.value.length === 0 ? "Tag 1, Tag 2..." : "Add tag..."}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                        <div className="cursor-pointer text-white/30 hover:text-white transition-colors p-1" onClick={() => {
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
                    <FormLabel className="text-base font-light text-white/80">Description <span className="text-white/30 text-sm ml-1">(optional)</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a brief description..." 
                        className="bg-white/[0.03] border-white/10 resize-none h-32 rounded-md focus:border-white/20 focus:ring-0 text-white/90 placeholder:text-white/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Footer */}
            <div className="p-8 pt-4 border-t-0 bg-[#0A0A0A] flex justify-center pb-10">
              <Button type="submit" size="lg" className="min-w-[200px] h-12 bg-[#E8D4B4] text-[#0A0A0A] hover:bg-[#d6c0a0] font-medium text-base rounded-md shadow-lg shadow-[#E8D4B4]/5 transition-all hover:scale-[1.02]">
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
