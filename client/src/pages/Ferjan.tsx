import { useLocation } from "wouter";
import { MapPin } from "lucide-react";
import { SectionLayout, FilterConfig } from "@/components/SectionLayout";
import { EmptyState } from "@/components/EmptyState";
import { useFilters } from "@/hooks/useFilters";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample ferjan data for demonstration
const sampleFerjanPlaces = [
  {
    id: "1",
    name: "مستوطنة المرر",
    nameEn: "Al Marar Settlement",
    description: "مستوطنة ساحلية تاريخية",
    descriptionEn: "Historic coastal settlement",
    image: "/images/aerial-3.jpg",
    slug: "al-marar-settlement",
    region: "coastal",
    type: "settlement",
    tags: ["historic", "coastal"],
  },
  {
    id: "2",
    name: "المخيم الشمالي",
    nameEn: "Northern Encampment",
    description: "مكان تجمع القبيلة التقليدي",
    descriptionEn: "Traditional tribal gathering place",
    image: "/images/aerial-4.jpg",
    slug: "northern-encampment",
    region: "northern",
    type: "encampment",
    tags: ["gathering", "traditional"],
  },
  {
    id: "3",
    name: "الأراضي الجنوبية",
    nameEn: "Southern Territory",
    description: "أراضي الأجداد ومناطق الصيد",
    descriptionEn: "Ancestral lands and fishing grounds",
    image: "/images/aerial-5.jpg",
    slug: "southern-territory",
    region: "southern",
    type: "territory",
    tags: ["ancestral", "fishing"],
  },
];

// Filter configuration for ferjan
const ferjanFilters: FilterConfig[] = [
  {
    id: "region",
    type: "select",
    label: "Region",
    labelAr: "المنطقة",
    options: [
      { value: "", label: "All regions", labelAr: "جميع المناطق" },
      { value: "coastal", label: "Coastal", labelAr: "ساحلية" },
      { value: "northern", label: "Northern", labelAr: "شمالية" },
      { value: "southern", label: "Southern", labelAr: "جنوبية" },
      { value: "central", label: "Central", labelAr: "وسطى" },
    ],
  },
  {
    id: "type",
    type: "select",
    label: "Type",
    labelAr: "النوع",
    options: [
      { value: "", label: "All types", labelAr: "جميع الأنواع" },
      { value: "settlement", label: "Settlement", labelAr: "مستوطنة" },
      { value: "encampment", label: "Encampment", labelAr: "مخيم" },
      { value: "territory", label: "Territory", labelAr: "إقليم" },
      { value: "landmark", label: "Landmark", labelAr: "معلم" },
    ],
  },
  {
    id: "tags",
    type: "tags",
    label: "Tags",
    labelAr: "الوسوم",
    options: [
      { value: "historic", label: "Historic", labelAr: "تاريخي" },
      { value: "coastal", label: "Coastal", labelAr: "ساحلي" },
      { value: "gathering", label: "Gathering", labelAr: "تجمع" },
      { value: "traditional", label: "Traditional", labelAr: "تقليدي" },
      { value: "ancestral", label: "Ancestral", labelAr: "أجداد" },
      { value: "fishing", label: "Fishing", labelAr: "صيد" },
    ],
  },
];

export default function Ferjan() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Use the filters hook
  const { values, setValues, filterItems, hasActiveFilters } = useFilters<typeof sampleFerjanPlaces[0]>();

  // Filter the places
  const filteredPlaces = filterItems(sampleFerjanPlaces, ferjanFilters);

  return (
    <SectionLayout
      title="Ferjan"
      titleAr="الفرجان"
      subtitle="Places where the tribe lived"
      subtitleAr="الأماكن التي عاشت فيها القبيلة"
      heroImage="/images/aerial-3.jpg"
      filters={ferjanFilters}
      filterValues={values}
      onFilterChange={setValues}
      searchPlaceholder="Search places..."
      searchPlaceholderAr="ابحث في الأماكن..."
    >
      {filteredPlaces.length > 0 ? (
        <>
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground mb-6">
              {isArabic 
                ? `عرض ${filteredPlaces.length} من ${sampleFerjanPlaces.length} مكان`
                : `Showing ${filteredPlaces.length} of ${sampleFerjanPlaces.length} places`
              }
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => navigate(`/ferjan/${place.slug}`)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-xl transition-all duration-500">
                  {/* Place Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${place.image})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Icon */}
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-light text-white mb-2 group-hover:translate-y-[-2px] transition-transform duration-300">
                        {isArabic ? place.name : place.nameEn}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {isArabic ? place.description : place.descriptionEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={MapPin}
          title={isArabic ? "لا توجد أماكن حالياً" : "No places available yet"}
          description={isArabic ? "سيتم إضافة المحتوى قريباً" : "Content will be added soon"}
          primaryAction={{
            label: isArabic ? "ساهم بمكان" : "Contribute a Place",
            onClick: () => navigate("/contribute"),
          }}
        />
      )}
    </SectionLayout>
  );
}
