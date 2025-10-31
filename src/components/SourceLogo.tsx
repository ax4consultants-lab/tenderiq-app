import { Source } from "@/types/tender";
import { Building2, Globe } from "lucide-react";
import { Badge } from "./ui/badge";

interface SourceLogoProps {
  source: Source;
  variant?: "icon" | "badge";
}

const sourceColors: Record<Source, string> = {
  AusTender: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  NSW: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  SA: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  GrantsConnect: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function SourceLogo({ source, variant = "badge" }: SourceLogoProps) {
  if (variant === "icon") {
    return (
      <div className={`flex h-8 w-8 items-center justify-center rounded ${sourceColors[source]}`}>
        {source === "Other" ? <Globe className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
      </div>
    );
  }

  return (
    <Badge variant="secondary" className={sourceColors[source]}>
      {source}
    </Badge>
  );
}
