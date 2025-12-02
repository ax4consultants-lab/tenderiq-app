import { useEffect, useMemo, useState } from "react";
import { ShieldAlert, Copy, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAlerts } from "@/hooks/useAlerts";
import { MockAdapter } from "@/lib/adapters/mock";
import { scoreLeads } from "@/lib/scoring";
import { buildDigestPayload } from "@/lib/digest";
import { Tender } from "@/types/tender";
import { toast } from "sonner";

export default function DigestPreview() {
  const { config } = useAlerts();
  const [sampleTenders, setSampleTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTenders = async () => {
      setIsLoading(true);
      try {
        const adapter = new MockAdapter();
        const response = await adapter.getTenders({ pageSize: 100 });
        setSampleTenders(response.data);
      } catch (error) {
        toast.error("Failed to load mock leads", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTenders();
  }, []);

  const scoringRules = useMemo(
    () => ({
      include_keywords: config.keywords,
      exclude_keywords: config.exclude,
      regions: config.regions,
      min_days_left: config.min_days_left,
      min_score: config.min_score,
    }),
    [config]
  );

  const scoredLeads = useMemo(
    () =>
      config.keywords.length > 0
        ? scoreLeads(sampleTenders, scoringRules)
        : [],
    [config.keywords.length, sampleTenders, scoringRules]
  );

  const payload = useMemo(
    () => buildDigestPayload(config, scoredLeads),
    [config, scoredLeads]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success("Digest payload copied");
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const adapter = new MockAdapter();
      const response = await adapter.getTenders({ pageSize: 100 });
      setSampleTenders(response.data);
      toast.info("Sample leads refreshed");
    } catch (error) {
      toast.error("Unable to refresh mock data", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Digest Preview</h1>
        <p className="text-muted-foreground">
          Live preview of the payload posted by "Send Test Digest" using mock leads.
        </p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <div>
            <CardTitle>Developer Tools</CardTitle>
            <CardDescription>
              This page is for internal validation only. Payloads are generated locally using the mock adapter.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Lead Rules</CardTitle>
            <CardDescription>From useAlerts configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Include Keywords</p>
              {config.keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {config.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">None configured</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Exclude Keywords</p>
              {config.exclude && config.exclude.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {config.exclude.map((keyword) => (
                    <Badge key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Regions</p>
              {config.regions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {config.regions.map((region) => (
                    <Badge key={region}>{region}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No region filter</p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Cadence</p>
                <p className="font-medium">{config.cadence}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Delivery Time</p>
                <p className="font-medium">
                  {config.hour}:{config.minute} {config.tz}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Min Score</p>
                <p className="font-medium">{config.min_score ?? 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Min Days Left</p>
                <p className="font-medium">{config.min_days_left ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Preview Payload</CardTitle>
              <CardDescription>
                {config.keywords.length === 0
                  ? "Add keywords to generate a payload"
                  : `${scoredLeads.length} lead${scoredLeads.length === 1 ? "" : "s"} from mock data`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {isLoading ? "Refreshing" : "Reload Mock Data"}
              </Button>
              <Button onClick={handleCopy} disabled={config.keywords.length === 0}>
                <Copy className="mr-2 h-4 w-4" />
                Copy JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-muted/50 p-4 font-mono text-sm text-left whitespace-pre-wrap break-words">
              {config.keywords.length === 0 ? (
                "Configure include keywords to see a preview payload."
              ) : (
                <pre className="whitespace-pre-wrap break-words">{JSON.stringify(payload, null, 2)}</pre>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
