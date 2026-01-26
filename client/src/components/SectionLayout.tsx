// client/src/components/SectionLayout.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchFilters, FilterConfig, FilterValues } from "@/components/SearchFilters";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  title: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  heroImage?: string;
  backLabel?: string;
  backLabelAr?: string;
  // Search and filter props
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchPlaceholderAr?: string;
  filters?: FilterConfig[];
  filterValues?: FilterValues;
  onFilterChange?: (values: FilterValues) => void;
  // Content
  children: React.ReactNode;
};

export function SectionLayout({
  title,
  titleAr,
  subtitle,
  subtitleAr,
  heroImage,
  backLabel = "Back",
  backLabelAr = "رجوع",
  showSearch = true,
  searchPlaceholder = "Search...",
  searchPlaceholderAr = "بحث...",
  filters = [],
  filterValues,
  onFilterChange,
  children,
}: Props) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const displayTitle = isArabic && titleAr ? titleAr : title;
  const displaySubtitle = isArabic && subtitleAr ? subtitleAr : subtitle;
  const displayBackLabel = isArabic ? backLabelAr : backLabel;

  // Use browser history to go back
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* HERO */}
        <section
          className={`border-b border-border ${heroImage ? "text-white" : ""}`}
          style={
            heroImage
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url(${heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div className="max-w-7xl mx-auto px-6 py-16">
            <button 
              onClick={handleBack}
              className={`mb-6 flex items-center text-sm ${heroImage ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"} transition-colors`}
            >
              <ArrowLeft className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              {displayBackLabel}
            </button>

            <h1 className="text-4xl md:text-5xl font-light">{displayTitle}</h1>
            {displaySubtitle && (
              <p className={`mt-3 max-w-2xl ${heroImage ? "text-white/80" : "text-muted-foreground"}`}>
                {displaySubtitle}
              </p>
            )}
          </div>
        </section>

        {/* SEARCH & FILTERS */}
        {showSearch && filterValues && onFilterChange && (
          <section className="border-b border-border bg-muted/30">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <SearchFilters
                filters={filters}
                values={filterValues}
                onChange={onFilterChange}
                searchPlaceholder={searchPlaceholder}
                searchPlaceholderAr={searchPlaceholderAr}
                showFiltersButton={filters.length > 0}
              />
            </div>
          </section>
        )}

        {/* CONTENT */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">{children}</div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Re-export filter types for convenience
export type { FilterConfig, FilterValues } from "@/components/SearchFilters";
export { createDefaultFilterValues } from "@/components/SearchFilters";
