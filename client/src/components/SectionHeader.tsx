import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  centered?: boolean;
}

export function SectionHeader({
  title,
  description,
  action,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 ${
        centered ? "text-center" : "flex items-end justify-between"
      }`}
    >
      <div className={centered ? "max-w-3xl mx-auto" : "flex-1"}>
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-3 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground text-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && !centered && <div className="ml-6">{action}</div>}
      {action && centered && <div className="mt-6">{action}</div>}
    </div>
  );
}
