import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { ContentListing } from "@/components/ContentListing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Image } from "lucide-react";

export default function Photos() {
  const { language, t } = useLanguage();
  const { data: photos, isLoading } = trpc.photos.getPublished.useQuery();

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full">
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

      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Image className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">{t("photos")}</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Browse our visual heritage collection capturing moments from our history and culture."
                : "تصفح مجموعة تراثنا البصري التي تلتقط لحظات من تاريخنا وثقافتنا."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="w-full">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t("loading")}</p>
            </div>
          ) : (
            <ContentListing
              items={photos || []}
              type="photo"
              emptyMessage={
                language === "en"
                  ? "No photos available yet."
                  : "لا توجد صور متاحة حتى الآن."
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
