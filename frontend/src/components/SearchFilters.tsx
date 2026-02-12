// client/src/components/SearchFilters.tsx
import { useState, useCallback } from "react";
import { Search, Filter, X, ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

// Filter configuration types
export type FilterType = "select" | "multiselect" | "daterange" | "tags";

export interface FilterOption {
  value: string;
  label: string;
  labelAr?: string;
}

export interface FilterConfig {
  id: string;
  type: FilterType;
  label: string;
  labelAr?: string;
  placeholder?: string;
  placeholderAr?: string;
  options?: FilterOption[];
}

export interface FilterValues {
  search: string;
  [key: string]: string | string[] | { from?: string; to?: string };
}

interface SearchFiltersProps {
  filters?: FilterConfig[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  searchPlaceholder?: string;
  searchPlaceholderAr?: string;
  showFiltersButton?: boolean;
  className?: string;
}

export function SearchFilters({
  filters = [],
  values,
  onChange,
  searchPlaceholder = "Search...",
  searchPlaceholderAr = "بحث...",
  showFiltersButton = true,
  className = "",
}: SearchFiltersProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...values, search: e.target.value });
    },
    [values, onChange]
  );

  const handleFilterChange = useCallback(
    (filterId: string, value: string | string[]) => {
      onChange({ ...values, [filterId]: value });
    },
    [values, onChange]
  );

  const handleClearFilter = useCallback(
    (filterId: string) => {
      const newValues = { ...values };
      delete newValues[filterId];
      onChange(newValues);
    },
    [values, onChange]
  );

  const handleClearAll = useCallback(() => {
    onChange({ search: "" });
  }, [onChange]);

  // Count active filters (excluding search)
  const activeFilterCount = Object.keys(values).filter(
    (key) => key !== "search" && values[key] && 
    (Array.isArray(values[key]) ? (values[key] as string[]).length > 0 : values[key] !== "")
  ).length;

  const hasActiveFilters = activeFilterCount > 0 || values.search.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar Row */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={values.search}
            onChange={handleSearchChange}
            placeholder={isArabic ? searchPlaceholderAr : searchPlaceholder}
            className="pl-10 pr-4 h-11 bg-muted/50 border-border focus:bg-background"
          />
          {values.search && (
            <button
              onClick={() => onChange({ ...values, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Button */}
        {showFiltersButton && filters.length > 0 && (
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 px-4 gap-2 relative"
              >
                <Filter className="h-4 w-4" />
                <span>{isArabic ? "الفلاتر" : "Filters"}</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4"
              align={isArabic ? "start" : "end"}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {isArabic ? "الفلاتر" : "Filters"}
                  </h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {isArabic ? "مسح الكل" : "Clear all"}
                    </Button>
                  )}
                </div>

                {/* Filter Controls */}
                {filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {isArabic && filter.labelAr ? filter.labelAr : filter.label}
                    </label>

                    {filter.type === "select" && filter.options && (
                      <Select
                        value={(values[filter.id] as string) || ""}
                        onValueChange={(value) =>
                          handleFilterChange(filter.id, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isArabic && filter.placeholderAr
                                ? filter.placeholderAr
                                : filter.placeholder || "Select..."
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {isArabic && option.labelAr
                                ? option.labelAr
                                : option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filter.type === "multiselect" && filter.options && (
                      <div className="flex flex-wrap gap-2">
                        {filter.options.map((option) => {
                          const selectedValues = (values[filter.id] as string[]) || [];
                          const isSelected = selectedValues.includes(option.value);
                          return (
                            <Badge
                              key={option.value}
                              variant={isSelected ? "default" : "outline"}
                              className="cursor-pointer hover:bg-accent"
                              onClick={() => {
                                const newValues = isSelected
                                  ? selectedValues.filter((v) => v !== option.value)
                                  : [...selectedValues, option.value];
                                handleFilterChange(filter.id, newValues);
                              }}
                            >
                              {isArabic && option.labelAr
                                ? option.labelAr
                                : option.label}
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    {filter.type === "daterange" && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          className="flex-1"
                          value={
                            (values[filter.id] as { from?: string; to?: string })
                              ?.from || ""
                          }
                          onChange={(e) =>
                            handleFilterChange(filter.id, {
                              ...(values[filter.id] as { from?: string; to?: string }),
                              from: e.target.value,
                            } as unknown as string)
                          }
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="date"
                          className="flex-1"
                          value={
                            (values[filter.id] as { from?: string; to?: string })
                              ?.to || ""
                          }
                          onChange={(e) =>
                            handleFilterChange(filter.id, {
                              ...(values[filter.id] as { from?: string; to?: string }),
                              to: e.target.value,
                            } as unknown as string)
                          }
                        />
                      </div>
                    )}

                    {filter.type === "tags" && filter.options && (
                      <div className="flex flex-wrap gap-1.5">
                        {filter.options.map((option) => {
                          const selectedValues = (values[filter.id] as string[]) || [];
                          const isSelected = selectedValues.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                const newValues = isSelected
                                  ? selectedValues.filter((v) => v !== option.value)
                                  : [...selectedValues, option.value];
                                handleFilterChange(filter.id, newValues);
                              }}
                              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                                isSelected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                              }`}
                            >
                              {isArabic && option.labelAr
                                ? option.labelAr
                                : option.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {values.search && (
            <Badge variant="secondary" className="gap-1 pr-1">
              <Search className="h-3 w-3" />
              "{values.search}"
              <button
                onClick={() => onChange({ ...values, search: "" })}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.map((filter) => {
            const value = values[filter.id];
            if (!value || (Array.isArray(value) && value.length === 0)) return null;

            if (filter.type === "select" && typeof value === "string") {
              const option = filter.options?.find((o) => o.value === value);
              return (
                <Badge key={filter.id} variant="secondary" className="gap-1 pr-1">
                  {isArabic && filter.labelAr ? filter.labelAr : filter.label}:{" "}
                  {option
                    ? isArabic && option.labelAr
                      ? option.labelAr
                      : option.label
                    : value}
                  <button
                    onClick={() => handleClearFilter(filter.id)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            }

            if (
              (filter.type === "multiselect" || filter.type === "tags") &&
              Array.isArray(value)
            ) {
              return value.map((v) => {
                const option = filter.options?.find((o) => o.value === v);
                return (
                  <Badge key={`${filter.id}-${v}`} variant="secondary" className="gap-1 pr-1">
                    {option
                      ? isArabic && option.labelAr
                        ? option.labelAr
                        : option.label
                      : v}
                    <button
                      onClick={() => {
                        const newValues = (value as string[]).filter((val) => val !== v);
                        handleFilterChange(filter.id, newValues);
                      }}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              });
            }

            return null;
          })}

          {(activeFilterCount > 1 || (activeFilterCount > 0 && values.search)) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 text-xs text-muted-foreground hover:text-foreground"
            >
              {isArabic ? "مسح الكل" : "Clear all"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Export default filter values helper
export function createDefaultFilterValues(): FilterValues {
  return { search: "" };
}
