// client/src/hooks/useFilters.ts
import { useState, useCallback, useMemo } from "react";
import { FilterValues, FilterConfig } from "@/components/SearchFilters";

interface UseFiltersOptions<T> {
  initialValues?: FilterValues;
  filterFn?: (item: T, values: FilterValues, filters: FilterConfig[]) => boolean;
}

interface UseFiltersReturn<T> {
  values: FilterValues;
  setValues: (values: FilterValues) => void;
  updateValue: (key: string, value: string | string[] | { from?: string; to?: string }) => void;
  clearAll: () => void;
  clearFilter: (key: string) => void;
  filterItems: (items: T[], filters: FilterConfig[]) => T[];
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function useFilters<T = unknown>(
  options: UseFiltersOptions<T> = {}
): UseFiltersReturn<T> {
  const { initialValues = { search: "" }, filterFn } = options;

  const [values, setValues] = useState<FilterValues>(initialValues);

  const updateValue = useCallback(
    (key: string, value: string | string[] | { from?: string; to?: string }) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearAll = useCallback(() => {
    setValues({ search: "" });
  }, []);

  const clearFilter = useCallback((key: string) => {
    setValues((prev) => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.keys(values).filter(
      (key) =>
        key !== "search" &&
        values[key] &&
        (Array.isArray(values[key])
          ? (values[key] as string[]).length > 0
          : values[key] !== "")
    ).length;
  }, [values]);

  const hasActiveFilters = useMemo(() => {
    return activeFilterCount > 0 || values.search.length > 0;
  }, [activeFilterCount, values.search]);

  // Default filter function that handles common filter types
  const defaultFilterFn = useCallback(
    (item: T, filterValues: FilterValues, filters: FilterConfig[]): boolean => {
      // If no custom filter function and item is not an object, return true
      if (typeof item !== "object" || item === null) return true;

      const itemObj = item as Record<string, unknown>;

      // Search filter - check if search term exists in any string field
      if (filterValues.search) {
        const searchLower = filterValues.search.toLowerCase();
        const hasMatch = Object.values(itemObj).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchLower);
          }
          if (Array.isArray(value)) {
            return value.some(
              (v) =>
                typeof v === "string" && v.toLowerCase().includes(searchLower)
            );
          }
          return false;
        });
        if (!hasMatch) return false;
      }

      // Apply each filter
      for (const filter of filters) {
        const filterValue = filterValues[filter.id];
        if (!filterValue) continue;

        const itemValue = itemObj[filter.id];

        switch (filter.type) {
          case "select":
            if (typeof filterValue === "string" && filterValue !== "") {
              if (itemValue !== filterValue) return false;
            }
            break;

          case "multiselect":
          case "tags":
            if (Array.isArray(filterValue) && filterValue.length > 0) {
              if (Array.isArray(itemValue)) {
                // Item has array value - check if any match
                const hasMatch = filterValue.some((fv) =>
                  (itemValue as string[]).includes(fv)
                );
                if (!hasMatch) return false;
              } else if (typeof itemValue === "string") {
                // Item has single value - check if it's in filter values
                if (!filterValue.includes(itemValue)) return false;
              } else {
                return false;
              }
            }
            break;

          case "daterange":
            if (
              typeof filterValue === "object" &&
              !Array.isArray(filterValue)
            ) {
              const dateRange = filterValue as { from?: string; to?: string };
              if (typeof itemValue === "string" || typeof itemValue === "number") {
                const itemDate = new Date(itemValue);
                if (dateRange.from) {
                  const fromDate = new Date(dateRange.from);
                  if (itemDate < fromDate) return false;
                }
                if (dateRange.to) {
                  const toDate = new Date(dateRange.to);
                  if (itemDate > toDate) return false;
                }
              }
            }
            break;
        }
      }

      return true;
    },
    []
  );

  const filterItems = useCallback(
    (items: T[], filters: FilterConfig[]): T[] => {
      if (!hasActiveFilters) return items;

      const fn = filterFn || defaultFilterFn;
      return items.filter((item) => fn(item, values, filters));
    },
    [values, hasActiveFilters, filterFn, defaultFilterFn]
  );

  return {
    values,
    setValues,
    updateValue,
    clearAll,
    clearFilter,
    filterItems,
    hasActiveFilters,
    activeFilterCount,
  };
}

// Helper to create filter configs
export function createFilterConfig(
  id: string,
  type: FilterConfig["type"],
  label: string,
  options?: { value: string; label: string; labelAr?: string }[],
  extras?: Partial<FilterConfig>
): FilterConfig {
  return {
    id,
    type,
    label,
    options,
    ...extras,
  };
}
