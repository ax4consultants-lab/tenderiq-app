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
import { Bell, Send } from "lucide-react";

const REGIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT", "National"];

export default function Alerts() {
  const { config, updateConfig } = useAlerts();
  const [keywordInput, setKeywordInput] = useState(config.keywords.join(", "));
  const [isSending, setIsSending] = useState(false);

  // Fetch closing soon tenders
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const { data: closingSoonData, isLoading: closingSoonLoading } = useTenders({
    close_to: sevenDaysFromNow.toISOString().split("T")[0],
    sortBy: "close_date",
    sortOrder: "asc",
    pageSize: 50,
  });

  // Fetch keyword watch tenders
  const keywordSearch = config.keywords.join(" ");
  const { data: keywordData, isLoading: keywordLoading } = useTenders({
    search: keywordSearch || undefined,
    region: config.regions.length > 0 ? config.regions : undefined,
    status: ["Open"],
    pageSize: 50,
  });

  const handleSaveKeywords = () => {
    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    updateConfig({ keywords });
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

    setIsSending(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast.success("Test digest sent successfully");
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
          <h1 className="text-3xl font-bold">Alerts & Digests</h1>
          <p className="text-muted-foreground">Manage your tender notifications</p>
        </div>
        <Button onClick={handleSendTestDigest} disabled={isSending}>
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Test Digest"}
        </Button>
      </div>

      <Tabs defaultValue="closing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="closing">
            <Bell className="mr-2 h-4 w-4" />
            Closing Soon
          </TabsTrigger>
          <TabsTrigger value="keywords">Keyword Watch</TabsTrigger>
        </TabsList>

        <TabsContent value="closing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenders Closing in 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              {closingSoonLoading ? (
                <LoadingState message="Loading closing tenders..." />
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
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Watch Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    placeholder="e.g., IT services, construction, consulting"
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
                <Label>Regions</Label>
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

              <div className="grid md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Matching Tenders</CardTitle>
            </CardHeader>
            <CardContent>
              {config.keywords.length === 0 ? (
                <EmptyState
                  title="No keywords configured"
                  description="Add keywords above to see matching tenders"
                />
              ) : keywordLoading ? (
                <LoadingState message="Loading matching tenders..." />
              ) : keywordData?.data.length ? (
                <TenderTable tenders={keywordData.data} />
              ) : (
                <EmptyState
                  title="No matching tenders"
                  description="No open tenders match your current keywords and filters"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
