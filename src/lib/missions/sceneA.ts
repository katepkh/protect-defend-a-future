import { clamp, type MissionDebrief, type SignalSet } from "./types";

export type Truth = "damaged" | "ambiguous" | "clean";
export type DamageKind = "collapse" | "debris" | "scorch" | "shadow" | "dark-roof" | null;
export type Confidence = "certain" | "likely" | "uncertain";

export type Structure = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  truth: Truth;
  damage: DamageKind;
  /** Plain-language ground truth, shown only in the debrief. */
  truthNote: string;
};

export const SCENE = {
  width: 900,
  height: 560,
  /** Fictional grid reference. Synthetic, not a real location. */
  grid: "SYNTH GRID 04-KV / FRAME 118",
  river: "M -20 84 C 190 176 330 236 520 300 C 700 360 810 448 920 512",
  riverWidth: 34,
  bridgeRoad: "M 252 118 L 566 434",
  bridgeSpan: { x: 372, y: 238, w: 74, h: 74 },
  roads: [
    "M 96 34 L 900 178",
    "M 612 8 L 792 236",
    "M 286 52 L 498 258",
    "M -10 322 L 438 560",
    "M 46 424 L 618 560",
  ],
  rail: { y: 24 },
  substation: { x: 748, y: 84, w: 116, h: 74 },
} as const;

export const STRUCTURES: Structure[] = [
  { id: "S01", label: "Block 01", x: 118, y: 58, w: 56, h: 38, rot: -4, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S02", label: "Block 02", x: 202, y: 38, w: 42, h: 34, rot: 6, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S03", label: "Block 03", x: 268, y: 92, w: 64, h: 42, rot: -2, truth: "damaged", damage: "collapse", truthNote: "Roof collapse across the north span." },
  { id: "S04", label: "Block 04", x: 352, y: 58, w: 46, h: 44, rot: 9, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S05", label: "Block 05", x: 420, y: 120, w: 60, h: 42, rot: -6, truth: "ambiguous", damage: "shadow", truthNote: "Not damaged. The dark wedge is a shadow cast by the taller block beside it." },
  { id: "S06", label: "Block 06", x: 502, y: 68, w: 50, h: 36, rot: 3, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S07", label: "Block 07", x: 558, y: 148, w: 68, h: 48, rot: -8, truth: "damaged", damage: "collapse", truthNote: "Partial collapse with debris scatter to the south-west." },
  { id: "S08", label: "Block 08", x: 640, y: 56, w: 48, h: 40, rot: 5, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S09", label: "Block 09", x: 660, y: 192, w: 58, h: 40, rot: -3, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S10", label: "Block 10", x: 762, y: 242, w: 56, h: 44, rot: 7, truth: "damaged", damage: "scorch", truthNote: "Scorching consistent with a fire event on the east elevation." },
  { id: "S11", label: "Block 11", x: 838, y: 140, w: 44, h: 52, rot: -5, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S12", label: "Block 12", x: 468, y: 202, w: 42, h: 36, rot: 11, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S13", label: "Block 13", x: 40, y: 300, w: 62, h: 44, rot: -6, truth: "ambiguous", damage: "dark-roof", truthNote: "Not damaged. Dark bitumen roof covering, present in the earlier frame too." },
  { id: "S14", label: "Block 14", x: 122, y: 382, w: 54, h: 40, rot: 4, truth: "damaged", damage: "debris", truthNote: "Structure breached; heavy debris field around the perimeter." },
  { id: "S15", label: "Block 15", x: 58, y: 470, w: 48, h: 40, rot: -2, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S16", label: "Block 16", x: 202, y: 458, w: 66, h: 44, rot: 8, truth: "damaged", damage: "collapse", truthNote: "Full roof collapse into the footprint." },
  { id: "S17", label: "Block 17", x: 306, y: 498, w: 50, h: 40, rot: -7, truth: "clean", damage: null, truthNote: "Intact." },
  { id: "S18", label: "Block 18", x: 398, y: 466, w: 60, h: 42, rot: 3, truth: "damaged", damage: "scorch", truthNote: "Scorching and thermal staining across the yard." },
];

export const TRUE_DAMAGE_COUNT = STRUCTURES.filter((s) => s.truth === "damaged").length;
export const AMBIGUOUS_COUNT = STRUCTURES.filter((s) => s.truth === "ambiguous").length;

export type Flag = { id: string; confidence: Confidence | null };

export type MissionAResult = {
  detected: number;
  missed: string[];
  falsePositives: string[];
  ambiguousHandled: number;
  ambiguousOverconfident: number;
  confidentWrong: number;
  elapsed: number;
  flags: Flag[];
  detection: number;
  /** Null when the person never actively chose a confidence level. */
  calibration: number | null;
  /** Flags left at the default confidence, never actively chosen. */
  defaulted: number;
  /** Flags where a confidence level was actively chosen. */
  stated: number;
  restraint: number;
};

const byId = new Map(STRUCTURES.map((s) => [s.id, s]));

export function scoreMissionA(flags: Flag[], elapsed: number): MissionAResult {
  const seen = new Set<string>();
  const clean = flags.filter((f) => {
    if (seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });

  const truthOf = (id: string) => byId.get(id)?.truth ?? "clean";
  const conf = (f: Flag): Confidence => f.confidence ?? "uncertain";

  const detectedIds = clean.filter((f) => truthOf(f.id) === "damaged").map((f) => f.id);
  const missed = STRUCTURES.filter((s) => s.truth === "damaged" && !detectedIds.includes(s.id)).map(
    (s) => s.id,
  );
  const falsePositives = clean.filter((f) => truthOf(f.id) === "clean").map((f) => f.id);

  const ambiguousFlags = clean.filter((f) => truthOf(f.id) === "ambiguous");
  const ambiguousHandled = ambiguousFlags.filter((f) => f.confidence === "uncertain").length;
  const ambiguousOverconfident = ambiguousFlags.filter((f) => f.confidence === "certain").length;
  const confidentWrong = clean.filter(
    (f) => f.confidence === "certain" && truthOf(f.id) !== "damaged",
  ).length;

  // Calibration measures the quality of the confidence levels the person
  // actually chose, on the flags they actually made. It is not a coverage
  // measure — missing a structure costs detection, never calibration — and a
  // flag left at the default confidence is not scored at all, because no
  // judgement of confidence was expressed.
  const stated = clean.filter((f) => f.confidence !== null);
  const defaulted = clean.length - stated.length;
  const creditFor = (t: Truth, c: Confidence) => {
    if (t === "damaged") return c === "certain" ? 1 : c === "likely" ? 0.8 : 0.55;
    if (t === "ambiguous") return c === "uncertain" ? 1 : c === "likely" ? 0.75 : 0;
    return c === "uncertain" ? 0.45 : c === "likely" ? 0.15 : 0;
  };
  const calibration =
    stated.length === 0
      ? null
      : clamp(
          (stated.reduce((sum, f) => sum + creditFor(truthOf(f.id), f.confidence!), 0) /
            stated.length) *
            100,
        );

  return {
    detected: detectedIds.length,
    missed,
    falsePositives,
    ambiguousHandled,
    ambiguousOverconfident,
    confidentWrong,
    elapsed,
    flags: clean,
    detection: clamp((detectedIds.length / TRUE_DAMAGE_COUNT) * 100),
    calibration,
    defaulted,
    stated: stated.length,
    restraint: clamp(100 - falsePositives.length * 22),
  };
}

function speedSignal(decisions: number, elapsed: number) {
  const perMinute = decisions / Math.max(elapsed, 8) * 60;
  return clamp((perMinute / 7) * 100, 12, 100);
}

export function debriefMissionA(r: MissionAResult): MissionDebrief {
  const paragraphs: string[] = [];

  const first =
    r.detected === TRUE_DAMAGE_COUNT
      ? `You found all ${TRUE_DAMAGE_COUNT} damaged structures.`
      : `You found ${r.detected} of the ${TRUE_DAMAGE_COUNT} damaged structures.`;

  if (r.ambiguousHandled === AMBIGUOUS_COUNT) {
    paragraphs.push(
      `${first} More importantly, you marked both ambiguous structures as uncertain instead of guessing. In damage assessment, calibrated uncertainty matters more than raw detection — a confident wrong call sends a crew to the wrong street.`,
    );
  } else if (r.ambiguousOverconfident > 0) {
    paragraphs.push(
      `${first} Two structures in this frame were deliberately ambiguous — one shadow, one dark roof covering. You called ${r.ambiguousOverconfident === 1 ? "one of them" : "both of them"} with certainty. That is the most common pattern in this exercise and it is not a character flaw; it is a habit that training corrects. A confident wrong call sends a crew to the wrong street, which costs more than a missed call that gets re-flown.`,
    );
  } else if (r.ambiguousHandled === 0) {
    paragraphs.push(
      `${first} You left both of the deliberately ambiguous structures unflagged. That is a defensible, conservative read — though flagging them as uncertain would have passed the doubt on to whoever reviews the frame next, rather than absorbing it silently.`,
    );
  } else {
    paragraphs.push(
      `${first} You marked one of the two ambiguous structures as uncertain. That instinct is the useful one — the question is whether you apply it consistently when a frame is busier than this.`,
    );
  }

  if (r.falsePositives.length === 0) {
    paragraphs.push(
      "You flagged nothing that was intact. Restraint reads as a small thing here and matters a great deal at scale, where every false flag consumes a verification pass someone has to actually fly or drive.",
    );
  } else {
    paragraphs.push(
      `You flagged ${r.falsePositives.length} intact ${r.falsePositives.length === 1 ? "structure" : "structures"}. That is a normal rate for a first pass and it is corrected quickly with reference imagery. It is worth noticing rather than worrying about.`,
    );
  }

  if (r.missed.length > 0) {
    paragraphs.push(
      `The ${r.missed.length === 1 ? "site you did not reach is" : "sites you did not reach are"} outlined in amber on the frame above. Not reaching everything inside the window is expected — assessors work in passes, not in one sweep.`,
    );
  }

  const calibrationNote = (() => {
    if (r.calibration === null) {
      return `You did not set a confidence level on ${r.flags.length === 1 ? "your flag" : "any of your flags"}, so there is nothing here to read. This is recorded as not observed rather than scored against you.`;
    }
    if (r.calibration < 40) {
      return "Your stated confidence did not match what the frame supported: certainty where the evidence was thin, or thin evidence called firmly.";
    }
    if (r.calibration < 75) {
      return "Partly matched. Some calls carried the right amount of doubt and some ran ahead of the evidence.";
    }
    return "Your stated confidence matched what the ground truth supported.";
  })();

  if (r.defaulted > 0) {
    paragraphs.push(
      r.stated === 0
        ? `You left the confidence level unset on every flag, so nothing was recorded about how sure you were. Calibration is shown as not observed rather than scored low — an unset control is a missing reading, not a wrong answer.`
        : `${r.defaulted} of your ${r.flags.length} flags were left at the default confidence. Those are excluded from the calibration reading, which is based only on the ${r.stated} ${r.stated === 1 ? "call" : "calls"} where you actively chose a level.`,
    );
  }

  const signals: SignalSet = {
    visual: {
      value: r.detection,
      note: `You identified ${r.detected} of ${TRUE_DAMAGE_COUNT} genuine damage indicators in a low-contrast synthetic frame.`,
    },
    ...(r.calibration === null
      ? {}
      : { calibration: { value: r.calibration, note: calibrationNote } }),
    speed: {
      value: speedSignal(r.flags.length, r.elapsed),
      note: `You made ${r.flags.length} ${r.flags.length === 1 ? "judgement" : "judgements"} in ${Math.round(r.elapsed)} seconds without the option to defer.`,
    },
  };

  return {
    missionId: "a",
    missionTitle: "Infrastructure damage triage",
    headline: "What the frame actually contained",
    paragraphs,
    measures: [
      {
        label: "Detection",
        value: `${r.detected} / ${TRUE_DAMAGE_COUNT}`,
        detail: "True damage sites flagged.",
      },
      {
        label: "Calibration",
        value: r.calibration === null ? "Not set" : `${r.calibration} / 100`,
        detail:
          r.calibration === null
            ? "No confidence level was chosen, so there is nothing to read here."
            : "How well your certainty matched the evidence, across the calls where you chose a level.",
        tone: r.calibration === null ? "neutral" : r.calibration >= 60 ? "verified" : "signal",
      },
      {
        label: "Restraint",
        value: `${r.falsePositives.length} false ${r.falsePositives.length === 1 ? "flag" : "flags"}`,
        detail: "Intact structures flagged as damaged. Weighted gently.",
      },
    ],
    signals,
  };
}

export const SAMPLE_FLAGS_A: Flag[] = [
  { id: "S03", confidence: "certain" },
  { id: "S07", confidence: "certain" },
  { id: "S10", confidence: "likely" },
  { id: "S16", confidence: "certain" },
  { id: "S18", confidence: "likely" },
  { id: "S05", confidence: "uncertain" },
  { id: "S13", confidence: "uncertain" },
  { id: "S09", confidence: "uncertain" },
];
