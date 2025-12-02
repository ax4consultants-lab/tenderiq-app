import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tender } from "@/types/tender";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function exportToCSV(data: Tender[], filename = "tenders.csv") {
  const headers = [
    "ID",
    "Source",
    "Tender ID",
    "Title",
    "Agency",
    "Category",
    "Region",
    "Open Date",
    "Close Date",
    "Status",
    "Description",
    "URL",
  ];

  const rows = data.map((t) => [
    t.id,
    t.source,
    t.tender_id,
    t.title,
    t.agency || "",
    t.category || "",
    t.region || "",
    t.open_date || "",
    t.close_date || "",
    t.status,
    t.description || "",
    t.url || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getDaysUntilClose(closeDate: string | null): number | null {
  if (!closeDate) return null;
  const now = new Date();
  const close = new Date(closeDate);
  const diff = close.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Simple cosine similarity for related tenders
export function cosineSimilarity(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\W+/);
  const wordsB = b.toLowerCase().split(/\W+/);
  const allWords = Array.from(new Set([...wordsA, ...wordsB]));
  
  const vectorA = allWords.map((word) => wordsA.filter((w) => w === word).length);
  const vectorB = allWords.map((word) => wordsB.filter((w) => w === word).length);
  
  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

export function findRelatedTenders(tender: Tender, allTenders: Tender[], limit = 5): Tender[] {
  const text = `${tender.title} ${tender.description || ""}`;
  
  const scored = allTenders
    .filter((t) => t.id !== tender.id)
    .map((t) => ({
      tender: t,
      score: cosineSimilarity(text, `${t.title} ${t.description || ""}`),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return scored.map((s) => s.tender);
}

// Type guard to check if a tender is a Lead
export function isLead(tender: unknown): tender is import("@/types/lead").Lead {
  if (typeof tender !== "object" || tender === null) {
    return false;
  }

  return "score" in tender && "matched_keywords" in tender;
}
