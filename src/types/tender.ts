import { z } from "zod";

export const TenderStatusSchema = z.enum(["Open", "Closed", "Awarded", "Draft", "Unknown"]);
export type TenderStatus = z.infer<typeof TenderStatusSchema>;

export const SourceSchema = z.enum(["AusTender", "NSW", "SA", "GrantsConnect", "Other"]);
export type Source = z.infer<typeof SourceSchema>;

export const ProvenanceSchema = z.object({
  fetched_at: z.string(),
  normalized_at: z.string(),
  raw_hash: z.string().optional(),
  source_url: z.string().optional(),
});
export type Provenance = z.infer<typeof ProvenanceSchema>;

export const TenderSchema = z.object({
  id: z.string(),
  source: SourceSchema,
  tender_id: z.string(),
  title: z.string(),
  agency: z.string().nullable(),
  category: z.string().nullable(),
  region: z.string().nullable(),
  open_date: z.string().nullable(),
  close_date: z.string().nullable(),
  status: TenderStatusSchema,
  description: z.string().nullable(),
  url: z.string().nullable(),
  provenance: ProvenanceSchema,
});
export type Tender = z.infer<typeof TenderSchema>;

export const KPIsSchema = z.object({
  total_last_30d: z.number(),
  closing_in_7d: z.number(),
  new_today: z.number(),
  sources_breakdown: z.record(z.number()),
});
export type KPIs = z.infer<typeof KPIsSchema>;

export interface TenderFilters {
  search?: string;
  source?: string[];
  region?: string[];
  status?: TenderStatus[];
  close_from?: string;
  close_to?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "close_date" | "open_date" | "title";
  sortOrder?: "asc" | "desc";
}

export interface TenderResponse {
  data: Tender[];
  total: number;
  page: number;
  pageSize: number;
}
