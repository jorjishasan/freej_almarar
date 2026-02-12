import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchFiltersBarProps {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  showFilters?: boolean;
}

export function SearchFiltersBar({
  searchPlaceholder = "Search...",
  onSearch,
  onFilterClick,
  showFilters = true,
}: SearchFiltersBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 bg-background/50 border-border focus:bg-background transition-colors"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Button */}
        {showFilters && (
          <Button
            variant="outline"
            onClick={onFilterClick}
            className="gap-2 h-11 whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        )}
      </div>
    </div>
  );
}
