import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MasterMenu } from "@/components/MasterMenu";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Moon, Sun, Menu, X, Globe, ArrowLeft } from "lucide-react";

const aerialImages = [
  "/images/aerial-1.jpg",
  "/images/aerial-2.jpg",
  "/images/aerial-3.jpg",
  "/images/aerial-4.jpg",
  "/images/aerial-5.jpg",
];

// Tier 1: Primary collections - ALL same height, clean 3-col grid
const tier1Collections = [
  {
    title: "History",
    titleAr: "التاريخ",
    description: "Chronicle of our tribe's journey through time",
    descriptionAr: "سجل رحلة قبيلتنا عبر الزمن",
    path: "/history",
    image: "/images/aerial-1.jpg",
  },
  {
    title: "Archive",
    titleAr: "الأرشيف",
    description: "Documents & Photographs",
    descriptionAr: "الوثائق والصور",
    path: "/archive",
    image: "/images/aerial-2.jpg",
  },
  {
    title: "Ferjan",
    titleAr: "الفرجان",
    description: "Places where we lived",
    descriptionAr: "الأماكن التي عشنا فيها",
    path: "/ferjan",
    image: "/images/aerial-3.jpg",
  },
  {
    title: "Family Tree",
    titleAr: "شجرة العائلة",
    description: "Lineage and family branches",
    descriptionAr: "النسب والأنساب",
    path: "/family-tree",
    image: "/images/aerial-4.jpg",
  },
  {
    title: "Figures",
    titleAr: "الشخصيات",
    description: "Notable figures and personalities",
    descriptionAr: "الشخصيات البارزة والأعلام",
    path: "/figures",
    image: "/images/aerial-5.jpg",
  },
  {
    title: "Poets",
    titleAr: "الشعراء",
    description: "Poets of the tribe",
    descriptionAr: "شعراء القبيلة",
    path: "/poets",
    image: "/images/aerial-2.jpg",
  },
  // Poems - commented out
  // {
  //   title: "Poems",
  //   titleAr: "القصائد",
  //   description: "Poetry and oral traditions",
  //   descriptionAr: "الشعر والتراث الشفهي",
  //   path: "/poems",
  //   image: "/images/aerial-1.jpg",
  // },
];

// Tier 2: Secondary collections - 4 cols desktop, smaller cards
const tier2Collections = [
  {
    title: "Reposts",
    titleAr: "إعادة النشر",
    description: "Curated content",
    descriptionAr: "محتوى منتقى",
    path: "/reposts",
    image: "/images/aerial-1.jpg",
  },
  {
    title: "Events",
    titleAr: "الفعاليات",
    description: "Gatherings",
    descriptionAr: "التجمعات",
    path: "/events",
    image: "/images/aerial-2.jpg",
  },
  {
    title: "Collaborations",
    titleAr: "التعاون",
    description: "Partnerships",
    descriptionAr: "الشراكات",
    path: "/collaborations",
    image: "/images/aerial-3.jpg",
  },
  {
    title: "Books",
    titleAr: "الكتب",
    description: "Published works",
    descriptionAr: "المؤلفات المنشورة",
    path: "/books",
    image: "/images/aerial-4.jpg",
  },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === "ar";

  // Smooth crossfade between background images (8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % aerialImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* ========== GLOBAL STICKY HEADER ========== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-background border-b border-border"
        }`}
      >
        <div className="h-full max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Left: Back Button + Logo/Site Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
              {isRTL ? "فريج المرر" : "Freej AlMarar"}
            </Link>
          </div>

          {/* Center: Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium">{isRTL ? "القائمة" : "Menu"}</span>
          </button>

          {/* Right: Controls */}
          <div className="flex items-center gap-1">
            <button
              className="p-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-foreground text-sm font-medium"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              {isRTL ? "EN" : "عربي"}
            </button>
          </div>
        </div>
      </header>

      {/* Master Menu Sidebar */}
      <MasterMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ========== HERO SECTION ========== */}
      {/* Height: 65vh desktop, 50vh mobile - consistent sizing */}
      <section className="relative h-[50vh] md:h-[65vh] min-h-[400px] md:min-h-[500px] overflow-hidden mt-16">
        {/* Background Images with Crossfade */}
        {aerialImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt="Freej AlMarar aerial view"
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dark Gradient Overlay - Stronger for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-4 tracking-tight">
            {isRTL ? "فريج المرر" : "Freej AlMarar"}
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl">
            {isRTL
              ? "الحفاظ على تراثنا الثقافي للأجيال القادمة"
              : "Preserving our cultural heritage for future generations"}
          </p>
        </div>
      </section>

      {/* ========== TIER 1 - PRIMARY COLLECTIONS ========== */}
      {/* Container: max-w-[1280px], padding 24-32px */}
      {/* Grid: 3 cols desktop, 2 tablet, 1 mobile */}
      {/* Cards: ALL same height (360px), consistent design */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          {/* Section Header */}
          <div className={`mb-10 ${isRTL ? "text-right" : "text-left"}`}>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-3 tracking-tight">
              {isRTL ? "استكشف الأرشيف" : "Explore Our Archive"}
            </h2>
            <p className="text-muted-foreground text-base max-w-xl">
              {isRTL
                ? "اكتشف التاريخ والثقافة والتراث الغني لفريج المرر"
                : "Discover the rich history, culture, and heritage of Freej AlMarar"}
            </p>
          </div>

          {/* Tier 1 Grid - Clean responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {tier1Collections.map((collection) => (
              <Link key={collection.path} href={collection.path}>
                <div className="h-[320px] md:h-[360px] group relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Background Image */}
                  <img
                    src={collection.image}
                    alt={isRTL ? collection.titleAr : collection.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay - From bottom for readable titles */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-300" />

                  {/* Content - Bottom left, consistent placement */}
                  <div className={`absolute bottom-0 left-0 right-0 p-6 ${isRTL ? "text-right" : "text-left"}`}>
                    <h3 className="text-2xl md:text-3xl font-light text-white mb-2 tracking-tight group-hover:translate-y-[-4px] transition-transform duration-300">
                      {isRTL ? collection.titleAr : collection.title}
                    </h3>
                    <p className="text-sm text-white/80 font-light">
                      {isRTL ? collection.descriptionAr : collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TIER 2 - SECONDARY COLLECTIONS ========== */}
      {/* Grid: 4 cols desktop, 2 tablet, 1 mobile */}
      {/* Cards: Smaller height (200px) */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          {/* Section Header */}
          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2 tracking-tight">
              {isRTL ? "المزيد من الأرشيف" : "More from the Archive"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isRTL ? "مجموعات وموارد إضافية" : "Additional collections and resources"}
            </p>
          </div>

          {/* Tier 2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tier2Collections.map((collection) => (
              <Link key={collection.path} href={collection.path}>
                <div className="h-[180px] md:h-[200px] group relative overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Background Image */}
                  <img
                    src={collection.image}
                    alt={isRTL ? collection.titleAr : collection.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

                  {/* Content */}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 ${isRTL ? "text-right" : "text-left"}`}>
                    <h3 className="text-xl font-light text-white mb-1 tracking-tight group-hover:translate-y-[-2px] transition-transform duration-300">
                      {isRTL ? collection.titleAr : collection.title}
                    </h3>
                    <p className="text-xs text-white/70 font-light">
                      {isRTL ? collection.descriptionAr : collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ABOUT SECTION ========== */}
      {/* Integrated into container, not floating */}
      <section className="py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 tracking-tight">
              {isRTL ? "عن فريج المرر" : "About Freej AlMarar"}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              {isRTL
                ? "نحن ملتزمون بالحفاظ على التراث الثقافي الغني لقبيلة المرر ومشاركته. من خلال الوثائق والصور والتاريخ الشفهي وسجلات الأنساب، نضمن نقل تقاليدنا وقصصنا إلى الأجيال القادمة."
                : "We are dedicated to preserving and sharing the rich cultural heritage of the AlMarar tribe. Through documents, photographs, oral histories, and genealogical records, we ensure that our traditions and stories are passed down to future generations."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {isRTL ? "اعرف المزيد" : "Learn More"}
              </Link>
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-sm font-medium"
              >
                {isRTL ? "ساهم معنا" : "Contribute"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 bg-muted border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className={isRTL ? "text-right" : "text-left"}>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {isRTL ? "فريج المرر" : "Freej AlMarar"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "الحفاظ على تراثنا الثقافي للأجيال القادمة"
                  : "Preserving our cultural heritage for future generations"}
              </p>
            </div>

            {/* Explore */}
            <div className={isRTL ? "text-right" : "text-left"}>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                {isRTL ? "استكشف" : "Explore"}
              </h4>
              <ul className="space-y-2">
                <li><Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "التاريخ" : "History"}</Link></li>
                <li><Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "الأرشيف" : "Archive"}</Link></li>
                <li><Link href="/ferjan" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "الفرجان" : "Ferjan"}</Link></li>
                <li><Link href="/family-tree" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "شجرة العائلة" : "Family Tree"}</Link></li>
                <li><Link href="/figures" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "الشخصيات" : "Figures"}</Link></li>
                <li><Link href="/poems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "القصائد" : "Poems"}</Link></li>
              </ul>
            </div>

            {/* About */}
            <div className={isRTL ? "text-right" : "text-left"}>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                {isRTL ? "عنا" : "About"}
              </h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "من نحن" : "About Us"}</Link></li>
                <li><Link href="/contribute" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "ساهم معنا" : "Contribute"}</Link></li>
                <li><Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "مشاريعنا" : "Our Projects"}</Link></li>
                <li><Link href="/collaborations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "التعاون" : "Collaborations"}</Link></li>
              </ul>
            </div>

            {/* More */}
            <div className={isRTL ? "text-right" : "text-left"}>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                {isRTL ? "المزيد" : "More"}
              </h4>
              <ul className="space-y-2">
                <li><Link href="/reposts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "إعادة النشر" : "Reposts"}</Link></li>
                <li><Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "الفعاليات" : "Events"}</Link></li>
                <li><Link href="/books" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "الكتب" : "Books"}</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {isRTL ? "فريج المرر. جميع الحقوق محفوظة." : "Freej AlMarar Heritage Archive. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
