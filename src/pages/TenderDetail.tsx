import { useParams, useNavigate } from "react-router-dom";
import { useTender } from "@/hooks/useTenders";
import { useTenders } from "@/hooks/useTenders";
import { LoadingState } from "@/components/LoadingState";
import { ProvenanceCard } from "@/components/ProvenanceCard";
import { SourceLogo } from "@/components/SourceLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, findRelatedTenders } from "@/lib/utils";
import { ExternalLink, ArrowLeft } from "lucide-react";

export default function TenderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tender, isLoading } = useTender(id!);
  const { data: allTendersData } = useTenders({ pageSize: 1000 });

  if (isLoading) {
    return <LoadingState message="Loading tender details..." />;
  }

  if (!tender) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Tender not found</h2>
            <p className="text-muted-foreground mb-4">
              The tender you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/app/tenders")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tenders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedTenders = allTendersData?.data
    ? findRelatedTenders(tender, allTendersData.data, 5)
    : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate("/app/tenders")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tenders
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <SourceLogo source={tender.source} size="lg" />
                <h1 className="text-3xl font-bold">{tender.title}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{tender.status}</Badge>
                <Badge variant="outline">{tender.source}</Badge>
                {tender.region && <Badge variant="outline">{tender.region}</Badge>}
              </div>
            </div>
            {tender.url && (
              <Button asChild>
                <a href={tender.url} target="_blank" rel="noopener noreferrer">
                  Open Source Page <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tender ID</h3>
                <p className="text-lg">{tender.tender_id}</p>
              </div>
              {tender.agency && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Agency</h3>
                  <p className="text-lg">{tender.agency}</p>
                </div>
              )}
              {tender.category && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p className="text-lg">{tender.category}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Open Date</h3>
                <p className="text-lg" title={tender.open_date || undefined}>
                  {formatDate(tender.open_date)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Close Date</h3>
                <p className="text-lg" title={tender.close_date || undefined}>
                  {formatDate(tender.close_date)}
                </p>
              </div>
            </div>
          </div>

          {tender.description && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="text-base whitespace-pre-wrap">{tender.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ProvenanceCard tender={tender} />

      {relatedTenders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relatedTenders.map((related) => (
                <div
                  key={related.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/app/tenders/${related.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <SourceLogo source={related.source} />
                      <span className="font-medium">{related.title}</span>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{related.source}</span>
                      {related.region && (
                        <>
                          <span>•</span>
                          <span>{related.region}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
