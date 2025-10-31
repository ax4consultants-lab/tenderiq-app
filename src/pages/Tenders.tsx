import { useState } from "react";
import { useTenders } from "@/hooks/useTenders";
import { TenderTable } from "@/components/TenderTable";
import { FiltersBar } from "@/components/FiltersBar";
import { ExportButton } from "@/components/ExportButton";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { TenderFilters } from "@/types/tender";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Tenders() {
  const [filters, setFilters] = useState<TenderFilters>({
    page: 1,
    pageSize: 20,
    sortBy: "close_date",
    sortOrder: "asc",
  });

  const { data, isLoading } = useTenders(filters);

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handlePageSizeChange = (size: string) => {
    setFilters({ ...filters, pageSize: parseInt(size), page: 1 });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tenders</h1>
          <p className="text-muted-foreground">
            {data ? `${data.total} tenders found` : "Loading..."}
          </p>
        </div>
        {data?.data && (
          <ExportButton data={data.data} filename="tenders-export.csv" />
        )}
      </div>

      <FiltersBar filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <LoadingState message="Loading tenders..." />
      ) : data?.data.length ? (
        <>
          <div className="border rounded-lg overflow-hidden">
            <TenderTable tenders={data.data} />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={filters.pageSize?.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={data.page === 1}
                  onClick={() => handlePageChange(data.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={data.page >= totalPages}
                  onClick={() => handlePageChange(data.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="No tenders found"
          description="Try adjusting your filters or search terms"
        />
      )}
    </div>
  );
}
