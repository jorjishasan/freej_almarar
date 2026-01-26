import { useLanguage } from "@/contexts/LanguageContext";
import { ContentListing } from "@/components/ContentListing";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

export default function Documents() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  const { data: documents = [], isLoading } = trpc.archives.getPublished.useQuery();

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="border-b border-border bg-muted/20">
        <div className="container py-16">
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
            {isArabic ? "الوثائق" : "Documents"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {isArabic
              ? "الوثائق التاريخية والمصنوعات والسجلات"
              : "Historical documents, artifacts, and records"}
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Search and Filter */}
        <Card className="mb-12 p-6 border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={isArabic ? "ابحث في الوثائق..." : "Search documents..."}
                className="pl-10 border-border"
              />
            </div>
            <Button variant="outline" className="gap-2 border-border">
              <Filter className="h-4 w-4" />
              {isArabic ? "الفلاتر" : "Filters"}
            </Button>
          </div>
        </Card>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        ) : (
          <ContentListing
            items={documents}
            type="archive"
            emptyMessage={isArabic ? "لا توجد وثائق" : "No documents found"}
          />
        )}
      </div>
    </div>
  );
}
