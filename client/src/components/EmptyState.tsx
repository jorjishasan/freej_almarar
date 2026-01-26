import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-xl p-12 text-center shadow-lg">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6">
            <Icon className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-light text-foreground mb-3 tracking-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {primaryAction && (
                <Button
                  onClick={primaryAction.onClick}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  onClick={secondaryAction.onClick}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}

          {/* Custom children */}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  );
}
