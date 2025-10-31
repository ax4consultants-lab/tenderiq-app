import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Search, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">EchoTender Pro</h1>
          <div className="space-x-4">
            <Link to="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button>Start Trial</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Australian Tender Intelligence</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Track, analyze, and never miss an opportunity with real-time tender monitoring across Australia
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/auth/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link to="/app/tenders">
            <Button size="lg" variant="outline">View Tenders</Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Search className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-muted-foreground">Advanced filters and full-text search across all tender sources</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Bell className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Alerts</h3>
              <p className="text-muted-foreground">Get notified when tenders matching your criteria are published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">Track trends and opportunities across regions and categories</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Simple Pricing</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-2xl font-bold mb-2">Starter</h4>
              <p className="text-4xl font-bold mb-4">$49<span className="text-lg text-muted-foreground">/mo</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Basic search & filters</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Email alerts</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Export to CSV</li>
              </ul>
              <Link to="/auth/signup">
                <Button className="w-full">Start Trial</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-primary">
            <CardContent className="pt-6">
              <h4 className="text-2xl font-bold mb-2">Pro</h4>
              <p className="text-4xl font-bold mb-4">$99<span className="text-lg text-muted-foreground">/mo</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Everything in Starter</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Advanced analytics</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />API access</li>
              </ul>
              <Link to="/auth/signup">
                <Button className="w-full">Start Trial</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
