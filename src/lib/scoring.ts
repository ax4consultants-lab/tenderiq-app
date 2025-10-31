import { Tender } from "@/types/tender";
import { Lead } from "@/types/lead";
import { getDaysUntilClose, formatDate } from "./utils";

export type ScoringRules = {
  include_keywords: string[];
  exclude_keywords?: string[];
  regions?: string[];
  min_days_left?: number;
  min_score?: number;
};

export function scoreTender(t: Tender, rules: ScoringRules): Lead {
  const text = `${t.title} ${t.description ?? ""}`.toLowerCase();
  const hits = rules.include_keywords
    .filter(k => text.includes(k.toLowerCase()));
  const excludes = (rules.exclude_keywords ?? [])
    .some(k => text.includes(k.toLowerCase()));

  let score = 0;
  if (hits.length) score += Math.min(60, hits.length * 15);
  if (!excludes) score += 10;

  if (rules.regions?.length && t.region && rules.regions.includes(t.region)) score += 15;

  if (t.close_date) {
    const days = getDaysUntilClose(t.close_date) ?? 999;
    if (days >= (rules.min_days_left ?? 2) && days <= 14) score += 15;
    if (days < (rules.min_days_left ?? 2)) score -= 25;
  }

  score = Math.max(0, Math.min(100, score));
  const rationale = `Matched: ${hits.length > 0 ? hits.join(", ") : "None"}${t.region ? ` • Region: ${t.region}` : ""}${
    t.close_date ? ` • Closes: ${formatDate(t.close_date)}` : ""
  }`;

  return { ...t, score, matched_keywords: hits, rationale };
}

export function scoreLeads(tenders: Tender[], rules: ScoringRules): Lead[] {
  return tenders
    .map(t => scoreTender(t, rules))
    .filter(l => l.score >= (rules.min_score ?? 0))
    .sort((a, b) => b.score - a.score);
}
