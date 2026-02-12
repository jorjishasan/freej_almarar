import { useLocation } from "wouter";
import { User } from "lucide-react";
import { SectionLayout, FilterConfig } from "@/components/SectionLayout";
import { EmptyState } from "@/components/EmptyState";
import { useFilters } from "@/hooks/useFilters";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample figures data for demonstration
const sampleFigures = [
  {
    id: "1",
    name: "محمد بن راشد المرر",
    nameEn: "Mohammed bin Rashid Al Marar",
    role: "شيخ القبيلة",
    roleEn: "Tribal Sheikh",
    period: "1920-1985",
    category: "leadership",
    tags: ["leader", "founder"],
    photoUrl: null,
    slug: "mohammed-bin-rashid",
  },
  {
    id: "2",
    name: "فاطمة بنت سالم",
    nameEn: "Fatima bint Salem",
    role: "شاعرة وراوية",
    roleEn: "Poet and Storyteller",
    period: "1935-2010",
    category: "culture",
    tags: ["poet", "storyteller"],
    photoUrl: null,
    slug: "fatima-bint-salem",
  },
  {
    id: "3",
    name: "أحمد بن علي المرر",
    nameEn: "Ahmed bin Ali Al Marar",
    role: "تاجر لؤلؤ",
    roleEn: "Pearl Merchant",
    period: "1900-1970",
    category: "commerce",
    tags: ["merchant", "pearling"],
    photoUrl: null,
    slug: "ahmed-bin-ali",
  },
];

// Filter configuration for figures
const figuresFilters: FilterConfig[] = [
  {
    id: "category",
    type: "select",
    label: "Category",
    labelAr: "التصنيف",
    placeholder: "All categories",
    placeholderAr: "جميع التصنيفات",
    options: [
      { value: "leadership", label: "Leadership", labelAr: "القيادة" },
      { value: "culture", label: "Culture", labelAr: "الثقافة" },
      { value: "commerce", label: "Commerce", labelAr: "التجارة" },
      { value: "religion", label: "Religion", labelAr: "الدين" },
      { value: "education", label: "Education", labelAr: "التعليم" },
    ],
  },
  {
    id: "period",
    type: "select",
    label: "Era",
    labelAr: "الحقبة",
    placeholder: "All eras",
    placeholderAr: "جميع الحقب",
    options: [
      { value: "pre-1900", label: "Pre-1900", labelAr: "قبل 1900" },
      { value: "1900-1950", label: "1900-1950", labelAr: "1900-1950" },
      { value: "1950-2000", label: "1950-2000", labelAr: "1950-2000" },
      { value: "2000-present", label: "2000-Present", labelAr: "2000-الحاضر" },
    ],
  },
  {
    id: "tags",
    type: "tags",
    label: "Tags",
    labelAr: "الوسوم",
    options: [
      { value: "leader", label: "Leader", labelAr: "قائد" },
      { value: "founder", label: "Founder", labelAr: "مؤسس" },
      { value: "poet", label: "Poet", labelAr: "شاعر" },
      { value: "storyteller", label: "Storyteller", labelAr: "راوي" },
      { value: "merchant", label: "Merchant", labelAr: "تاجر" },
      { value: "pearling", label: "Pearling", labelAr: "الغوص" },
    ],
  },
];

export default function Figures() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Use the filters hook
  const { values, setValues, filterItems, hasActiveFilters } = useFilters<typeof sampleFigures[0]>();

  // Filter the figures
  const filteredFigures = filterItems(sampleFigures, figuresFilters);

  return (
    <SectionLayout
      title="Figures"
      titleAr="الشخصيات"
      subtitle="Notable figures and personalities"
      subtitleAr="الشخصيات البارزة والأعلام"
      heroImage="/images/aerial-2.jpg"
      filters={figuresFilters}
      filterValues={values}
      onFilterChange={setValues}
      searchPlaceholder="Search figures..."
      searchPlaceholderAr="ابحث في الشخصيات..."
    >
      {filteredFigures.length > 0 ? (
        <>
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground mb-6">
              {isArabic 
                ? `عرض ${filteredFigures.length} من ${sampleFigures.length} شخصية`
                : `Showing ${filteredFigures.length} of ${sampleFigures.length} figures`
              }
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFigures.map((figure) => (
              <div
                key={figure.id}
                onClick={() => navigate(`/figures/${figure.slug}`)}
                className="group cursor-pointer"
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Photo */}
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {figure.photoUrl ? (
                      <img
                        src={figure.photoUrl}
                        alt={isArabic ? figure.name : figure.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <User className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                      {isArabic ? figure.name : figure.nameEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isArabic ? figure.role : figure.roleEn}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {figure.period}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={User}
          title={isArabic ? "لا توجد شخصيات حالياً" : "No figures available yet"}
          description={isArabic ? "سيتم إضافة المحتوى قريباً" : "Content will be added soon"}
          primaryAction={{
            label: isArabic ? "ساهم بشخصية" : "Contribute a Figure",
            onClick: () => navigate("/contribute"),
          }}
        />
      )}
    </SectionLayout>
  );
}
