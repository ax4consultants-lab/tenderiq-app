import { AlertsConfig } from "@/hooks/useAlerts";
import { Lead } from "@/types/lead";
import { DigestLead, DigestPayload } from "@/types/digest";

export function buildDigestPayload(config: AlertsConfig, leads: Lead[], generatedAt?: string): DigestPayload {
  const payloadLeads: DigestLead[] = leads.map((lead) => ({
    id: lead.id,
    title: lead.title,
    agency: lead.agency,
    region: lead.region,
    close_date: lead.close_date,
    url: lead.url,
    score: lead.score,
    matched_keywords: lead.matched_keywords,
    rationale: lead.rationale,
  }));

  return {
    generated_at: generatedAt ?? new Date().toISOString(),
    rules: config,
    leads: payloadLeads,
  };
}
