import { useLocation, Link } from "wouter";
import { FileText, Image as ImageIcon, ChevronRight, Archive } from "lucide-react";
import { SectionLayout, FilterConfig } from "@/components/SectionLayout";
import { useFilters } from "@/hooks/useFilters";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

// Archive collections
const collections = [
  {
    id: "documents",
    title: "Documents",
    titleAr: "الوثائق",
    description: "Historical documents, artifacts, and records",
    descriptionAr: "الوثائق التاريخية والتحف والسجلات",
    url: "/archive/documents",
    image: "/images/aerial-2.jpg",
    icon: FileText,
    count: 150,
  },
  {
    id: "photographs",
    title: "Photographs",
    titleAr: "الصور",
    description: "Visual heritage and photographic archive",
    descriptionAr: "التراث البصري وأرشيف الصور",
    url: "/archive/photographs",
    image: "/images/aerial-3.jpg",
    icon: ImageIcon,
    count: 320,
  },
];

// Filter configuration for archive
const archiveFilters: FilterConfig[] = [
  {
    id: "type",
    type: "select",
    label: "Type",
    labelAr: "النوع",
    placeholder: "All types",
    placeholderAr: "جميع الأنواع",
    options: [
      { value: "documents", label: "Documents", labelAr: "الوثائق" },
      { value: "photographs", label: "Photographs", labelAr: "الصور" },
    ],
  },
  {
    id: "period",
    type: "select",
    label: "Period",
    labelAr: "الفترة",
    placeholder: "All periods",
    placeholderAr: "جميع الفترات",
    options: [
      { value: "pre-1950", label: "Pre-1950", labelAr: "قبل 1950" },
      { value: "1950-1970", label: "1950-1970", labelAr: "1950-1970" },
      { value: "1970-1990", label: "1970-1990", labelAr: "1970-1990" },
      { value: "1990-present", label: "1990-Present", labelAr: "1990-الحاضر" },
    ],
  },
  {
    id: "tags",
    type: "tags",
    label: "Topics",
    labelAr: "المواضيع",
    options: [
      { value: "family", label: "Family", labelAr: "العائلة" },
      { value: "places", label: "Places", labelAr: "الأماكن" },
      { value: "events", label: "Events", labelAr: "الأحداث" },
      { value: "traditions", label: "Traditions", labelAr: "التقاليد" },
      { value: "people", label: "People", labelAr: "الأشخاص" },
    ],
  },
];

export default function ArchiveHub() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Use the filters hook
  const { values, setValues } = useFilters();

  return (
    <SectionLayout
      title="Archive"
      titleAr="الأرشيف"
      subtitle="Documents and photographs from our past"
      subtitleAr="الوثائق والصور من ماضينا"
      heroImage="/images/aerial-2.jpg"
      filters={archiveFilters}
      filterValues={values}
      onFilterChange={setValues}
      searchPlaceholder="Search the archive..."
      searchPlaceholderAr="ابحث في الأرشيف..."
    >
      {/* Collections Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {collections.map((collection) => (
          <Link key={collection.id} href={collection.url}>
            <div className="group block cursor-pointer">
              <div className="relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-2xl transition-all duration-500">
                {/* Collection Image */}
                <div className="relative h-80 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${collection.image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <collection.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  
                  {/* Count Badge */}
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                    {collection.count} {isArabic ? "عنصر" : "items"}
                  </div>
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="text-4xl font-light text-white mb-3 group-hover:translate-y-[-4px] transition-transform duration-300">
                      {isArabic ? collection.titleAr : collection.title}
                    </h3>
                    <p className="text-white/80 text-lg mb-4">
                      {isArabic ? collection.descriptionAr : collection.description}
                    </p>
                    <div className="flex items-center text-white font-medium group-hover:gap-2 transition-all">
                      <span>{isArabic ? "استكشف المجموعة" : "Explore Collection"}</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-muted/30 rounded-lg p-12 border border-border max-w-4xl mx-auto">
        <Archive className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-3xl font-light mb-4 text-foreground">
          {isArabic ? "ساهم في الأرشيف" : "Contribute to the Archive"}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {isArabic 
            ? "هل لديك وثائق أو صور تريد مشاركتها؟ ساعدنا في الحفاظ على تراثنا الثقافي."
            : "Do you have documents or photographs you'd like to share? Help us preserve our cultural heritage."
          }
        </p>
        <Button 
          size="lg" 
          className="gap-2"
          onClick={() => navigate("/contribute")}
        >
          {isArabic ? "أرسل مساهمة" : "Submit a Contribution"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </SectionLayout>
  );
}
