import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function Auth() {
  const location = useLocation();
  const isSignUp = location.pathname.includes("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password, inviteCode);
      } else {
        await signIn(email, password);
      }
      toast({ title: "Welcome!", description: "Successfully signed in" });
      navigate("/app/dashboard");
    } catch (error) {
      toast({ title: "Error", description: "Authentication failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Start your free trial" : "Welcome back to EchoTender Pro"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {isSignUp && (
              <div>
                <Label htmlFor="invite">Invite Code (optional)</Label>
                <Input id="invite" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
              </div>
            )}
            <Button type="submit" className="w-full">{isSignUp ? "Sign Up" : "Sign In"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
