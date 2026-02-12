import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export function BackButton() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home if no history
      setLocation("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-light hover:bg-accent rounded-md transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </button>
  );
}
