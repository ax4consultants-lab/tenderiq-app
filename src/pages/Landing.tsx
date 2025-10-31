import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Target, Zap, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TenderIQ</h1>
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
        <h2 className="text-5xl font-bold mb-6">Automated Leads for SMEs</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get only the tenders that matter to your business — straight to your inbox.
          Built for trades & compliance specialists in asbestos, WHS, hazmat, demolition, and environmental services.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/auth/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link to="/auth/signup">
            <Button size="lg" variant="outline">Subscribe Now</Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Lead Scoring</h3>
              <p className="text-muted-foreground">
                AI-powered matching scores every tender against your business profile
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Mail className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Daily Digests</h3>
              <p className="text-muted-foreground">
                Relevant leads delivered to your inbox every morning—no searching required
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Zero Manual Work</h3>
              <p className="text-muted-foreground">
                Set your keywords and regions once, then let TenderIQ do the rest
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Lead Delivery Subscriptions</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-2xl font-bold mb-2">Starter</h4>
              <p className="text-4xl font-bold mb-4">$49<span className="text-lg text-muted-foreground">/mo</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Daily lead digest</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Up to 5 keywords</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />3 regions</li>
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
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Unlimited keywords</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />All regions</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Advanced scoring rules</li>
              </ul>
              <Link to="/auth/signup">
                <Button className="w-full">Start Trial</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-2xl font-bold mb-2">Agency</h4>
              <p className="text-4xl font-bold mb-4">$199<span className="text-lg text-muted-foreground">/mo</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Everything in Pro</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Multi-user accounts</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />API access</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-success" />Custom integrations</li>
              </ul>
              <Link to="/auth/signup">
                <Button className="w-full">Start Trial</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 TenderIQ. MIT Licensed.</p>
        </div>
      </footer>
    </div>
  );
}
