import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { SectionLayout } from "@/components/SectionLayout";
import { trpc } from "@/lib/trpc";

export default function Poets() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [, setLocation] = useLocation();
  const { data: dbPoets, isLoading } = trpc.poets.getPublishedWithPoemCount.useQuery();

  const poets =
    dbPoets?.map((p) => ({
      id: String(p.id),
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      locationEn: p.originEn ?? "",
      locationAr: p.originAr ?? "",
      poemsCount: p.poemCount ?? 0,
      imageUrl: p.profileImageUrl ?? undefined,
      slug: p.slug,
    })) ?? [];

  return (
    <SectionLayout
      title="Poets"
      titleAr="الشعراء"
      subtitle="Poets of Freej AlMarar"
      subtitleAr="شعراء فريج المرر"
      heroImage="/images/aerial-2.jpg"
      showSearch={false}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="w-full aspect-[4/5] max-h-56 bg-muted" />
              <div className="px-6 py-5 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                <div className="h-px bg-border" />
                <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
              </div>
            </div>
          ))
        ) : (
          poets.map((poet) => (
          <div
            key={poet.id}
            className="group relative bg-card text-card-foreground shadow-sm border border-border overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            onClick={() => setLocation(poet.slug ? `/poets/${poet.slug}` : "/loading")}
          >
            {/* Top avatar / portrait area - full width, slightly shorter height */}
            <div className="w-full aspect-[4/5] max-h-56 bg-muted flex items-center justify-center overflow-hidden">
              {poet.imageUrl ? (
                <img
                  src={poet.imageUrl}
                  alt={isArabic ? poet.nameAr : poet.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-[70%] h-[70%] bg-gradient-to-b from-muted to-muted/80 flex flex-col items-center justify-center">
                  {/* Simple avatar silhouette without rounded card corners */}
                  <div className="w-14 h-14 rounded-full bg-muted-foreground/40 mb-3" />
                  <div className="w-16 h-16 rounded-full bg-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Info block */}
            <div className="px-6 py-5 text-center">
              <div className="text-sm font-semibold leading-snug tracking-tight">
                {isArabic ? poet.nameAr : poet.nameEn}
              </div>
              <div className="mt-1 text-xs text-muted-foreground tracking-wide">
                {isArabic ? poet.locationAr : poet.locationEn}
              </div>

              <div className="mt-5 h-px bg-border/60" />

              <div className="mt-3 text-sm font-semibold tracking-tight group-hover:text-foreground">
                {isArabic
                  ? `${poet.poemsCount} قصائد`
                  : `${poet.poemsCount} Poems`}
              </div>
            </div>

            {/* Subtle hover glow, theme-aware */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5" />
          </div>
        ))
        )}
      </div>
    </SectionLayout>
  );
}

