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