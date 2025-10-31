import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { Tender } from "@/types/tender";
import { Lead } from "@/types/lead";
import { exportToCSV } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: Tender[] | Lead[];
  filename?: string;
  disabled?: boolean;
}

export function ExportButton({ data, filename, disabled }: ExportButtonProps) {
  const handleExport = () => {
    try {
      const isLead = (item: Tender | Lead): item is Lead => 'score' in item;
      const enrichedData = data.map(item => {
        if (isLead(item)) {
          return {
            ...item,
            score: item.score,
            matched_keywords: item.matched_keywords.join("; "),
            rationale: item.rationale || ""
          };
        }
        return item;
      });
      exportToCSV(enrichedData as Tender[], filename);
      toast({
        title: "Export successful",
        description: `Exported ${data.length} lead(s) to CSV`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || data.length === 0}
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
