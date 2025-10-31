import { useQuery } from "@tanstack/react-query";
import { TenderFilters } from "@/types/tender";
import { createAdapter } from "@/lib/adapters";
import { useSettings } from "./useSettings";

export function useTenders(filters: TenderFilters = {}) {
  const { useMockAdapter, apiBaseUrl } = useSettings();
  
  return useQuery({
    queryKey: ["tenders", filters, useMockAdapter, apiBaseUrl],
    queryFn: async () => {
      const adapter = createAdapter(useMockAdapter, apiBaseUrl);
      return adapter.getTenders(filters);
    },
  });
}

export function useTender(id: string) {
  const { useMockAdapter, apiBaseUrl } = useSettings();
  
  return useQuery({
    queryKey: ["tender", id, useMockAdapter, apiBaseUrl],
    queryFn: async () => {
      const adapter = createAdapter(useMockAdapter, apiBaseUrl);
      return adapter.getTenderById(id);
    },
    enabled: !!id,
  });
}
