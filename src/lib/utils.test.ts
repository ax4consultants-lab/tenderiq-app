import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate, getDaysUntilClose } from "./utils";

describe("getDaysUntilClose", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the number of days until the close date", () => {
    expect(getDaysUntilClose("2024-01-10T00:00:00Z")).toBe(9);
  });

  it("returns null when no close date is provided", () => {
    expect(getDaysUntilClose(null)).toBeNull();
  });
});

describe("formatDate", () => {
  it("formats valid dates in en-AU format", () => {
    expect(formatDate("2024-03-15T00:00:00Z")).toBe("15 Mar 2024");
  });

  it("returns 'N/A' when the date is null", () => {
    expect(formatDate(null)).toBe("N/A");
  });
});
