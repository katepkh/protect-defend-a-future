/**
 * Deterministic direction hint for the /direction step.
 *
 * Two answers in, at most two directions out, each with a plain-language
 * reason. No model is involved in the choice: the AI layer may only rewrite
 * the reflective sentence. Nothing here ranks a person, and no direction is
 * treated as a better answer than another.
 */
import type { Direction } from "@/state/journey";
import { GUIDE_QUESTION_BY_ID, SKIPPED } from "./script";

export type DirectionId = Exclude<Direction, null>;

export type MobilityOption = {
  id: string;
  label: string;
  /** How this maps onto the main guide's questions 02 and 03. */
  time: string;
  reloc: string;
  reflection: string;
};

export const MOBILITY_QUESTION = {
  id: "mobility",
  eyebrow: "QUESTION 02 OF 02",
  prompt: "How much time could you realistically give, and could you leave home to do it?",
  helper: "Time and distance are one question in practice. The honest answer is the useful one.",
  skipNote: "Skipping keeps all four directions equally open.",
  skipReflection:
    "Left open. All four directions stay equally available, and nothing has been assumed about you.",
};

export const MOBILITY_OPTIONS: MobilityOption[] = [
  {
    id: "m-few-home",
    label: "A few hours a week, from where I am",
    time: "t-minimal",
    reloc: "r-none",
    reflection:
      "A few hours a week, from where you are. That is a real constraint rather than a small one, and it is better stated now than discovered later.",
  },
  {
    id: "m-regular-home",
    label: "Regular hours a week, from where I am",
    time: "t-part",
    reloc: "r-none",
    reflection:
      "Regular hours, without leaving home. Enough for sustained remote work, and not enough for anything that expects your whole week.",
  },
  {
    id: "m-travel-months",
    label: "I could travel for a few months",
    time: "t-most",
    reloc: "r-short",
    reflection:
      "A few months away. Short placements exist; longer contracts will fall out of your results because you told us they would not fit.",
  },
  {
    id: "m-relocate-year",
    label: "I could relocate for a year or more",
    time: "t-full",
    reloc: "r-long",
    reflection:
      "A year or more. That leaves the heaviest commitments in view, which means you will see what they actually involve.",
  },
  {
    id: "m-unknown",
    label: "I genuinely do not know yet",
    time: SKIPPED,
    reloc: SKIPPED,
    reflection:
      "Not knowing yet is an honest answer and we will treat it as one. Nothing is filtered out on it, and nothing is assumed about you.",
  },
];

export const MOBILITY_BY_ID = new Map(MOBILITY_OPTIONS.map((o) => [o.id, o]));

export const CAPABILITY_QUESTION = GUIDE_QUESTION_BY_ID.get("capability")!;

export type DirectionSuggestion = { direction: DirectionId; reason: string };

const HOME_ONLY = new Set(["m-few-home", "m-regular-home"]);
const CAN_MOVE = new Set(["m-travel-months", "m-relocate-year"]);

const EXPLORE_UNCLEAR: DirectionSuggestion = {
  direction: "explore",
  reason:
    "Your two answers do not point anywhere clearly yet, and that is a real answer rather than a missing one. Explore is built for exactly this position.",
};

/**
 * Pure mapping: (capability, mobility) → one or two directions. Never more.
 * A skipped or unknown answer resolves to Explore, stated honestly.
 */
export function suggestDirections(
  capability: string | undefined,
  mobility: string | undefined,
): DirectionSuggestion[] {
  const cap = !capability || capability === SKIPPED || capability.startsWith("free:") ? null : capability;
  const mob = !mobility || mobility === SKIPPED ? null : mobility;

  if (!cap && !mob) return [EXPLORE_UNCLEAR];
  if (mob === "m-unknown" && !cap) return [EXPLORE_UNCLEAR];

  const home = mob != null && HOME_ONLY.has(mob);
  const moving = mob != null && CAN_MOVE.has(mob);

  if (cap === "c-engineering") {
    if (home)
      return [
        {
          direction: "build",
          reason:
            "You said you could show engineering work tomorrow and that you would stay where you are. A share of defence-technology work is genuinely remote.",
        },
      ];
    return [
      {
        direction: "build",
        reason: "Engineering you could demonstrate tomorrow is what defence-technology work asks for first.",
      },
      {
        direction: "serve",
        reason:
          "You said you could leave home. Serve is listed here because it is open to you, not because it is the better answer.",
      },
    ];
  }

  if (cap === "c-medical") {
    if (home)
      return [
        {
          direction: "support",
          reason:
            "Clinical practice matters most in humanitarian and medical work, and some of that coordination is done from where you are.",
        },
      ];
    return [
      {
        direction: "support",
        reason: "Clinical practice is the skill humanitarian and medical organisations are shortest of.",
      },
      {
        direction: "serve",
        reason:
          "Military medical roles exist and you said you could travel. It is one option among these, not a recommendation.",
      },
    ];
  }

  if (cap === "c-logistics") {
    if (home)
      return [
        {
          direction: "support",
          reason:
            "Practical and logistics work is the backbone of civilian resilience, and some of it is coordinated remotely.",
        },
      ];
    return [
      {
        direction: "support",
        reason: "Logistics and trades are what aid operations run on, and you said you could travel.",
      },
      {
        direction: "build",
        reason: "Hardware and production work uses the same practical skills, often on a fixed site.",
      },
    ];
  }

  if (cap === "c-analysis") {
    if (moving)
      return [
        {
          direction: "build",
          reason: "Analysis and languages sit close to intelligence, research and product work in defence technology.",
        },
        {
          direction: "support",
          reason: "The same skills carry coordination, reporting and translation inside humanitarian organisations.",
        },
      ];
    return [
      {
        direction: "build",
        reason:
          "Analysis, research and languages are among the few contributions that are genuinely useful from where you are.",
      },
    ];
  }

  if (cap === "c-none-yet") {
    if (home)
      return [
        {
          direction: "explore",
          reason:
            "You said plainly that you have no skill to show yet and that you are staying put. Explore shows you how the pathways work before you commit to any of them.",
        },
      ];
    return [
      {
        direction: "support",
        reason:
          "Several humanitarian roles start from willingness and train the rest. Several other pathways do not, and we will show you both.",
      },
      {
        direction: "explore",
        reason: "Looking first, without choosing, is a legitimate way to start.",
      },
    ];
  }

  // Capability skipped or written in the person's own words: mobility alone
  // is not enough to point anywhere honestly.
  return [EXPLORE_UNCLEAR];
}
