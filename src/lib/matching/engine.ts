import { PATHWAYS } from "@/lib/pathways/data";
import type { LanguageLevel, Pathway, PathwayCategory } from "@/lib/pathways/types";
import { SIGNAL_LABELS, type SignalKey, type SignalSet } from "@/lib/missions/types";
import { FREE_PREFIX, SKIPPED, answerLabel } from "@/lib/guide/script";
import type {
  ExcludedPathway,
  MatchResult,
  PathwayRejection,
  RankedPathway,
  ScoreLine,
} from "./types";
import type { Direction } from "@/state/journey";

/**
 * Deterministic, rule-based, fully auditable matching.
 *
 * No model is called here. No weights are hidden. Nothing about the person is
 * inferred beyond what they explicitly stated, and no pathway is ever removed
 * because of a judgement about them — only because of a constraint they set.
 * This is a deliberate GDPR Article 22 design decision.
 */

const MAX_HOURS: Record<string, number> = {
  "t-minimal": 5,
  "t-part": 15,
  "t-most": 35,
  "t-full": 100,
};

const MAX_MONTHS: Record<string, number> = {
  "r-short": 3,
  "r-medium": 12,
  "r-long": 600,
};

const USER_LANGUAGE_RANK: Record<string, number> = {
  "l-en": 1,
  "l-en-other": 2,
  "l-basic-ua": 3,
  "l-fluent-ua": 4,
};

const PATHWAY_LANGUAGE_RANK: Record<LanguageLevel, number> = {
  none: 0,
  english: 1,
  "english-plus-local": 2,
  "basic-ukrainian": 3,
  "fluent-ukrainian": 4,
};

const RISK_RANK: Record<Pathway["riskBand"], number> = { none: 0, low: 1, moderate: 2, high: 3 };
const USER_RISK_RANK: Record<string, number> = {
  "k-none": 0,
  "k-low": 1,
  "k-moderate": 2,
  "k-high": 3,
};

export const DIRECTION_TO_CATEGORY: Record<string, PathwayCategory | null> = {
  serve: "military",
  build: "defence-tech",
  support: "humanitarian",
  explore: null,
};

export const SIGNAL_FIT_MAX = 60;
export const COMMITMENT_FIT_MAX = 25;
export const PREFERENCE_MAX = 15;
export const MAX_SCORE = SIGNAL_FIT_MAX + COMMITMENT_FIT_MAX + PREFERENCE_MAX;

export type MatchInput = {
  signals: SignalSet;
  answers: Record<string, string>;
  direction: Direction;
  /** Dimensions the person named when they said a pathway did not fit them. */
  rejections?: PathwayRejection[];
};

const stated = (answers: Record<string, string>, id: string): string | null => {
  const v = answers[id];
  if (!v || v === SKIPPED) return null;
  // Free text is never parsed into a constraint. We will not guess.
  if (v.startsWith(FREE_PREFIX)) return null;
  return v;
};

function hardFilter(
  p: Pathway,
  answers: Record<string, string>,
): { reason: string; fromAnswer: string } | null {
  const reloc = stated(answers, "reloc");
  if (reloc === "r-none" && p.relocationRequired) {
    return {
      reason: "You said you need to contribute from where you are, and this pathway requires relocating.",
      fromAnswer: answerLabel("reloc", reloc),
    };
  }
  if (reloc && reloc !== "r-none" && p.relocationRequired) {
    const maxMonths = MAX_MONTHS[reloc] ?? 600;
    if (p.commitmentMonths.min > maxMonths) {
      return {
        reason: `The shortest realistic commitment here is ${p.commitmentMonths.min} months, and you said you could relocate for less than that.`,
        fromAnswer: answerLabel("reloc", reloc),
      };
    }
  }

  const time = stated(answers, "time");
  if (time) {
    const maxHours = MAX_HOURS[time] ?? 100;
    if (p.hoursPerWeek.min > maxHours) {
      return {
        reason: `This pathway needs at least ${p.hoursPerWeek.min} hours a week, and you said you have fewer than that.`,
        fromAnswer: answerLabel("time", time),
      };
    }
  }

  const lang = stated(answers, "lang");
  if (lang) {
    const userRank = USER_LANGUAGE_RANK[lang] ?? 1;
    const needed = PATHWAY_LANGUAGE_RANK[p.languageRequirement.level];
    if (needed > userRank) {
      return {
        reason: `${p.languageRequirement.label} You told us your level is below that.`,
        fromAnswer: answerLabel("lang", lang),
      };
    }
  }

  const risk = stated(answers, "risk");
  if (risk && risk !== "k-unknown") {
    const userRank = USER_RISK_RANK[risk] ?? 3;
    if (RISK_RANK[p.riskBand] > userRank) {
      return {
        reason: `This pathway ordinarily carries ${p.riskBand} physical risk, which is above the level you said you are prepared to accept.`,
        fromAnswer: answerLabel("risk", risk),
      };
    }
  }

  return null;
}

function scorePathway(
  p: Pathway,
  signals: SignalSet,
  answers: Record<string, string>,
  preferred: PathwayCategory | null,
): RankedPathway {
  const lines: ScoreLine[] = [];

  // 1. Signal fit — only from signals a mission legitimately observed.
  const observed = p.requiredSignals.filter((k) => signals[k] !== undefined) as SignalKey[];
  if (observed.length === 0) {
    lines.push({
      label: "Signal fit",
      points: 0,
      reason:
        "No mission signal relevant to this pathway was observed, so nothing was added or subtracted here.",
    });
  } else {
    const per = SIGNAL_FIT_MAX / p.requiredSignals.length;
    for (const key of observed) {
      const s = signals[key]!;
      const points = Math.round((s.value / 100) * per);
      lines.push({
        label: SIGNAL_LABELS[key],
        points,
        reason: `${SIGNAL_LABELS[key]} (${s.value}) matters here: ${p.requiredSignals.length} signals count for this pathway, so this one contributes up to ${Math.round(per)} points.`,
      });
    }
    const unobserved = p.requiredSignals.filter((k) => signals[k] === undefined);
    if (unobserved.length > 0) {
      lines.push({
        label: "Not observed",
        points: 0,
        reason: `${unobserved.map((k) => SIGNAL_LABELS[k]).join(" and ")} also matters here and was not observed in the task you did. It scores nothing rather than zero.`,
      });
    }
  }

  // 2. Commitment fit — how close the pathway sits to the time they stated.
  const time = stated(answers, "time");
  if (time) {
    const maxHours = MAX_HOURS[time] ?? 100;
    const fits = p.hoursPerWeek.min <= maxHours;
    const headroom = fits ? Math.min(1, maxHours / Math.max(1, p.hoursPerWeek.max)) : 0;
    const points = Math.round(COMMITMENT_FIT_MAX * Math.min(1, headroom));
    lines.push({
      label: "Commitment fit",
      points,
      reason: `This pathway runs ${p.hoursPerWeek.min}–${p.hoursPerWeek.max} hours a week, against the ${answerLabel("time", time).toLowerCase()} you stated.`,
    });
  } else {
    lines.push({
      label: "Commitment fit",
      points: Math.round(COMMITMENT_FIT_MAX / 2),
      reason:
        "You did not state your available time, so commitment fit is held at its neutral midpoint rather than guessed.",
    });
  }

  // 3. Category preference — from the direction they chose themselves.
  if (preferred && p.category === preferred) {
    lines.push({
      label: "Category preference",
      points: PREFERENCE_MAX,
      reason: `You chose this direction yourself at step 02, so pathways in the ${p.category} category are boosted. This never removes anything from the other three categories.`,
    });
  } else {
    lines.push({
      label: "Category preference",
      points: 0,
      reason: preferred
        ? "Outside the direction you chose, so no preference points. It is still ranked and still shown."
        : "You chose to explore rather than pick a direction, so no category is boosted over another.",
    });
  }

  const score = lines.reduce((n, l) => n + l.points, 0);
  return { pathway: p, score, maxScore: MAX_SCORE, lines };
}

function rejectionFilter(
  p: Pathway,
  rejections: PathwayRejection[],
): { reason: string; fromAnswer: string } | null {
  for (const r of rejections) {
    const source = PATHWAYS.find((x) => x.id === r.pathwayId);
    if (!source) continue;
    const from = `You said "${source.title}" did not fit you.`;
    if (p.id === source.id) {
      return { reason: "You told us this one does not fit you, so it is not shown again.", fromAnswer: from };
    }
    if (r.dimension === "commitment" && p.commitmentMonths.min >= source.commitmentMonths.min) {
      return {
        reason: `You said the commitment was the problem, and this one asks for at least ${p.commitmentMonths.min} months as well.`,
        fromAnswer: from,
      };
    }
    if (r.dimension === "location" && source.relocationRequired && p.relocationRequired) {
      return {
        reason: "You said the location was the problem, and this pathway also requires relocating.",
        fromAnswer: from,
      };
    }
    if (
      r.dimension === "language" &&
      PATHWAY_LANGUAGE_RANK[p.languageRequirement.level] >=
        PATHWAY_LANGUAGE_RANK[source.languageRequirement.level] &&
      PATHWAY_LANGUAGE_RANK[source.languageRequirement.level] > 0
    ) {
      return {
        reason: "You said the language requirement was the problem, and this one asks for as much or more.",
        fromAnswer: from,
      };
    }
    if (r.dimension === "risk" && RISK_RANK[p.riskBand] >= RISK_RANK[source.riskBand] && RISK_RANK[source.riskBand] > 0) {
      return {
        reason: `You said the risk was the problem, and this pathway ordinarily carries ${p.riskBand} physical risk too.`,
        fromAnswer: from,
      };
    }
    if (r.dimension === "work-type" && p.category === source.category) {
      return {
        reason: "You said the type of work was the problem, so the rest of that category is set aside too.",
        fromAnswer: from,
      };
    }
  }
  return null;
}

export function matchPathways({ signals, answers, direction, rejections = [] }: MatchInput): MatchResult {
  const preferred = direction ? (DIRECTION_TO_CATEGORY[direction] ?? null) : null;

  const excluded: ExcludedPathway[] = [];
  const surviving: Pathway[] = [];

  for (const p of PATHWAYS) {
    const fail = hardFilter(p, answers) ?? rejectionFilter(p, rejections);
    if (fail) excluded.push({ pathway: p, reason: fail.reason, fromAnswer: fail.fromAnswer });
    else surviving.push(p);
  }

  const ranked = surviving
    .map((p) => scorePathway(p, signals, answers, preferred))
    .sort((a, b) => b.score - a.score || a.pathway.title.localeCompare(b.pathway.title));

  const top = ranked.slice(0, 3);

  const constraintsApplied: string[] = [];
  for (const id of ["reloc", "time", "lang", "risk"]) {
    const v = answers[id];
    if (!v || v === SKIPPED) {
      constraintsApplied.push(`${id === "reloc" ? "Relocation" : id === "time" ? "Time" : id === "lang" ? "Language" : "Risk"}: left open, so nothing was filtered out on it.`);
    } else if (v.startsWith(FREE_PREFIX)) {
      constraintsApplied.push(
        `${id === "reloc" ? "Relocation" : id === "time" ? "Time" : id === "lang" ? "Language" : "Risk"}: you answered in your own words, which is never parsed into a filter. Nothing was excluded on it.`,
      );
    } else {
      constraintsApplied.push(
        `${id === "reloc" ? "Relocation" : id === "time" ? "Time" : id === "lang" ? "Language" : "Risk"}: ${answerLabel(id, v)}.`,
      );
    }
  }

  const shortfall =
    top.length < 3
      ? `Only ${top.length} pathway${top.length === 1 ? "" : "s"} survived the constraints you set. We are not padding the list with pathways that do not fit. Everything removed is listed below with its reason, and changing any answer changes the result.`
      : null;

  return { top, ranked, excluded, shortfall, constraintsApplied, preferredCategory: preferred };
}