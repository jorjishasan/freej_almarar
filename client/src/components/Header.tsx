import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, Moon, Sun, X, ArrowLeft } from "lucide-react";
import { MasterMenu } from "./MasterMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavHistory } from "@/context/NavHistoryContext";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();
  const { pop, hasBack } = useNavHistory();
  
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    // Default to dark mode if no preference set
    return saved === null ? true : saved === "true";
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Detect scroll for glass morphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close overlays on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Toggle language and RTL
  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <>
      {/* Premium Header Control Center */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50"
            : "bg-background/98 backdrop-blur-md border-b border-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {hasBack() && (
              <button
                onClick={() => {
                  const prev = pop();
                  if (prev) {
                    setLocation(prev);
                  } else {
                    setLocation("/");
                  }
                }}
                className="p-2 rounded-md hover:bg-accent transition"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            <Link href="/">
              <span className="text-lg font-light cursor-pointer whitespace-nowrap">
                Freej AlMarar
              </span>
            </Link>
          </div>

          {/* CENTER: Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-lg hover:bg-accent/80 active:scale-95 transition-all duration-200"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm font-light tracking-wide">Menu</span>
          </button>

          {/* RIGHT: Search + Theme + Language */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-lg hover:bg-accent/80 active:scale-95 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg hover:bg-accent/80 active:scale-95 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Moon className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
            
            <button
              onClick={toggleLanguage}
              className="text-sm font-light px-3 py-2 rounded-lg hover:bg-accent/80 active:scale-95 transition-all duration-200 tracking-wide"
              aria-label="Toggle language"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </header>

      {/* Master Menu Sidebar */}
      <MasterMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Global Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32 animate-in fade-in duration-200"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-3xl px-4 animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-light tracking-tight">Search Archive</h2>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Search documents, photos, poems, places, people..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                autoFocus
              />
              
              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>
                to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
