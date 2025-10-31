import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function KpiCard({ title, value, icon: Icon, description }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
