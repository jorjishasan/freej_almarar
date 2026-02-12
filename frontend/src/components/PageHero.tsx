import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
  height?: "small" | "medium" | "large";
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  children,
  height = "medium",
}: PageHeroProps) {
  const heightClasses = {
    small: "h-[40vh] min-h-[300px]",
    medium: "h-[60vh] min-h-[400px]",
    large: "h-[75vh] min-h-[500px]",
  };

  return (
    <section
      className={`relative ${heightClasses[height]} overflow-hidden mt-16 flex items-center justify-center`}
    >
      {/* Background Image or Gradient */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-[1px]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {subtitle}
          </p>
        )}
        
        {children && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {children}
          </div>
        )}
      </div>

      {/* Subtle gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </section>
  );
}
