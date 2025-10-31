import { useState } from "react";
import { useKPIs } from "@/hooks/useKPIs";
import { useTenders } from "@/hooks/useTenders";
import { KpiCard } from "@/components/KpiCard";
import { TenderTable } from "@/components/TenderTable";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TenderFilters, Source } from "@/types/tender";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const [quickFilters, setQuickFilters] = useState<TenderFilters>({});

  // Fetch closing soon tenders (next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const { data: closingSoonData, isLoading: tendersLoading } = useTenders({
    ...quickFilters,
    close_to: sevenDaysFromNow.toISOString().split("T")[0],
    sortBy: "close_date",
    sortOrder: "asc",
    pageSize: 10,
  });

  const toggleSourceFilter = (source: Source) => {
    const current = quickFilters.source || [];
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    setQuickFilters({ ...quickFilters, source: updated.length > 0 ? updated : undefined });
  };

  if (kpisLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your tender intelligence overview</p>
        </div>
        <Button onClick={() => navigate("/app/tenders")}>View All Tenders</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Last 30 Days"
          value={kpis?.total_last_30d || 0}
          description="New tenders published"
        />
        <KpiCard
          title="Closing in 7 Days"
          value={kpis?.closing_in_7d || 0}
          description="Urgent opportunities"
          variant="warning"
        />
        <KpiCard
          title="New Today"
          value={kpis?.new_today || 0}
          description="Fresh opportunities"
          variant="success"
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {kpis?.sources_breakdown &&
                Object.entries(kpis.sources_breakdown).map(([source, count]) => (
                  <div key={source} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{source}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(["AusTender", "NSW", "SA", "GrantsConnect"] as Source[]).map((source) => (
              <Badge
                key={source}
                variant={quickFilters.source?.includes(source) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSourceFilter(source)}
              >
                {source}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Closing Soon Table */}
      <Card>
        <CardHeader>
          <CardTitle>Closing Soon (≤ 7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {tendersLoading ? (
            <LoadingState message="Loading tenders..." />
          ) : closingSoonData?.data.length ? (
            <TenderTable tenders={closingSoonData.data} />
          ) : (
            <EmptyState
              title="No closing tenders"
              description="No tenders closing in the next 7 days"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
