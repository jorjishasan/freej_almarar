import { useLocation, Link } from "wouter";
import { FileText } from "lucide-react";
import { SectionLayout, FilterConfig, FilterValues, createDefaultFilterValues } from "@/components/SectionLayout";
import { EmptyState } from "@/components/EmptyState";
import { useFilters } from "@/hooks/useFilters";
import { trpc } from "@/lib/trpc";
import { getLocalizedContent } from "@shared/language";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample poem data - fallback when no poems from DB
const samplePoems = [
  {
    id: "1",
    title: "قصيدة الفريج",
    titleEn: "Poem of the Freej",
    author: "شاعر مجهول",
    authorEn: "Unknown Poet",
    period: "1950s",
    category: "heritage",
    tags: ["tradition", "history"],
    excerpt: "في فريج المرر قديماً... كانت الحياة بسيطة وجميلة",
    excerptEn: "In Freej AlMarar of old... life was simple and beautiful",
  },
  {
    id: "2",
    title: "ذكريات الماضي",
    titleEn: "Memories of the Past",
    author: "محمد بن راشد",
    authorEn: "Mohammed bin Rashid",
    period: "1960s",
    category: "nostalgia",
    tags: ["memories", "family"],
    excerpt: "أتذكر أيام زمان... حين كنا صغاراً نلعب في الفريج",
    excerptEn: "I remember the old days... when we were children playing in the freej",
  },
  {
    id: "3",
    title: "حكمة الأجداد",
    titleEn: "Wisdom of the Ancestors",
    author: "عبدالله المري",
    authorEn: "Abdullah AlMarri",
    period: "1940s",
    category: "wisdom",
    tags: ["wisdom", "tradition"],
    excerpt: "قال لي جدي يوماً... الصبر مفتاح الفرج",
    excerptEn: "My grandfather once told me... patience is the key to relief",
  },
];

// Filter configuration
const poemFilters: FilterConfig[] = [
  {
    id: "period",
    type: "select",
    label: "Time Period",
    labelAr: "الفترة الزمنية",
    placeholder: "All periods",
    placeholderAr: "جميع الفترات",
    options: [
      { value: "1940s", label: "1940s", labelAr: "الأربعينات" },
      { value: "1950s", label: "1950s", labelAr: "الخمسينات" },
      { value: "1960s", label: "1960s", labelAr: "الستينات" },
      { value: "1970s", label: "1970s", labelAr: "السبعينات" },
    ],
  },
  {
    id: "category",
    type: "select",
    label: "Category",
    labelAr: "التصنيف",
    placeholder: "All categories",
    placeholderAr: "جميع التصنيفات",
    options: [
      { value: "heritage", label: "Heritage", labelAr: "تراث" },
      { value: "nostalgia", label: "Nostalgia", labelAr: "حنين" },
      { value: "wisdom", label: "Wisdom", labelAr: "حكمة" },
      { value: "celebration", label: "Celebration", labelAr: "احتفال" },
    ],
  },
  {
    id: "tags",
    type: "tags",
    label: "Tags",
    labelAr: "الوسوم",
    options: [
      { value: "tradition", label: "Tradition", labelAr: "تقاليد" },
      { value: "history", label: "History", labelAr: "تاريخ" },
      { value: "family", label: "Family", labelAr: "عائلة" },
      { value: "memories", label: "Memories", labelAr: "ذكريات" },
      { value: "wisdom", label: "Wisdom", labelAr: "حكمة" },
    ],
  },
];

type SamplePoem = (typeof samplePoems)[number];
type DbPoem = { id: number; slug: string; titleEn: string; titleAr: string; poetEn?: string | null; poetAr?: string | null; contentEn?: string | null; contentAr?: string | null; period?: string | null; year?: number | null; tags?: string[] | null; category?: string | null };
type PoemItem = SamplePoem | DbPoem;

function isDbPoem(poem: PoemItem): poem is DbPoem {
  return "slug" in poem && typeof (poem as DbPoem).slug === "string";
}

export default function Poems() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const { data: dbPoems = [], isLoading } = trpc.poems.getPublished.useQuery();

  // Use DB poems when available, otherwise fallback to sample
  const poems: PoemItem[] = dbPoems.length > 0 ? dbPoems : samplePoems;

  const { values, setValues, filterItems, hasActiveFilters } = useFilters<PoemItem>();
  const filteredPoems = filterItems(poems, poemFilters);

  const handleContribute = () => {
    navigate("/contribute");
  };

  return (
    <SectionLayout
      title="Poems"
      titleAr="القصائد"
      subtitle="Poetry and oral traditions of Freej AlMarar"
      subtitleAr="الشعر والتراث الشفهي لفريج المرر"
      heroImage="/images/aerial-5.jpg"
      backLabel="Back"
      backLabelAr="الرئيسية"
      showSearch={true}
      searchPlaceholder="Search poems by title, author, or content..."
      searchPlaceholderAr="ابحث في القصائد بالعنوان أو الشاعر أو المحتوى..."
      filters={poemFilters}
      filterValues={values}
      onFilterChange={setValues}
    >
      {/* Results Info */}
      {hasActiveFilters && (
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredPoems.length} of {poems.length} poems
        </p>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : filteredPoems.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={hasActiveFilters ? "No matching poems" : "No poems available yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search or filters to find what you're looking for."
              : "We're building our collection of poetry and oral traditions. Check back soon or contribute your own poems to help preserve our cultural heritage."
          }
          primaryAction={
            hasActiveFilters
              ? {
                  label: "Clear Filters",
                  onClick: () => setValues(createDefaultFilterValues()),
                }
              : {
                  label: "Contribute a Poem",
                  onClick: handleContribute,
                }
          }
          secondaryAction={
            !hasActiveFilters
              ? {
                  label: "Learn How",
                  onClick: () => navigate("/contribute"),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoems.map((poem) => {
            const title = isDbPoem(poem)
              ? getLocalizedContent(poem, language, "title")
              : language === "ar"
                ? poem.title
                : poem.titleEn;
            const author = isDbPoem(poem)
              ? getLocalizedContent(poem, language, "poet")
              : language === "ar"
                ? poem.author
                : poem.authorEn;
            const excerpt = isDbPoem(poem)
              ? (language === "ar" ? poem.contentAr : poem.contentEn)?.split("\n")[0] ?? ""
              : language === "ar"
                ? poem.excerpt
                : poem.excerptEn;
            const period = isDbPoem(poem) ? (poem.period ?? poem.year ?? "—") : poem.period;
            const tags = (isDbPoem(poem) ? poem.tags : poem.tags) ?? [];

            const cardContent = (
              <>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {period}
                  </span>
                  <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{author}</p>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            );

            const poemSlug = isDbPoem(poem) ? poem.slug : (poem as { slug?: string }).slug ?? String(poem.id);
            return (
              <Link
                key={isDbPoem(poem) ? poem.id : poem.id}
                href={`/poems/${poemSlug}`}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all block"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      )}
    </SectionLayout>
  );
}
