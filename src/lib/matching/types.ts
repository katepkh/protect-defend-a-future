import type { Pathway, PathwayCategory } from "@/lib/pathways/types";

export type ScoreLine = {
  label: string;
  /** Points contributed. Always shown to the user, never hidden. */
  points: number;
  reason: string;
};

export type RankedPathway = {
  pathway: Pathway;
  score: number;
  maxScore: number;
  lines: ScoreLine[];
};

export type ExcludedPathway = {
  pathway: Pathway;
  /** Plain-language reason, always traceable to something the person stated. */
  reason: string;
  /** The exact answer that caused it, so the person can change their own mind. */
  fromAnswer: string;
};

export type MatchResult = {
  top: RankedPathway[];
  ranked: RankedPathway[];
  excluded: ExcludedPathway[];
  /** Honest statement when fewer than three pathways survived. */
  shortfall: string | null;
  /** Constraints read from the person's own answers, echoed back. */
  constraintsApplied: string[];
  preferredCategory: PathwayCategory | null;
};

/**
 * A dimension the person themselves named when they said a pathway did not
 * fit them. It is only ever used as an additional constraint they stated —
 * never as a judgement about them.
 */
export type RejectionDimension = "commitment" | "location" | "language" | "risk" | "work-type";

export type PathwayRejection = {
  pathwayId: string;
  dimension: RejectionDimension;
};

export const REJECTION_LABELS: Record<RejectionDimension, string> = {
  commitment: "The commitment is too long",
  location: "The location or relocation does not work",
  language: "The language requirement is beyond me",
  risk: "The level of risk is not for me",
  "work-type": "The type of work is not what I want",
};