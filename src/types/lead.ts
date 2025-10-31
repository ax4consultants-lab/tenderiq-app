import { Tender } from "./tender";

export interface Lead extends Tender {
  score: number;
  matched_keywords: string[];
  rationale?: string;
}
