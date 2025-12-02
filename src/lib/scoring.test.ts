import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scoreLeads, scoreTender } from "./scoring";
import type { Tender } from "@/types/tender";

const baseTender: Tender = {
  id: "1",
  source: "AusTender",
  tender_id: "AT-001",
  title: "",
  agency: null,
  category: null,
  region: "NSW",
  open_date: "2024-12-01T00:00:00Z",
  close_date: "2024-12-10T00:00:00Z",
  status: "Open",
  description: "",
  url: null,
  provenance: {
    fetched_at: "2024-12-01T00:00:00Z",
    normalized_at: "2024-12-01T00:00:00Z",
    raw_hash: undefined,
    source_url: undefined,
  },
};

const makeTender = (overrides: Partial<Tender> = {}): Tender => ({
  ...baseTender,
  ...overrides,
});

describe("scoreTender", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("awards a high score when keywords, region, and close date align", () => {
    const tender = makeTender({
      title: "Cloud security and AI services",
      description: "Seeking AI-driven cloud security platform with analytics",
      close_date: "2024-01-10T00:00:00Z",
    });

    const result = scoreTender(tender, {
      include_keywords: ["cloud", "security", "ai", "platform"],
      exclude_keywords: ["legacy"],
      regions: ["NSW"],
    });

    expect(result.score).toBe(100);
    expect(result.matched_keywords).toEqual(["cloud", "security", "ai", "platform"]);
  });

  it("penalizes tenders that contain excluded keywords", () => {
    const tender = makeTender({
      title: "Cloud migration with legacy systems",
      description: "Includes legacy component",
    });

    const result = scoreTender(tender, {
      include_keywords: ["cloud"],
      exclude_keywords: ["legacy"],
    });

    expect(result.score).toBe(15);
  });

  it("applies a penalty when the closing date is too soon", () => {
    const tender = makeTender({
      title: "Data platform build",
      close_date: "2024-01-02T00:00:00Z",
    });

    const result = scoreTender(tender, {
      include_keywords: ["data", "platform"],
    });

    expect(result.score).toBe(15);
  });

  it("clamps scores between 0 and 100", () => {
    const tender = makeTender({
      title: "General services",
      close_date: "2024-01-02T00:00:00Z",
    });

    const result = scoreTender(tender, {
      include_keywords: ["services"],
      min_days_left: 5,
    });

    expect(result.score).toBe(0);
  });
});

describe("scoreLeads", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns leads filtered by minimum score and sorted by highest score", () => {
    const tenders = [
      makeTender({ id: "1", title: "Cloud analytics platform", description: "cloud platform" }),
      makeTender({ id: "2", title: "Office supplies", description: "stationery" }),
      makeTender({ id: "3", title: "AI security upgrade", description: "ai security" }),
    ];

    const leads = scoreLeads(tenders, {
      include_keywords: ["cloud", "ai", "security"],
      min_score: 20,
    });

    expect(leads.map((l) => l.id)).toEqual(["3", "1"]);
    expect(leads.every((l) => l.score >= 20)).toBe(true);
  });
});
