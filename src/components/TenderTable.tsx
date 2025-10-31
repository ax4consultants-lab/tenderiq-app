import { Tender } from "@/types/tender";
import { formatDate, getDaysUntilClose } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { SourceLogo } from "./SourceLogo";
import { ArrowRight } from "lucide-react";

interface TenderTableProps {
  tenders: Tender[];
  onRowClick?: (tender: Tender) => void;
}

export function TenderTable({ tenders, onRowClick }: TenderTableProps) {
  const navigate = useNavigate();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "default";
      case "Closed":
        return "secondary";
      case "Awarded":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCloseDateBadge = (closeDate: string | null) => {
    if (!closeDate) return <span className="text-muted-foreground">N/A</span>;
    
    const days = getDaysUntilClose(closeDate);
    const formatted = formatDate(closeDate);
    
    if (days === null) return <span className="text-muted-foreground">{formatted}</span>;
    
    if (days < 0) {
      return <Badge variant="secondary">{formatted}</Badge>;
    } else if (days <= 7) {
      return (
        <Badge variant="destructive" title={closeDate}>
          {days === 0 ? "Today" : `${days}d left`}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" title={closeDate}>
          {formatted}
        </Badge>
      );
    }
  };

  const handleRowClick = (tender: Tender) => {
    if (onRowClick) {
      onRowClick(tender);
    } else {
      navigate(`/app/tenders/${tender.id}`);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Agency</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Close Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenders.map((tender) => (
          <TableRow
            key={tender.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleRowClick(tender)}
          >
            <TableCell className="font-medium max-w-md">
              <div className="truncate" title={tender.title}>
                {tender.title}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <SourceLogo source={tender.source} />
                <span className="text-sm">{tender.source}</span>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {tender.agency || "N/A"}
            </TableCell>
            <TableCell>{tender.region || "N/A"}</TableCell>
            <TableCell>{getCloseDateBadge(tender.close_date)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(tender.status)}>
                {tender.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/app/tenders/${tender.id}`);
                }}
              >
                View <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
