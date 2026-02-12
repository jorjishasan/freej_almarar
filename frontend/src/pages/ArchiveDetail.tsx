import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link, useLocation, useRoute } from "wouter";
import { getLocalizedContent } from "@shared/language";
import { ArrowLeft, Calendar, MapPin, Tag, Download } from "lucide-react";

export default function ArchiveDetail() {
  const { language, t } = useLanguage();
  const [, params] = useRoute("/archives/:slug");
  const [, setLocation] = useLocation();
  const { data: item, isLoading } = trpc.archives.getBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4 text-foreground">{t("noResults")}</h1>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "en" ? "Back to Previous" : "العودة للصفحة السابقة"}
          </Button>
        </div>
      </div>
    );
  }

  const title = getLocalizedContent(item, language, "title");
  const description = item.descriptionEn || item.descriptionAr 
    ? getLocalizedContent(item, language, "description")
    : null;
  const content = item.contentEn || item.contentAr 
    ? getLocalizedContent(item, language, "content")
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <span className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                Freej AlMarar
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
              <Link href="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" className="mb-8 -ml-4" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "en" ? "Back to Previous" : "العودة للصفحة السابقة"}
            </Button>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-light mb-6 text-foreground leading-tight">
              {title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              {item.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" strokeWidth={1.5} />
                  <span>{new Date(item.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
                </div>
              )}
              {(item.placeEn || item.placeAr) && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  <span>{getLocalizedContent(item, language, "place")}</span>
                </div>
              )}
              {item.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" strokeWidth={1.5} />
                  <span>{item.year}</span>
                </div>
              )}
            </div>

            {/* Categories and tags */}
            {(item.category || (item.tags && Array.isArray(item.tags) && item.tags.length > 0)) && (
              <div className="flex flex-wrap gap-2 mb-8">
                {item.category && (
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                )}
                {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                  <>
                    {item.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Thumbnail */}
            {item.thumbnailUrl && (
              <div className="mb-12 rounded border border-border overflow-hidden bg-muted">
                <img
                  src={item.thumbnailUrl}
                  alt={title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="text-lg text-foreground/80 mb-8 leading-relaxed">
                {description}
              </div>
            )}

            {/* Content */}
            {content && (
              <div className="prose prose-lg max-w-none mb-12 text-foreground/90 leading-relaxed">
                <div className="whitespace-pre-wrap">{content}</div>
              </div>
            )}

            {/* Image gallery */}
            {item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-light mb-6 text-foreground">
                  {language === "en" ? "Gallery" : "معرض الصور"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.imageUrls.map((url: string, index: number) => (
                    <div key={index} className="rounded border border-border overflow-hidden bg-muted">
                      <img
                        src={url}
                        alt={`${title} - ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File attachments */}
            {item.fileUrls && Array.isArray(item.fileUrls) && item.fileUrls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-light mb-6 text-foreground">
                  {language === "en" ? "Attachments" : "المرفقات"}
                </h2>
                <div className="space-y-3">
                  {item.fileUrls.map((url: string, index: number) => (
                    <Card key={index} className="border-border">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                      >
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {language === "en" ? "Download File" : "تحميل الملف"} {index + 1}
                        </span>
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                      </a>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
