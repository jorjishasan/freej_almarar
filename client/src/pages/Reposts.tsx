import { useLanguage } from "@/contexts/LanguageContext";
import { ContentListing } from "@/components/ContentListing";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function Reposts() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  const { data: reposts = [], isLoading } = trpc.reposts.getPublished.useQuery();

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">
            {isArabic ? "إعادة النشر" : "Reposts"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic
              ? "مدخلات الأرشيف الاجتماعي المنسقة"
              : "Curated social archive entries"}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Filter */}
        <div className="mb-8 bg-card rounded-lg p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={isArabic ? "ابحث في المنشورات..." : "Search reposts..."}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {isArabic ? "الفلاتر" : "Filters"}
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        ) : (
          <ContentListing
            items={reposts}
            type="repost"
            emptyMessage={isArabic ? "لا توجد منشورات" : "No reposts found"}
          />
        )}
      </div>
    </div>
  );
}
