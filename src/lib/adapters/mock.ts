import { Tender, TenderFilters, TenderResponse, KPIs } from "@/types/tender";
import mockData from "@/data/mock/tenders.json";

const tenders = mockData as Tender[];

export class MockAdapter {
  async getTenders(filters: TenderFilters = {}): Promise<TenderResponse> {
    let filtered = [...tenders];

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
      );
    }

    // Apply source filter
    if (filters.source && filters.source.length > 0) {
      filtered = filtered.filter((t) => filters.source!.includes(t.source));
    }

    // Apply region filter
    if (filters.region && filters.region.length > 0) {
      filtered = filtered.filter((t) => t.region && filters.region!.includes(t.region));
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((t) => filters.status!.includes(t.status));
    }

    // Apply date range filters
    if (filters.close_from) {
      filtered = filtered.filter(
        (t) => t.close_date && t.close_date >= filters.close_from!
      );
    }
    if (filters.close_to) {
      filtered = filtered.filter(
        (t) => t.close_date && t.close_date <= filters.close_to!
      );
    }

    // Sort
    const sortBy = filters.sortBy || "close_date";
    const sortOrder = filters.sortOrder || "asc";
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (sortBy === "close_date" || sortBy === "open_date") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else {
        aVal = aVal?.toLowerCase() || "";
        bVal = bVal?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    return {
      data: paginated,
      total: filtered.length,
      page,
      pageSize,
    };
  }

  async getTenderById(id: string): Promise<Tender | null> {
    return tenders.find((t) => t.id === id) || null;
  }

  async getKPIs(): Promise<KPIs> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const todayStart = new Date(now.setHours(0, 0, 0, 0));

    const total_last_30d = tenders.filter((t) => {
      const openDate = t.open_date ? new Date(t.open_date) : null;
      return openDate && openDate >= thirtyDaysAgo;
    }).length;

    const closing_in_7d = tenders.filter((t) => {
      const closeDate = t.close_date ? new Date(t.close_date) : null;
      return closeDate && closeDate <= sevenDaysFromNow && closeDate >= now;
    }).length;

    const new_today = tenders.filter((t) => {
      const openDate = t.open_date ? new Date(t.open_date) : null;
      return openDate && openDate >= todayStart;
    }).length;

    const sources_breakdown = tenders.reduce((acc, t) => {
      acc[t.source] = (acc[t.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total_last_30d,
      closing_in_7d,
      new_today,
      sources_breakdown,
    };
  }
}
