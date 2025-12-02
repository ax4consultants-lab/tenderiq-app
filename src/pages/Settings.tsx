import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { getBillingState, activateSubscription, deactivateSubscription } from "@/lib/billing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ExternalLink, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const settings = useSettings();
  const { user } = useAuth();
  const billing = getBillingState();
  const [apiUrl, setApiUrl] = useState(settings.apiBaseUrl);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    if (!apiUrl) {
      toast.error("Please enter an API URL");
      return;
    }

    setTestingConnection(true);
    try {
      const response = await fetch(`${apiUrl}/stats/kpis`);
      if (response.ok) {
        toast.success("Connection successful!");
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast.error("Connection failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveApiUrl = () => {
    settings.updateSettings({ apiBaseUrl: apiUrl });
    toast.success("API URL saved");
  };

  const handleToggleMock = (checked: boolean) => {
    settings.updateSettings({ useMockAdapter: checked });
    toast.success(checked ? "Using mock adapter" : "Using REST adapter");
  };

  const handleToggleAuthBypass = (checked: boolean) => {
    settings.updateSettings({ authBypass: checked });
    toast.success(checked ? "Auth bypass enabled" : "Auth bypass disabled");
    if (checked) {
      toast.info("Refresh the page to apply auth bypass");
    }
  };

  const handleToggleSubscription = () => {
    if (billing.activeSubscription) {
      deactivateSubscription();
      toast.success("Subscription deactivated (demo)");
    } else {
      activateSubscription("pro");
      toast.success("Subscription activated (demo)");
    }
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || "Not signed in"} disabled />
          </div>
          {user?.name && (
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user.name} disabled />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Delivery Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">Subscription Status</p>
                {billing.activeSubscription ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {billing.activeSubscription
                  ? `Active - ${billing.plan?.toUpperCase() || "PRO"} Plan`
                  : "No active subscription"}
              </p>
              {billing.customerId && (
                <p className="text-xs text-muted-foreground">ID: {billing.customerId}</p>
              )}
            </div>
            <div className="flex gap-2">
              {billing.activeSubscription && (
                <Button variant="outline" asChild>
                  <a
                    href="https://billing.stripe.com/p/login/test_placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manage <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={handleToggleSubscription}>
                {billing.activeSubscription ? "Deactivate (Demo)" : "Activate (Demo)"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Source Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Source Configuration</CardTitle>
          <CardDescription>Configure your data source</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mock-toggle">Use Mock Adapter</Label>
              <p className="text-sm text-muted-foreground">
                Use local mock data instead of REST API
              </p>
            </div>
            <Switch
              id="mock-toggle"
              checked={settings.useMockAdapter}
              onCheckedChange={handleToggleMock}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <div className="flex gap-2">
              <Input
                id="api-url"
                placeholder="https://api.example.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={settings.useMockAdapter}
              />
              <Button
                onClick={handleTestConnection}
                disabled={settings.useMockAdapter || testingConnection}
              >
                {testingConnection ? "Testing..." : "Test"}
              </Button>
              <Button
                onClick={handleSaveApiUrl}
                disabled={settings.useMockAdapter}
              >
                Save
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Current: {settings.apiBaseUrl || "Not set"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Developer Options */}
      <Card>
        <CardHeader>
          <CardTitle>Developer Options</CardTitle>
          <CardDescription>Advanced settings for development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auth-bypass">Auth Bypass (Dev)</Label>
              <p className="text-sm text-muted-foreground">
                Skip authentication and subscription checks
              </p>
            </div>
            <Switch
              id="auth-bypass"
              checked={settings.authBypass}
              onCheckedChange={handleToggleAuthBypass}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" asChild>
              <Link to="/app/dev/digest-preview">
                Digest Preview
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
