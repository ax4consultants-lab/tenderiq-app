import { useState, useEffect } from "react";

const SETTINGS_KEY = "tenderiq_settings";

interface Settings {
  useMockAdapter: boolean;
  apiBaseUrl: string;
  authBypass: boolean;
}

const defaultSettings: Settings = {
  useMockAdapter: true,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  authBypass: import.meta.env.VITE_AUTH_BYPASS === "true" || false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return {
    ...settings,
    updateSettings,
  };
}
