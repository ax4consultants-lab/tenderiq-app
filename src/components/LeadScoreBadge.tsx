import { Badge } from "@/components/ui/badge";

interface LeadScoreBadgeProps {
  score: number;
}

export function LeadScoreBadge({ score }: LeadScoreBadgeProps) {
  const variant = score >= 80 ? "default" : score >= 60 ? "secondary" : "outline";
  
  return (
    <Badge variant={variant} className="font-semibold">
      {score}
    </Badge>
  );
}
