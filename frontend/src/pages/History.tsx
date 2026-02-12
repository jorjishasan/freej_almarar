import { useState } from "react";
import { useLocation } from "wouter";
import { Clock } from "lucide-react";
import { SectionLayout, FilterConfig } from "@/components/SectionLayout";
import { EmptyState } from "@/components/EmptyState";
import { useFilters } from "@/hooks/useFilters";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample history data for demonstration
const sampleHistoryEntries = [
  {
    id: "1",
    title: "تأسيس الفريج",
    titleEn: "Founding of the Freej",
    period: "1900s",
    category: "origins",
    tags: ["founding", "early-history"],
    excerpt: "قصة تأسيس فريج المرر في أوائل القرن العشرين",
    excerptEn: "The story of founding Freej AlMarar in the early 20th century",
  },
  {
    id: "2",
    title: "الحياة في الخمسينيات",
    titleEn: "Life in the 1950s",
    period: "1950s",
    category: "daily-life",
    tags: ["traditions", "community"],
    excerpt: "كيف كانت الحياة اليومية في الفريج خلال الخمسينيات",
    excerptEn: "How daily life was in the Freej during the 1950s",
  },
  {
    id: "3",
    title: "التحولات الكبرى",
    titleEn: "Major Transformations",
    period: "1970s",
    category: "modernization",
    tags: ["development", "change"],
    excerpt: "التغييرات الجذرية التي شهدها الفريج مع بداية النهضة",
    excerptEn: "The radical changes the Freej witnessed with the beginning of modernization",
  },
];

// Filter configuration for history
const historyFilters: FilterConfig[] = [
  {
    id: "period",
    type: "select",
    label: "Time Period",
    labelAr: "الفترة الزمنية",
    placeholder: "All periods",
    placeholderAr: "جميع الفترات",
    options: [
      { value: "1900s", label: "1900s", labelAr: "القرن العشرين" },
      { value: "1950s", label: "1950s", labelAr: "الخمسينيات" },
      { value: "1970s", label: "1970s", labelAr: "السبعينيات" },
      { value: "1990s", label: "1990s", labelAr: "التسعينيات" },
      { value: "2000s", label: "2000s", labelAr: "الألفية الجديدة" },
    ],
  },
  {
    id: "category",
    type: "select",
    label: "Category",
    labelAr: "التصنيف",
    placeholder: "All categories",
    placeholderAr: "جميع التصنيفات",
    options: [
      { value: "origins", label: "Origins", labelAr: "الأصول" },
      { value: "daily-life", label: "Daily Life", labelAr: "الحياة اليومية" },
      { value: "modernization", label: "Modernization", labelAr: "التحديث" },
      { value: "events", label: "Events", labelAr: "الأحداث" },
    ],
  },
  {
    id: "tags",
    type: "tags",
    label: "Tags",
    labelAr: "الوسوم",
    options: [
      { value: "founding", label: "Founding", labelAr: "التأسيس" },
      { value: "early-history", label: "Early History", labelAr: "التاريخ المبكر" },
      { value: "traditions", label: "Traditions", labelAr: "التقاليد" },
      { value: "community", label: "Community", labelAr: "المجتمع" },
      { value: "development", label: "Development", labelAr: "التطوير" },
      { value: "change", label: "Change", labelAr: "التغيير" },
    ],
  },
];

export default function History() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Use the filters hook
  const { values, setValues, filterItems, hasActiveFilters } = useFilters<typeof sampleHistoryEntries[0]>();

  // Filter the history entries
  const filteredEntries = filterItems(sampleHistoryEntries, historyFilters);

  return (
    <SectionLayout
      title="History"
      titleAr="التاريخ"
      subtitle="Structured historical record of the tribe"
      subtitleAr="السجل التاريخي المنظم للقبيلة"
      heroImage="/images/aerial-1.jpg"
      filters={historyFilters}
      filterValues={values}
      onFilterChange={setValues}
      searchPlaceholder="Search history..."
      searchPlaceholderAr="ابحث في التاريخ..."
    >
      {filteredEntries.length > 0 ? (
        <>
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground mb-6">
              {isArabic 
                ? `عرض ${filteredEntries.length} من ${sampleHistoryEntries.length} سجل`
                : `Showing ${filteredEntries.length} of ${sampleHistoryEntries.length} entries`
              }
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => navigate(`/history/${entry.id}`)}
                className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
                      {entry.period}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                    {isArabic ? entry.title : entry.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isArabic ? entry.excerpt : entry.excerptEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Clock}
          title={isArabic ? "لا توجد سجلات تاريخية حالياً" : "No historical records available yet"}
          description={isArabic ? "سيتم إضافة المحتوى قريباً" : "Content will be added soon"}
          primaryAction={{
            label: isArabic ? "ساهم في التاريخ" : "Contribute to History",
            onClick: () => navigate("/contribute"),
          }}
        />
      )}
    </SectionLayout>
  );
}
