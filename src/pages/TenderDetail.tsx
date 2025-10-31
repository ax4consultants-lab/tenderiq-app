import { useParams, Link } from "react-router-dom";
import { useTender } from "@/hooks/useTenders";
import { useAlerts } from "@/hooks/useAlerts";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ProvenanceCard } from "@/components/ProvenanceCard";
import { LeadScoreBadge } from "@/components/LeadScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowLeft, ExternalLink, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SourceLogo } from "@/components/SourceLogo";
import { scoreTender } from "@/lib/scoring";

export default function TenderDetail() {
  const { id } = useParams<{ id: string }>();
  const { config } = useAlerts();
  const { data: tender, isLoading } = useTender(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingState message="Loading tender details..." />
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="container mx-auto p-6">
        <EmptyState
          title="Tender not found"
          description="The tender you're looking for doesn't exist or has been removed."
        />
      </div>
    );
  }

  const hasRules = config.keywords.length > 0;
  const lead = hasRules
    ? scoreTender(tender, {
        include_keywords: config.keywords,
        exclude_keywords: config.exclude,
        regions: config.regions,
        min_days_left: config.min_days_left,
      })
    : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/app/tenders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Matches
          </Button>
        </Link>
      </div>

      {lead && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <LeadScoreBadge score={lead.score} />
              <span>Lead Score & Match Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lead.matched_keywords.length > 0 && (
              <div>
                <span className="text-sm font-medium">Matched Keywords: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lead.matched_keywords.map((kw) => (
                    <Badge key={kw} variant="secondary">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {lead.rationale && (
              <p className="text-sm text-muted-foreground">{lead.rationale}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{tender.title}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <SourceLogo source={tender.source} />
                <Badge variant="outline">{tender.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  Tender ID: {tender.tender_id}
                </span>
              </div>
            </div>
            {tender.url && (
              <a href={tender.url} target="_blank" rel="noopener noreferrer">
                <Button variant="default">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Source Page
                </Button>
              </a>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Agency</h3>
              <p className="text-muted-foreground">{tender.agency || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Region</h3>
              <p className="text-muted-foreground">{tender.region || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <p className="text-muted-foreground">{tender.category || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Source</h3>
              <p className="text-muted-foreground">{tender.source}</p>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Open Date</h3>
              <p className="text-muted-foreground">
                {tender.open_date ? formatDate(tender.open_date) : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Close Date</h3>
              <p className="text-muted-foreground">
                {tender.close_date ? formatDate(tender.close_date) : "N/A"}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {tender.description || "No description available."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <ChevronDown className="h-4 w-4 mr-2" />
            Developer: View Provenance Data
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <ProvenanceCard tender={tender} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
