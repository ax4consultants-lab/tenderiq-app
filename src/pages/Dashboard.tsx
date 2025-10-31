import { useState } from "react";
import { useKPIs } from "@/hooks/useKPIs";
import { useTenders } from "@/hooks/useTenders";
import { useAlerts } from "@/hooks/useAlerts";
import { KpiCard } from "@/components/KpiCard";
import { TenderTable } from "@/components/TenderTable";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Award, Database } from "lucide-react";
import { scoreLeads } from "@/lib/scoring";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { config } = useAlerts();
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  
  const [scoreFilter, setScoreFilter] = useState<number | null>(null);
  
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const { data: closingSoonData, isLoading: closingSoonLoading } = useTenders({
    close_to: sevenDaysFromNow.toISOString().split("T")[0],
    status: ["Open"],
    sortBy: "close_date",
    sortOrder: "asc",
    pageSize: 50,
  });

  const hasRules = config.keywords.length > 0;
  
  const leads = closingSoonData?.data && hasRules
    ? scoreLeads(closingSoonData.data, {
        include_keywords: config.keywords,
        exclude_keywords: config.exclude,
        regions: config.regions,
        min_days_left: config.min_days_left,
        min_score: scoreFilter ?? config.min_score,
      })
    : [];

  const avgScore = leads.length > 0
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
    : 0;

  const topSources = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSource = Object.entries(topSources).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Today's Leads</h1>
        <p className="text-muted-foreground">High-quality opportunities matched to your business</p>
      </div>

      {!hasRules && (
        <Alert>
          <AlertDescription>
            Set your Lead Rules to improve match quality.{" "}
            <Button variant="link" className="h-auto p-0" onClick={() => navigate("/app/alerts")}>
              Configure now →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {kpisLoading ? (
        <LoadingState message="Loading KPIs..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Leads Today"
            value={leads.length}
            icon={TrendingUp}
          />
          <KpiCard
            title="Closing ≤ 7d"
            value={kpis?.closing_in_7d ?? 0}
            icon={Clock}
          />
          <KpiCard
            title="Avg Score"
            value={avgScore}
            icon={Award}
          />
          <KpiCard
            title="Top Source"
            value={topSource ? topSource[0] : "—"}
            icon={Database}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Closing Soon (≤ 7 days)</CardTitle>
            <div className="flex gap-2">
              <Badge
                variant={scoreFilter === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setScoreFilter(null)}
              >
                All
              </Badge>
              <Badge
                variant={scoreFilter === 70 ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setScoreFilter(70)}
              >
                ≥ 70
              </Badge>
              <Badge
                variant={scoreFilter === 60 ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setScoreFilter(60)}
              >
                ≥ 60
              </Badge>
              <Badge
                variant={scoreFilter === 50 ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setScoreFilter(50)}
              >
                ≥ 50
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {closingSoonLoading ? (
            <LoadingState message="Loading leads..." />
          ) : !hasRules ? (
            <EmptyState
              title="Configure your lead rules"
              description="Set up keywords and regions in Lead Rules & Digests to start seeing scored leads."
            />
          ) : leads.length > 0 ? (
            <TenderTable tenders={leads} showScore={true} />
          ) : (
            <EmptyState
              title="No matching leads"
              description="No tenders match your current lead rules. Try adjusting your keywords or regions."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
