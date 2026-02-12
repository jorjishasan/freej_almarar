import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoadingPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex justify-center px-6">
        <div className="flex flex-col items-center text-center gap-4 min-h-[70vh] justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              {isArabic ? "جاري التحميل..." : "Loading..."}
            </span>
          </div>

          <p className="text-xs text-muted-foreground max-w-md">
            {isArabic
              ? "نحضر لك التجربة، لحظة من فضلك."
              : "Preparing your experience, just a moment."}
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
            {isArabic ? "العودة للصفحة السابقة" : "Back to previous"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
