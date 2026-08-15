import type { SignalKey } from "@/lib/missions/types";

/**
 * Four strictly separated pathway categories. Data never flows between them:
 * a person's interest in one category is never used to suggest, or to pass
 * anything to, another. Military-service intent is never shown as flowing to
 * private defence companies.
 */
export type PathwayCategory = "military" | "defence-tech" | "humanitarian" | "remote";

export const CATEGORY_LABELS: Record<PathwayCategory, string> = {
  military: "Military service",
  "defence-tech": "Defence technology",
  humanitarian: "Humanitarian and medical",
  remote: "Remote contribution",
};

export const CATEGORY_NOTES: Record<PathwayCategory, string> = {
  military:
    "Service in Ukraine's armed forces. Entry is decided by official recruitment structures, never here.",
  "defence-tech":
    "Private-sector engineering, manufacturing and analysis. A separate category with separate consent.",
  humanitarian:
    "Medical, aid and civilian resilience work, run by civilian organisations under their own rules.",
  remote: "Contribution that does not require relocating, and does not pretend to be more than that.",
};

export type VerificationStatus = "verified" | "listed" | "unverified";

export type LanguageLevel =
  | "none"
  | "english"
  | "english-plus-local"
  | "basic-ukrainian"
  | "fluent-ukrainian";

export type Range = { min: number; max: number };

export type Pathway = {
  id: string;
  title: string;
  category: PathwayCategory;
  organisationId: string;
  organisationName: string;
  verificationStatus: VerificationStatus;
  location: string;
  relocationRequired: boolean;
  acceptsRemote: boolean;
  /** Typical contracted or expected commitment, in months. */
  commitmentMonths: Range;
  hoursPerWeek: Range;
  languageRequirement: { level: LanguageLevel; label: string };
  /** Physical-risk band the role ordinarily carries. Never a judgement of the person. */
  riskBand: "none" | "low" | "moderate" | "high";
  eligibilityNotes: string[];
  honestRisks: string[];
  honestLimitations: string[];
  ordinaryDayDescription: string;
  whatItIsNot: string;
  officialNextStepLabel: string;
  officialNextStepUrl: string;
  /** Capability signals that genuinely matter for this role. */
  requiredSignals: SignalKey[];
};

/** Hard requirement: shown wherever pathways are displayed. */
export const ILLUSTRATIVE_NOTICE =
  "Organisation details in this prototype are illustrative and must be re-verified against official sources before any real deployment.";