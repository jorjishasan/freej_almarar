import { useRoute, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";
import { SectionLayout } from "@/components/SectionLayout";
import { EmptyState } from "@/components/EmptyState";
import { trpc } from "@/lib/trpc";
import { getLocalizedContent } from "@shared/language";

export default function PoetPoems() {
  const [, params] = useRoute("/poets/:slug");
  const slug = params?.slug ?? "";
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { data, isLoading } = trpc.poems.getByPoetSlug.useQuery({ poetSlug: slug }, { enabled: !!slug });

  const poet = data?.poet;
  const poems = data?.poems ?? [];

  if (!slug) {
    return null;
  }

  const poetName = poet ? getLocalizedContent(poet, language, "name") : slug;

  return (
    <SectionLayout
      title={poetName}
      titleAr={poet?.nameAr ?? poetName}
      subtitle={poet ? getLocalizedContent(poet, language, "origin") : ""}
      subtitleAr={poet?.originAr ?? ""}
      heroImage="/images/aerial-5.jpg"
      backLabel="Back to Poets"
      backLabelAr="العودة للشعراء"
      // backHref="/poets"
      showSearch={false}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : poems.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={poet ? "No poems yet" : "Poet not found"}
          description={
            poet
              ? "This poet doesn't have any published poems yet."
              : "The poet you're looking for doesn't exist or has been removed."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem) => {
            const title = getLocalizedContent(poem, language, "title");
            const author = getLocalizedContent(poem, language, "poet");
            const excerpt = (language === "ar" ? poem.contentAr : poem.contentEn)?.split("\n")[0] ?? "";
            const tags = poem.tags ?? [];

            return (
              <Link
                key={poem.id}
                href={`/poems/${poem.slug}?poet=${slug}`}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all block"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {poem.period ?? poem.year ?? "—"}
                  </span>
                  <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                {author && (
                  <p className="text-sm text-muted-foreground mb-4">{author}</p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {excerpt}
                </p>
                {tags.length > 0 && (
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
                )}
              </Link>
            );
          })}
        </div>
      )}
    </SectionLayout>
  );
}
