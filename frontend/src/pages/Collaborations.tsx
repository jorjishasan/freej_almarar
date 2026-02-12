import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Handshake, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Collaborations() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // TODO: Connect to trpc.collaborations.getPublished.useQuery() when backend is ready
  const collaborations: any[] = [];
  const isLoading = false;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">
            {isArabic ? "التعاون" : "Collaborations"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic
              ? "شركاؤنا والمنظمات المتعاونة"
              : "Our partners and collaborating organizations"}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        ) : collaborations.length === 0 ? (
          <div className="text-center py-16">
            <Handshake className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">
              {isArabic ? "لا توجد تعاونات حالياً" : "No collaborations available yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {isArabic ? "سيتم إضافة المحتوى قريباً" : "Content will be added soon"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborations.map((collab: any) => (
              <Card key={collab.id} className="overflow-hidden hover:shadow-lg transition-all group">
                {/* Logo */}
                {collab.logoUrl && (
                  <div className="aspect-video bg-muted flex items-center justify-center p-8">
                    <img
                      src={collab.logoUrl}
                      alt={isArabic ? collab.nameAr : collab.nameEn}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {isArabic ? collab.nameAr : collab.nameEn}
                  </h3>
                  {collab.descriptionEn && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {isArabic ? collab.descriptionAr : collab.descriptionEn}
                    </p>
                  )}

                  {/* Links */}
                  <div className="flex gap-2">
                    {collab.websiteUrl && (
                      <a
                        href={collab.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {isArabic ? "الموقع" : "Website"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {collab.internalLink && (
                      <Link href={collab.internalLink}>
                        <span className="text-sm text-primary hover:underline cursor-pointer">
                          {isArabic ? "المزيد" : "Learn more"}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
