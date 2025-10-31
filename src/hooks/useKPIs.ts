import { useQuery } from "@tanstack/react-query";
import { createAdapter } from "@/lib/adapters";
import { useSettings } from "./useSettings";

export function useKPIs() {
  const { useMockAdapter, apiBaseUrl } = useSettings();
  
  return useQuery({
    queryKey: ["kpis", useMockAdapter, apiBaseUrl],
    queryFn: async () => {
      const adapter = createAdapter(useMockAdapter, apiBaseUrl);
      return adapter.getKPIs();
    },
  });
}
