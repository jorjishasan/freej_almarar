import { Link, useRoute, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { getLocalizedContent } from "@shared/language";
import { ChevronLeft, Heart, Share2, MoreHorizontal } from "lucide-react";

export default function PoemDetail() {
  const [, params] = useRoute("/poems/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug ?? "";
  const { language, t } = useLanguage();
  const isArabic = language === "ar";

  const poetSlugFromUrl = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("poet");
  const backHref = poetSlugFromUrl ? `/poets/${poetSlugFromUrl}` : "/poems";

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(backHref);
    }
  };

  const { data, isLoading } = trpc.poems.getDetailBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (!slug) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="h-12 w-3/4 mx-auto bg-muted rounded" />
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-24 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-24 bg-muted rounded" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-24 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-24 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data?.poem) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-3xl mx-auto px-6 py-12 text-center">
            <h1 className="text-2xl font-semibold mb-4">{t("noResults")}</h1>
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {poetSlugFromUrl ? (isArabic ? "العودة للشاعر" : "Back to poet") : (isArabic ? "العودة للقصائد" : "Back to Poems")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { poem, poet, otherPoems } = data;
  const title = getLocalizedContent(poem, language, "title");
  const content = (isArabic ? poem.contentAr : poem.contentEn) ?? "";
  const verses = content.split("\n").filter((v) => v.trim() !== "");

  const rightVerses = verses.filter((_, i) => i % 2 === 0);
  const leftVerses = verses.filter((_, i) => i % 2 === 1);

  const backLabel = poetSlugFromUrl
    ? (isArabic ? "العودة للشاعر" : "Back to poet")
    : (isArabic ? "العودة للقصائد" : "Back to Poems");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Top nav: Back to poet | Icons */}
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className={`h-4 w-4 ${isArabic ? "ml-1 order-2" : "mr-1"}`} />
              <span>{backLabel}</span>
            </button>
            <div className="flex items-center gap-4">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50" aria-label="Like">
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50" aria-label="Share">
                <Share2 className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50" aria-label="More options">
                <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Poem title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12" dir={isArabic ? "rtl" : "ltr"}>
            {title}
          </h1>

          {/* Verses: two columns (right: 1,3 | left: 2,4) — RTL places first col on right */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12`} dir={isArabic ? "rtl" : "ltr"}>
            <div className="space-y-6">
              {rightVerses.map((text, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-sm font-bold text-muted-foreground">
                    {isArabic ? `بيت ${i * 2 + 1}` : `Verse ${i * 2 + 1}`}
                  </h3>
                  <p className="text-lg leading-relaxed" dir="rtl" style={{ textAlign: "right" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {leftVerses.map((text, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-sm font-bold text-muted-foreground">
                    {isArabic ? `بيت ${i * 2 + 2}` : `Verse ${i * 2 + 2}`}
                  </h3>
                  <p className="text-lg leading-relaxed" dir="rtl" style={{ textAlign: "right" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Description - commented out */}
          {false && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold">{isArabic ? "الوصف" : "Description"}</h2>
                <Badge variant="secondary" className="bg-orange-500/15 text-orange-700 dark:text-orange-400 border-0">
                  {isArabic ? "(ليس متاحاً دائماً)" : "(Not always available)"}
                </Badge>
              </div>
              <Input
                placeholder={isArabic ? "أضف وصفاً لهذه القصيدة..." : "Add a description for this poem..."}
                className="border-border"
              />
            </section>
          )}

          {/* Comments */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-3">{isArabic ? "التعليقات" : "Comments"}</h2>
            <div className="flex gap-3 mb-6">
              <Textarea
                placeholder={isArabic ? "أضف تعليقاً..." : "Add a comment..."}
                className="flex-1 min-h-[80px] resize-none"
                rows={3}
              />
              <Button variant="outline" className="self-end shrink-0">
                {isArabic ? "نشر" : "Post"}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm">{isArabic ? "اسم المستخدم" : "User Name"}</span>
                    <span className="text-xs text-muted-foreground">{isArabic ? "منذ يوم" : "1 day ago"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isArabic ? "محتوى التعليق هنا..." : "Comment content here..."}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      {isArabic ? "رد" : "Reply"}
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Heart className="h-4 w-4" strokeWidth={1.5} />
                      <span>0</span>
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {isArabic ? "عرض المزيد من التعليقات" : "View more comments"}
                </button>
              </div>
            </div>
          </section>

          {/* More by this poet */}
          {poet && (
            <section>
              <h2 className="text-xl font-bold mb-4">
                {isArabic ? "المزيد من هذا الشاعر" : "More by this poet"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {otherPoems.length > 0 ? (
                  otherPoems.map((p) => (
                    <Link key={p.id} href={`/poems/${p.slug}${poet?.slug ? `?poet=${poet.slug}` : ""}`}>
                      <Button variant="outline" className="h-auto py-3 px-4 text-left font-normal">
                        {getLocalizedContent(p, language, "title")}
                      </Button>
                    </Link>
                  ))
                ) : (
                  <Link href={`/poets/${poet.slug}`}>
                    <Button variant="outline" className="h-auto py-3 px-4">
                      {isArabic ? "عرض كل قصائد هذا الشاعر" : "View all poems by this poet"}
                    </Button>
                  </Link>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
