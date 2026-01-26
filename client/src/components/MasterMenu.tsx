import { X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MasterMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Translations for menu items
const translations = {
  en: {
    navigation: "Navigation",
    primaryArchive: "Primary Archive",
    moreContent: "More Content",
    about: "About",
    history: "History",
    archive: "Archive",
    documents: "Documents",
    photographs: "Photographs",
    ferjan: "Ferjan",
    familyTree: "Family Tree",
    figures: "Figures",
    poems: "Poems",
    reposts: "Reposts",
    events: "Events",
    collaborations: "Collaborations",
    books: "Books",
    aboutUs: "About",
    contribute: "Contribute",
    ourProjects: "Our Projects",
  },
  ar: {
    navigation: "التنقل",
    primaryArchive: "الأرشيف الرئيسي",
    moreContent: "المزيد من المحتوى",
    about: "عنا",
    history: "التاريخ",
    archive: "الأرشيف",
    documents: "الوثائق",
    photographs: "الصور",
    ferjan: "الفرجان",
    familyTree: "شجرة العائلة",
    figures: "الشخصيات",
    poems: "القصائد",
    reposts: "إعادة النشر",
    events: "الفعاليات",
    collaborations: "التعاون",
    books: "الكتب",
    aboutUs: "من نحن",
    contribute: "ساهم معنا",
    ourProjects: "مشاريعنا",
  },
};

export function MasterMenu({ isOpen, onClose }: MasterMenuProps) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [location] = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menu Drawer */}
      <div
        className={`fixed inset-y-0 ${isRTL ? "left-0" : "right-0"} w-full max-w-sm bg-background border-${isRTL ? "r" : "l"} border-border shadow-2xl z-50 overflow-y-auto`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/50">
          <h2 className="text-xl font-medium">{t.navigation}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-5 space-y-8">
          {/* Tier 1 - Primary Archive */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
              {t.primaryArchive}
            </h3>
            <nav className="space-y-1">
              <Link href="/history">
                <div
                  className={`block px-4 py-3 text-base rounded-lg transition-colors cursor-pointer ${
                    isActive("/history")
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {t.history}
                </div>
              </Link>

              {/* Archive with Dropdown */}
              <div>
                <button
                  onClick={() => setArchiveOpen(!archiveOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-base rounded-lg transition-colors ${
                    isActive("/archive") || isActive("/archive/documents") || isActive("/archive/photographs")
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <span>{t.archive}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      archiveOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    archiveOpen ? "max-h-32 mt-1" : "max-h-0"
                  }`}
                >
                  <div className={`${isRTL ? "mr-4" : "ml-4"} space-y-1`}>
                    <Link href="/archive/documents">
                      <div
                        className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                          isActive("/archive/documents")
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {t.documents}
                      </div>
                    </Link>
                    <Link href="/archive/photographs">
                      <div
                        className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                          isActive("/archive/photographs")
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {t.photographs}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/ferjan">
                <div
                  className={`block px-4 py-3 text-base rounded-lg transition-colors cursor-pointer ${
                    isActive("/ferjan")
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {t.ferjan}
                </div>
              </Link>

              <Link href="/family-tree">
                <div
                  className={`block px-4 py-3 text-base rounded-lg transition-colors cursor-pointer ${
                    isActive("/family-tree")
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {t.familyTree}
                </div>
              </Link>

              <Link href="/figures">
                <div
                  className={`block px-4 py-3 text-base rounded-lg transition-colors cursor-pointer ${
                    isActive("/figures")
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {t.figures}
                </div>
              </Link>

              <Link href="/poems">
                <div
                  className={`block px-4 py-3 text-base rounded-lg transition-colors cursor-pointer ${
                    isActive("/poems")
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {t.poems}
                </div>
              </Link>
            </nav>
          </div>

          {/* Tier 2 - More Content */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
              {t.moreContent}
            </h3>
            <nav className="space-y-1">
              <Link href="/reposts">
                <div
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive("/reposts")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {t.reposts}
                </div>
              </Link>
              <Link href="/events">
                <div
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive("/events")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {t.events}
                </div>
              </Link>
              <Link href="/collaborations">
                <div
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive("/collaborations")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {t.collaborations}
                </div>
              </Link>
              <Link href="/books">
                <div
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive("/books")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {t.books}
                </div>
              </Link>
            </nav>
          </div>

          {/* Tier 3 - About */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
              {t.about}
            </h3>
            <nav className="space-y-1">
              <Link href="/about">
                <div
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive("/about")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {t.aboutUs}
                </div>
              </Link>
              <Link href="/contribute">
                <div
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive("/contribute")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {t.contribute}
                </div>
              </Link>
              <Link href="/our-projects">
                <div
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive("/our-projects")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {t.ourProjects}
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
