import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLocalizedContent } from "@shared/language";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, User, ChevronRight } from "lucide-react";

interface ContentItem {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  slug: string;
  thumbnailUrl?: string | null;
  category?: string | null;
  publishedAt?: Date | null;
  [key: string]: any;
}

interface ContentListingProps {
  items: ContentItem[];
  type: "archive" | "photo" | "poem" | "book" | "heritage" | "event" | "person" | "repost";
  emptyMessage?: string;
}

export function ContentListing({ items, type, emptyMessage }: ContentListingProps) {
  const { language, t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">
          {emptyMessage || t("noResults")}
        </p>
      </div>
    );
  }

  // Grid layout for photos, books, and people (visual content)
  const isGridLayout = type === "photo" || type === "book" || type === "person";

  if (isGridLayout) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} type={type} language={language} />
        ))}
      </div>
    );
  }

  // List layout for text-heavy content
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ContentListItem key={item.id} item={item} type={type} language={language} />
      ))}
    </div>
  );
}

function ContentCard({ item, type, language }: { item: ContentItem; type: string; language: "en" | "ar" }) {
  const title = getLocalizedContent(item, language, "title");
  const description = item.descriptionEn || item.descriptionAr 
    ? getLocalizedContent(item, language, "description")
    : null;

  return (
    <Link href={`/${type}s/${item.slug}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full border-border">
        {item.thumbnailUrl && (
          <div className="aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={item.thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        {item.photoUrl && (
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={item.photoUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        {item.coverImageUrl && (
          <div className="aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={item.coverImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <CardContent className="p-5">
          <h3 className="font-medium mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            {item.category && (
              <Badge variant="secondary" className="text-xs">{item.category}</Badge>
            )}
            {item.year && (
              <span className="text-xs text-muted-foreground">{item.year}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ContentListItem({ item, type, language }: { item: ContentItem; type: string; language: "en" | "ar" }) {
  const title = getLocalizedContent(item, language, "title");
  const description = item.descriptionEn || item.descriptionAr 
    ? getLocalizedContent(item, language, "description")
    : null;

  return (
    <Card className="hover:shadow-md transition-all border-border group">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {item.thumbnailUrl && (
            <Link href={`/${type}s/${item.slug}`}>
              <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded border border-border bg-muted cursor-pointer">
                <img
                  src={item.thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <Link href={`/${type}s/${item.slug}`}>
              <h3 className="text-xl font-medium mb-2 hover:text-primary transition-colors cursor-pointer text-foreground">
                {title}
              </h3>
            </Link>
            
            {description && (
              <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {item.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" strokeWidth={1.5} />
                  <span>{new Date(item.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
                </div>
              )}
              {item.startDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" strokeWidth={1.5} />
                  <span>{new Date(item.startDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
                </div>
              )}
              {(item.placeEn || item.placeAr) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  <span>{getLocalizedContent(item, language, "place")}</span>
                </div>
              )}
              {(item.locationEn || item.locationAr) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  <span>{getLocalizedContent(item, language, "location")}</span>
                </div>
              )}
              {item.photographer && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  <span>{item.photographer}</span>
                </div>
              )}
              {(item.poetEn || item.poetAr) && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  <span>{getLocalizedContent(item, language, "poet")}</span>
                </div>
              )}
              {(item.authorEn || item.authorAr) && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  <span>{getLocalizedContent(item, language, "author")}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {item.category && (
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                )}
                {item.year && (
                  <Badge variant="outline" className="text-xs">{item.year}</Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-primary group-hover:gap-1 transition-all">
                <span>{language === "ar" ? "عرض" : "View"}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
