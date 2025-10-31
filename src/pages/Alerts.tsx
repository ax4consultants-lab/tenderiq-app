import { useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { useTenders } from "@/hooks/useTenders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TenderTable } from "@/components/TenderTable";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Send, Settings2 } from "lucide-react";
import { scoreLeads } from "@/lib/scoring";

const REGIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT", "National"];

export default function Alerts() {
  const { config, updateConfig } = useAlerts();
  const [keywordInput, setKeywordInput] = useState(config.keywords.join(", "));
  const [excludeInput, setExcludeInput] = useState((config.exclude ?? []).join(", "));
  const [isSending, setIsSending] = useState(false);

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const { data: closingSoonData, isLoading: closingSoonLoading } = useTenders({
    close_to: sevenDaysFromNow.toISOString().split("T")[0],
    status: ["Open"],
    sortBy: "close_date",
    sortOrder: "asc",
    pageSize: 50,
  });

  const { data: allTendersData, isLoading: allTendersLoading } = useTenders({
    status: ["Open"],
    pageSize: 100,
  });

  const closingSoonLeads = closingSoonData?.data && config.keywords.length > 0
    ? scoreLeads(closingSoonData.data, {
        include_keywords: config.keywords,
        exclude_keywords: config.exclude,
        regions: config.regions,
        min_days_left: config.min_days_left,
        min_score: config.min_score,
      })
    : [];

  const previewLeads = allTendersData?.data && config.keywords.length > 0
    ? scoreLeads(allTendersData.data, {
        include_keywords: config.keywords,
        exclude_keywords: config.exclude,
        regions: config.regions,
        min_days_left: config.min_days_left,
        min_score: config.min_score,
      })
    : [];

  const handleSaveKeywords = () => {
    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const exclude = excludeInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    updateConfig({ keywords, exclude });
    toast.success("Keywords saved");
  };

  const handleRegionToggle = (region: string) => {
    const current = config.regions;
    const updated = current.includes(region)
      ? current.filter((r) => r !== region)
      : [...current, region];
    updateConfig({ regions: updated });
  };

  const handleSendTestDigest = async () => {
    const webhookUrl = import.meta.env.VITE_DIGEST_WEBHOOK_URL;
    
    if (!webhookUrl) {
      toast.error("Digest webhook not configured", {
        description: "Set VITE_DIGEST_WEBHOOK_URL in your environment variables",
      });
      return;
    }

    if (config.keywords.length === 0) {
      toast.error("No keywords configured", {
        description: "Add at least one keyword to send a test digest",
      });
      return;
    }

    setIsSending(true);
    try {
      const payload = {
        generated_at: new Date().toISOString(),
        rules: config,
        leads: previewLeads.map((lead) => ({
          id: lead.id,
          title: lead.title,
          agency: lead.agency,
          region: lead.region,
          close_date: lead.close_date,
          url: lead.url,
          score: lead.score,
          matched_keywords: lead.matched_keywords,
          rationale: lead.rationale,
        })),
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Test digest sent successfully", {
          description: `Sent ${previewLeads.length} leads to webhook`,
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to send test digest", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lead Rules & Digests</h1>
          <p className="text-muted-foreground">Configure your automated lead delivery</p>
        </div>
        <Button onClick={handleSendTestDigest} disabled={isSending}>
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Test Digest"}
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">
            <Settings2 className="mr-2 h-4 w-4" />
            Lead Rules
          </TabsTrigger>
          <TabsTrigger value="closing">
            <Bell className="mr-2 h-4 w-4" />
            Closing Soon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="keywords">Include Keywords (comma-separated)</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    placeholder="e.g., asbestos, WHS, hazmat, demolition"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                  />
                  <Button onClick={handleSaveKeywords}>Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {config.keywords.length > 0 ? config.keywords.join(", ") : "None"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exclude">Exclude Keywords (optional, comma-separated)</Label>
                <div className="flex gap-2">
                  <Input
                    id="exclude"
                    placeholder="e.g., residential, retail"
                    value={excludeInput}
                    onChange={(e) => setExcludeInput(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {config.exclude && config.exclude.length > 0 ? config.exclude.join(", ") : "None"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Preferred Regions</Label>
                <div className="grid grid-cols-3 gap-3">
                  {REGIONS.map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={`alert-region-${region}`}
                        checked={config.regions.includes(region)}
                        onCheckedChange={() => handleRegionToggle(region)}
                      />
                      <label
                        htmlFor={`alert-region-${region}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {region}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cadence">Digest Cadence</Label>
                  <Select
                    value={config.cadence}
                    onValueChange={(value: "daily" | "weekly") =>
                      updateConfig({ cadence: value })
                    }
                  >
                    <SelectTrigger id="cadence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Delivery Time</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hour"
                      type="number"
                      min="0"
                      max="23"
                      value={config.hour}
                      onChange={(e) => updateConfig({ hour: e.target.value })}
                      className="w-20"
                    />
                    <span className="flex items-center">:</span>
                    <Input
                      id="minute"
                      type="number"
                      min="0"
                      max="59"
                      value={config.minute}
                      onChange={(e) => updateConfig({ minute: e.target.value })}
                      className="w-20"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Time zone: {config.tz}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_score">Minimum Score</Label>
                  <Input
                    id="min_score"
                    type="number"
                    min="0"
                    max="100"
                    value={config.min_score ?? 50}
                    onChange={(e) => updateConfig({ min_score: parseInt(e.target.value) || 50 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_days">Minimum Days Until Close</Label>
                <Input
                  id="min_days"
                  type="number"
                  min="0"
                  max="30"
                  value={config.min_days_left ?? 2}
                  onChange={(e) => updateConfig({ min_days_left: parseInt(e.target.value) || 2 })}
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Filter out tenders closing too soon to respond
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview Leads ({previewLeads.length} matches)</CardTitle>
            </CardHeader>
            <CardContent>
              {config.keywords.length === 0 ? (
                <EmptyState
                  title="No keywords configured"
                  description="Add keywords above to preview matching leads"
                />
              ) : allTendersLoading ? (
                <LoadingState message="Loading preview..." />
              ) : previewLeads.length > 0 ? (
                <TenderTable tenders={previewLeads} showScore={true} />
              ) : (
                <EmptyState
                  title="No matching leads"
                  description="No tenders match your current lead rules. Try adjusting your keywords, regions, or score threshold."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenders Closing in 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              {closingSoonLoading ? (
                <LoadingState message="Loading closing tenders..." />
              ) : closingSoonLeads.length > 0 ? (
                <TenderTable tenders={closingSoonLeads} showScore={config.keywords.length > 0} />
              ) : (
                <EmptyState
                  title="No closing tenders"
                  description="No tenders closing in the next 7 days match your lead rules"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
