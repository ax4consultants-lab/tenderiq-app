import { Source } from "@/types/tender";
import { Building2, Landmark, Globe, FileText } from "lucide-react";

interface SourceLogoProps {
  source: Source;
  size?: "sm" | "md" | "lg";
}

export function SourceLogo({ source, size = "sm" }: SourceLogoProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const getIcon = () => {
    switch (source) {
      case "AusTender":
        return <Landmark className={sizeClasses[size]} />;
      case "NSW":
      case "SA":
        return <Building2 className={sizeClasses[size]} />;
      case "GrantsConnect":
        return <Globe className={sizeClasses[size]} />;
      case "Other":
      default:
        return <FileText className={sizeClasses[size]} />;
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded flex items-center justify-center bg-primary/10 text-primary`}
      title={source}
    >
      {getIcon()}
    </div>
  );
}
