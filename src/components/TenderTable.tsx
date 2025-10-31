import { Tender } from "@/types/tender";
import { Lead } from "@/types/lead";
import { formatDate, getDaysUntilClose, isLead as isLeadUtil } from "@/lib/utils";
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
import { LeadScoreBadge } from "./LeadScoreBadge";
import { ArrowRight } from "lucide-react";

interface TenderTableProps {
  tenders: Tender[] | Lead[];
  onRowClick?: (tender: Tender | Lead) => void;
  showScore?: boolean;
}

export function TenderTable({ tenders, onRowClick, showScore = false }: TenderTableProps) {
  const navigate = useNavigate();
  const isLead = isLeadUtil;

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

  const handleRowClick = (tender: Tender | Lead) => {
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
          {showScore && <TableHead className="w-20">Score</TableHead>}
          <TableHead>Title</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Agency</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Close Date</TableHead>
          {showScore && <TableHead>Matched Keywords</TableHead>}
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenders.map((tender) => {
          const lead = isLead(tender) ? tender : null;
          
          return (
            <TableRow
              key={tender.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(tender)}
            >
              {showScore && lead && (
                <TableCell>
                  <LeadScoreBadge score={lead.score} />
                </TableCell>
              )}
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
              {showScore && lead && (
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {lead.matched_keywords.length > 0 ? (
                      <>
                        {lead.matched_keywords.slice(0, 3).map((kw) => (
                          <Badge key={kw} variant="outline" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                        {lead.matched_keywords.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{lead.matched_keywords.length - 3}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </div>
                </TableCell>
              )}
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
          );
        })}
      </TableBody>
    </Table>
  );
}
