interface StorageMigration {
  oldKey: string;
  newKey: string;
}

const STORAGE_MIGRATIONS: StorageMigration[] = [
  { oldKey: "echotender_auth", newKey: "tenderiq_auth" },
  { oldKey: "echotender_settings", newKey: "tenderiq_settings" },
  { oldKey: "echotender_alerts", newKey: "tenderiq_alerts" },
  { oldKey: "echotender_billing", newKey: "tenderiq_billing" },
];

export function migrateLegacyLocalStorage() {
  if (typeof localStorage === "undefined") return;

  STORAGE_MIGRATIONS.forEach(({ oldKey, newKey }) => {
    try {
      const hasNewValue = localStorage.getItem(newKey) !== null;
      if (hasNewValue) return;

      const legacyValue = localStorage.getItem(oldKey);
      if (legacyValue !== null) {
        localStorage.setItem(newKey, legacyValue);
      }
    } catch (error) {
      console.warn(`Storage migration failed for ${oldKey} -> ${newKey}`, error);
    }
  });
}
