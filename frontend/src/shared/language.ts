export type Language = "en" | "ar";

export const DEFAULT_LANGUAGE: Language = "en";

export interface BilingualContent {
  en: string;
  ar: string;
}

/**
 * Get content in the specified language from a bilingual object
 */
export function getLocalizedContent<T extends Record<string, any>>(
  item: T,
  language: Language,
  fieldPrefix: string
): string {
  const enField = `${fieldPrefix}En` as keyof T;
  const arField = `${fieldPrefix}Ar` as keyof T;
  
  if (language === "ar" && item[arField]) {
    return String(item[arField]);
  }
  
  return String(item[enField] || item[arField] || "");
}

/**
 * UI translations for the heritage archive
 */
export const translations = {
  en: {
    // Navigation
    home: "Home",
    archives: "Archives",
    photos: "Photos",
    poems: "Poems",
    books: "Books",
    heritage: "Heritage",
    events: "Events",
    people: "People",
    poets: "Poets",
    reposts: "Reposts",
    about: "About",
    contact: "Contact",
    
    // Common actions
    viewAll: "View All",
    viewDetails: "View Details",
    readMore: "Read More",
    learnMore: "Learn More",
    contribute: "Contribute",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    
    // Homepage sections
    featuredCollections: "Featured Collections",
    latestAdditions: "Latest Additions",
    exploreByPlace: "Explore by Place",
    community: "Community",
    upcomingEvents: "Upcoming Events",
    
    // Content metadata
    publishedOn: "Published on",
    author: "Author",
    photographer: "Photographer",
    poet: "Poet",
    year: "Year",
    place: "Place",
    category: "Category",
    tags: "Tags",
    
    // Admin panel
    dashboard: "Dashboard",
    contentManagement: "Content Management",
    navigationEditor: "Navigation Editor",
    settings: "Settings",
    logout: "Logout",
    
    // Workflow status
    draft: "Draft",
    review: "Under Review",
    published: "Published",
    featured: "Featured",
    
    // Messages
    noResults: "No results found",
    loading: "Loading...",
    error: "An error occurred",
    success: "Success",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    archives: "الأرشيف",
    photos: "الصور",
    poems: "القصائد",
    books: "الكتب",
    heritage: "التراث",
    events: "الفعاليات",
    people: "الأشخاص",
    poets: "الشعراء",
    reposts: "إعادة نشر",
    about: "عن المشروع",
    contact: "اتصل بنا",
    
    // Common actions
    viewAll: "عرض الكل",
    viewDetails: "عرض التفاصيل",
    readMore: "اقرأ المزيد",
    learnMore: "تعرف على المزيد",
    contribute: "ساهم معنا",
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    
    // Homepage sections
    featuredCollections: "مجموعات مميزة",
    latestAdditions: "أحدث الإضافات",
    exploreByPlace: "استكشف حسب المكان",
    community: "المجتمع",
    upcomingEvents: "الفعاليات القادمة",
    
    // Content metadata
    publishedOn: "نُشر في",
    author: "المؤلف",
    photographer: "المصور",
    poet: "الشاعر",
    year: "السنة",
    place: "المكان",
    category: "التصنيف",
    tags: "الوسوم",
    
    // Admin panel
    dashboard: "لوحة التحكم",
    contentManagement: "إدارة المحتوى",
    navigationEditor: "محرر القوائم",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    
    // Workflow status
    draft: "مسودة",
    review: "قيد المراجعة",
    published: "منشور",
    featured: "مميز",
    
    // Messages
    noResults: "لا توجد نتائج",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    success: "نجح",
  },
};

export type TranslationKey = keyof typeof translations.en;

/**
 * Get translation for a key in the specified language
 */
export function t(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.en[key] || key;
}
