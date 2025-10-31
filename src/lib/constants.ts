export const DEFAULT_TZ = "Australia/Adelaide";
export const DEFAULT_LOCALE = "en-AU";

export const SUBSCRIPTION_PLANS = {
  starter: {
    name: "Starter",
    price: 49,
    priceAnnual: 490,
    features: [
      "Up to 1,000 tenders per month",
      "Basic search and filters",
      "Email alerts",
      "CSV export",
    ],
  },
  pro: {
    name: "Pro",
    price: 99,
    priceAnnual: 990,
    features: [
      "Unlimited tenders",
      "Advanced filters and search",
      "Priority email alerts",
      "CSV export",
      "API access",
      "Custom digest schedules",
    ],
  },
} as const;
