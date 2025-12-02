import { AlertsConfig } from "@/hooks/useAlerts";
import { Lead } from "./lead";

export type DigestLead = Pick<
  Lead,
  "id" | "title" | "agency" | "region" | "close_date" | "url" | "score" | "matched_keywords" | "rationale"
>;

export interface DigestPayload {
  generated_at: string;
  rules: AlertsConfig;
  leads: DigestLead[];
}
