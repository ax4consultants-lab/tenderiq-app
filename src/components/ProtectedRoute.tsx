import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getBillingState } from "@/lib/billing";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
}

export function ProtectedRoute({ children, requireSubscription = true }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { activeSubscription } = getBillingState();

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (requireSubscription && !activeSubscription) {
    return <Navigate to="/?subscribe=true" replace />;
  }

  return <>{children}</>;
}
