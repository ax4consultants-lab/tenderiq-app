import { Tender, TenderFilters, TenderResponse, KPIs, TenderSchema, KPIsSchema } from "@/types/tender";

export class RestAdapter {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTenders(filters: TenderFilters = {}): Promise<TenderResponse> {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.source) filters.source.forEach((s) => params.append("source", s));
    if (filters.region) filters.region.forEach((r) => params.append("region", r));
    if (filters.status) filters.status.forEach((s) => params.append("status", s));
    if (filters.close_from) params.append("close_from", filters.close_from);
    if (filters.close_to) params.append("close_to", filters.close_to);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await fetch(`${this.baseUrl}/tenders?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tenders: ${response.statusText}`);
    }
    return response.json();
  }

  async getTenderById(id: string): Promise<Tender | null> {
    const response = await fetch(`${this.baseUrl}/tenders/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to fetch tender: ${response.statusText}`);
    }
    const data = await response.json();
    return TenderSchema.parse(data);
  }

  async getKPIs(): Promise<KPIs> {
    const response = await fetch(`${this.baseUrl}/stats/kpis`);
    if (!response.ok) {
      throw new Error(`Failed to fetch KPIs: ${response.statusText}`);
    }
    const data = await response.json();
    return KPIsSchema.parse(data);
  }
}
