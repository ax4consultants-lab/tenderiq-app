import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search criteria",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-muted-foreground">
        {icon || <FileQuestion className="h-12 w-12" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
