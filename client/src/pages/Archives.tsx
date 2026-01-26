import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { ContentListing } from "@/components/ContentListing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Archive } from "lucide-react";

export default function Archives() {
  const { language, t } = useLanguage();
  const { data: archives, isLoading } = trpc.archives.getPublished.useQuery();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <a className="text-xl font-bold hover:opacity-80 transition-opacity">
                Freej AlMarar
              </a>
            </Link>
            
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Archive className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">{t("archives")}</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Explore our collection of historical documents, artifacts, and records that preserve our cultural heritage."
                : "استكشف مجموعتنا من الوثائق التاريخية والآثار والسجلات التي تحفظ تراثنا الثقافي."}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t("loading")}</p>
            </div>
          ) : (
            <ContentListing
              items={archives || []}
              type="archive"
              emptyMessage={
                language === "en"
                  ? "No archive items available yet."
                  : "لا توجد عناصر أرشيف متاحة حتى الآن."
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
