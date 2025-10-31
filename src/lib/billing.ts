// Mock billing store for demo purposes
const STORAGE_KEY = "echotender_billing";

export interface BillingState {
  activeSubscription: boolean;
  plan?: "starter" | "pro";
  customerId?: string;
}

export function getBillingState(): BillingState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { activeSubscription: false };
}

export function setBillingState(state: BillingState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function activateSubscription(plan: "starter" | "pro") {
  setBillingState({
    activeSubscription: true,
    plan,
    customerId: `cus_${Math.random().toString(36).substr(2, 9)}`,
  });
}

export function deactivateSubscription() {
  setBillingState({ activeSubscription: false });
}
