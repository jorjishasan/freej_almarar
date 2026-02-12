import { useLocation } from "wouter";
import { Share2 } from "lucide-react";
import { SectionLayout, FilterConfig, FilterValues, createDefaultFilterValues } from "@/components/SectionLayout";
import { EmptyState } from "@/components/EmptyState";
import { useFilters } from "@/hooks/useFilters";
import { getLocalizedContent } from "@shared/language";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample repost data for demonstration
const sampleReposts = [
  {
    id: 1,
    titleEn: "Old Photo from Freej AlMarar",
    titleAr: "صورة قديمة من فريج المرر",
    descriptionEn: "A beautiful vintage photograph showing the traditional architecture of Freej AlMarar in the 1950s.",
    descriptionAr: "صورة جميلة قديمة تُظهر العمارة التقليدية لفريج المرر في الخمسينيات.",
    sourceType: "instagram" as const,
    sourceNameEn: "@heritage_archive",
    sourceNameAr: "@heritage_archive",
    category: "heritage",
    tags: ["tradition", "history", "architecture"],
    thumbnailUrl: "/images/aerial-1.jpg",
    slug: "old-photo-freej-almarar",
    publishedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    titleEn: "Community Gathering",
    titleAr: "تجمع مجتمعي",
    descriptionEn: "Members of the community coming together for a traditional celebration in the old neighborhood.",
    descriptionAr: "أعضاء المجتمع يجتمعون معاً للاحتفال التقليدي في الحي القديم.",
    sourceType: "facebook" as const,
    sourceNameEn: "Freej AlMarar Community",
    sourceNameAr: "مجتمع فريج المرر",
    category: "community",
    tags: ["community", "celebration", "memories"],
    thumbnailUrl: "/images/aerial-2.jpg",
    slug: "community-gathering",
    publishedAt: new Date("2024-02-20"),
  },
  {
    id: 3,
    titleEn: "Historical Document",
    titleAr: "وثيقة تاريخية",
    descriptionEn: "An important historical document preserved from the early days of Freej AlMarar.",
    descriptionAr: "وثيقة تاريخية مهمة محفوظة من الأيام الأولى لفريج المرر.",
    sourceType: "manual" as const,
    sourceNameEn: "Heritage Archive",
    sourceNameAr: "أرشيف التراث",
    category: "history",
    tags: ["history", "heritage", "document"],
    thumbnailUrl: "/images/aerial-3.jpg",
    slug: "historical-document",
    publishedAt: new Date("2024-03-10"),
  },
  {
    id: 4,
    titleEn: "Family Memories",
    titleAr: "ذكريات عائلية",
    descriptionEn: "Precious family moments captured and shared by community members.",
    descriptionAr: "لحظات عائلية ثمينة تم التقاطها ومشاركتها من قبل أعضاء المجتمع.",
    sourceType: "twitter" as const,
    sourceNameEn: "@family_heritage",
    sourceNameAr: "@family_heritage",
    category: "heritage",
    tags: ["family", "memories", "tradition"],
    thumbnailUrl: "/images/aerial-4.jpg",
    slug: "family-memories",
    publishedAt: new Date("2024-04-05"),
  },
  {
    id: 5,
    titleEn: "Cultural Event",
    titleAr: "فعالية ثقافية",
    descriptionEn: "A cultural event celebrating the rich traditions of Freej AlMarar.",
    descriptionAr: "فعالية ثقافية تحتفل بالتقاليد الغنية لفريج المرر.",
    sourceType: "instagram" as const,
    sourceNameEn: "@culture_events",
    sourceNameAr: "@culture_events",
    category: "culture",
    tags: ["culture", "events", "community"],
    thumbnailUrl: "/images/aerial-5.jpg",
    slug: "cultural-event",
    publishedAt: new Date("2024-05-12"),
  },
];

// Filter configuration
const repostFilters: FilterConfig[] = [
  {
    id: "sourceType",
    type: "select",
    label: "Source Type",
    labelAr: "نوع المصدر",
    placeholder: "All sources",
    placeholderAr: "جميع المصادر",
    options: [
      { value: "instagram", label: "Instagram", labelAr: "إنستغرام" },
      { value: "twitter", label: "Twitter", labelAr: "تويتر" },
      { value: "facebook", label: "Facebook", labelAr: "فيسبوك" },
      { value: "manual", label: "Manual", labelAr: "يدوي" },
      { value: "other", label: "Other", labelAr: "أخرى" },
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
      { value: "community", label: "Community", labelAr: "مجتمع" },
      { value: "history", label: "History", labelAr: "تاريخ" },
      { value: "culture", label: "Culture", labelAr: "ثقافة" },
      { value: "events", label: "Events", labelAr: "فعاليات" },
    ],
  },
  {
    id: "tags",
    type: "tags",
    label: "Tags",
    labelAr: "الوسوم",
    options: [
      { value: "tradition", label: "Tradition", labelAr: "تقاليد" },
      { value: "family", label: "Family", labelAr: "عائلة" },
      { value: "memories", label: "Memories", labelAr: "ذكريات" },
      { value: "community", label: "Community", labelAr: "مجتمع" },
      { value: "heritage", label: "Heritage", labelAr: "تراث" },
      { value: "culture", label: "Culture", labelAr: "ثقافة" },
    ],
  },
];

export default function Reposts() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Use the filters hook
  const { values, setValues, filterItems, hasActiveFilters } = useFilters<typeof sampleReposts[0]>();

  // Filter the reposts
  const filteredReposts = filterItems(sampleReposts, repostFilters);

  const handleContribute = () => {
    navigate("/contribute");
  };

  return (
    <SectionLayout
      title="Reposts"
      titleAr="إعادة النشر"
      subtitle="Curated social archive entries"
      subtitleAr="مدخلات الأرشيف الاجتماعي المنسقة"
      heroImage="/images/aerial-1.jpg"
      backLabel="Back"
      backLabelAr="الرئيسية"
      showSearch={true}
      searchPlaceholder="Search reposts by title, description, or source..."
      searchPlaceholderAr="ابحث في المنشورات بالعنوان أو الوصف أو المصدر..."
      filters={repostFilters}
      filterValues={values}
      onFilterChange={setValues}
    >
      {/* Results Info */}
      {hasActiveFilters && (
        <p className="text-sm text-muted-foreground mb-6">
          {isArabic 
            ? `عرض ${filteredReposts.length} من ${sampleReposts.length} منشور`
            : `Showing ${filteredReposts.length} of ${sampleReposts.length} reposts`}
        </p>
      )}

      {/* Content Area */}
      {filteredReposts.length === 0 ? (
        <EmptyState
          icon={Share2}
          title={hasActiveFilters 
            ? (isArabic ? "لا توجد منشورات مطابقة" : "No matching reposts")
            : (isArabic ? "لا توجد منشورات متاحة بعد" : "No reposts available yet")}
          description={
            hasActiveFilters
              ? (isArabic
                  ? "حاول تعديل البحث أو الفلاتر للعثور على ما تبحث عنه."
                  : "Try adjusting your search or filters to find what you're looking for.")
              : (isArabic
                  ? "نحن نبني مجموعتنا من المنشورات الاجتماعية المنسقة. تحقق مرة أخرى قريباً أو ساهم بمنشوراتك الخاصة للمساعدة في الحفاظ على تراثنا الثقافي."
                  : "We're building our collection of curated social archive entries. Check back soon or contribute your own reposts to help preserve our cultural heritage.")
          }
          primaryAction={
            hasActiveFilters
              ? {
                  label: isArabic ? "مسح الفلاتر" : "Clear Filters",
                  onClick: () => setValues(createDefaultFilterValues()),
                }
              : {
                  label: isArabic ? "ساهم بمنشور" : "Contribute a Repost",
                  onClick: handleContribute,
                }
          }
          secondaryAction={
            !hasActiveFilters
              ? {
                  label: isArabic ? "تعلم كيف" : "Learn How",
                  onClick: () => navigate("/contribute"),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReposts.map((repost) => {
            const title = getLocalizedContent(repost, language, "title");
            const description = repost.descriptionEn || repost.descriptionAr
              ? getLocalizedContent(repost, language, "description")
              : null;
            const sourceName = repost.sourceNameEn || repost.sourceNameAr
              ? getLocalizedContent(repost, language, "sourceName")
              : null;

            // Get source type label
            const sourceTypeOption = repostFilters
              .find(f => f.id === "sourceType")
              ?.options?.find(o => o.value === repost.sourceType);
            const sourceTypeLabel = sourceTypeOption
              ? (isArabic && sourceTypeOption.labelAr ? sourceTypeOption.labelAr : sourceTypeOption.label)
              : repost.sourceType;

            return (
              <div
                key={repost.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => navigate(`/reposts/${repost.slug}`)}
              >
                {/* Thumbnail */}
                {repost.thumbnailUrl && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={repost.thumbnailUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Header with source type and icon */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {sourceTypeLabel}
                    </span>
                    <Share2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                  </h3>

                  {/* Source name or description */}
                  {sourceName && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {sourceName}
                    </p>
                  )}

                  {/* Description */}
                  {description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {description}
                    </p>
                  )}

                  {/* Category and Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {repost.category && (
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        {repost.category}
                      </span>
                    )}
                    {repost.tags && Array.isArray(repost.tags) && repost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Published date */}
                  {repost.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-3">
                      {(repost.publishedAt instanceof Date 
                        ? repost.publishedAt 
                        : new Date(repost.publishedAt)
                      ).toLocaleDateString(
                        isArabic ? "ar-SA" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionLayout>
  );
}
