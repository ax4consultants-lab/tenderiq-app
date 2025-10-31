import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { TenderFilters, TenderStatus, Source } from "@/types/tender";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FiltersBarProps {
  filters: TenderFilters;
  onFiltersChange: (filters: TenderFilters) => void;
}

const SOURCES: Source[] = ["AusTender", "NSW", "SA", "GrantsConnect", "Other"];
const REGIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT", "National"];
const STATUSES: TenderStatus[] = ["Open", "Closed", "Awarded", "Draft", "Unknown"];

export function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue || undefined });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSourceToggle = (source: Source) => {
    const current = filters.source || [];
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    onFiltersChange({ ...filters, source: updated.length > 0 ? updated : undefined });
  };

  const handleRegionToggle = (region: string) => {
    const current = filters.region || [];
    const updated = current.includes(region)
      ? current.filter((r) => r !== region)
      : [...current, region];
    onFiltersChange({ ...filters, region: updated.length > 0 ? updated : undefined });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({});
  };

  const hasActiveFilters = searchValue || filters.source?.length || filters.region?.length || filters.status?.length || filters.close_from || filters.close_to;

  return (
    <div className="space-y-4 p-4 bg-card border rounded-lg">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search" className="sr-only">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tenders..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Source Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[120px]">
              Source {filters.source?.length ? `(${filters.source.length})` : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              {SOURCES.map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={`source-${source}`}
                    checked={filters.source?.includes(source)}
                    onCheckedChange={() => handleSourceToggle(source)}
                  />
                  <label
                    htmlFor={`source-${source}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {source}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Region Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[120px]">
              Region {filters.region?.length ? `(${filters.region.length})` : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              {REGIONS.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={filters.region?.includes(region)}
                    onCheckedChange={() => handleRegionToggle(region)}
                  />
                  <label
                    htmlFor={`region-${region}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {region}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Status Filter */}
        <Select
          value={filters.status?.[0] || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === "all" ? undefined : [value as TenderStatus],
            })
          }
        >
          <SelectTrigger className="min-w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range */}
        <div className="flex gap-2">
          <Input
            type="date"
            value={filters.close_from || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, close_from: e.target.value || undefined })
            }
            className="w-40"
            placeholder="From"
          />
          <Input
            type="date"
            value={filters.close_to || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, close_to: e.target.value || undefined })
            }
            className="w-40"
            placeholder="To"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
