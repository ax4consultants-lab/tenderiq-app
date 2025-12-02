import { useState, useEffect } from "react";
import { DEFAULT_TZ } from "@/lib/constants";

const ALERTS_KEY = "tenderiq_alerts";

export interface AlertsConfig {
  keywords: string[];
  exclude?: string[];
  regions: string[];
  cadence: "daily" | "weekly";
  hour: string;
  minute: string;
  tz: string;
  min_days_left?: number;
  min_score?: number;
}

const defaultConfig: AlertsConfig = {
  keywords: [],
  exclude: [],
  regions: [],
  cadence: "daily",
  hour: "08",
  minute: "30",
  tz: DEFAULT_TZ,
  min_days_left: 2,
  min_score: 50,
};

export function useAlerts() {
  const [config, setConfig] = useState<AlertsConfig>(() => {
    const stored = localStorage.getItem(ALERTS_KEY);
    if (stored) {
      return { ...defaultConfig, ...JSON.parse(stored) };
    }
    return defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<AlertsConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return {
    config,
    updateConfig,
  };
}
