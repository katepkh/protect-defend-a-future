import { clamp, type MissionDebrief, type SignalSet } from "./types";

export type Bucket = "supports" | "contradicts" | "irrelevant";
export type Verdict = "verified" | "not-verified" | "insufficient";

export const CLAIM = {
  text: "A dam upstream of Kaminne Bystre has been destroyed and mass evacuation has been ordered.",
  place: "Kaminne Bystre",
  note: "Kaminne Bystre is a fictional place invented for this exercise. The claim, the evidence, and every timestamp below are synthetic.",
  postedAgo: "Claim first circulated 4 hours ago",
};

export type Evidence = {
  id: string;
  kind: string;
  title: string;
  body: string;
  meta: string[];
  /** The defensible sort, used only in the debrief. */
  answer: Bucket;
  answerNote: string;
  /** Whether this card's independence does not hold up. */
  circular: boolean;
};

export const EVIDENCE: Evidence[] = [
  {
    id: "E1",
    kind: "Social media",
    title: "Post with four photographs of flooded streets",
    body: "Account with 41k followers posts four images of water in a street, captioned as Kaminne Bystre this morning.",
    meta: ["Posted 3h ago", "Image EXIF capture date: 11 months earlier", "Location not embedded"],
    answer: "irrelevant",
    answerNote:
      "The photographs predate the claimed event by eleven months. They cannot support or contradict something that had not happened when they were taken.",
    circular: false,
  },
  {
    id: "E2",
    kind: "Satellite",
    title: "Optical satellite pass summary",
    body: "A pass over the correct area at 05:40 local. The analyst summary records the reservoir as not assessable.",
    meta: ["Correct area", "80% cloud cover", "Assessment: inconclusive"],
    answer: "irrelevant",
    answerNote:
      "Right area, wrong conditions. Cloud at 80% means the imagery is inconclusive, and inconclusive evidence is not weak evidence for either side — it is absence.",
    circular: false,
  },
  {
    id: "E3",
    kind: "Official",
    title: "Regional administration statement",
    body: "Statement advises residents in low-lying areas to monitor official channels and avoid the embankment. It neither confirms nor denies a dam failure.",
    meta: ["Issued 90 min ago", "No confirmation", "No denial"],
    answer: "irrelevant",
    answerNote:
      "Caution advisories are routine and are issued for many reasons. Reading a non-denial as confirmation is one of the most common analytical errors in a fast-moving story.",
    circular: false,
  },
  {
    id: "E4",
    kind: "News",
    title: "Local news report: 'Dam breach reported upstream'",
    body: "A regional outlet reports the breach in its own words, with a byline and a dateline. Its only cited source, at the foot of the piece, is the social media post above.",
    meta: ["Published 2h ago", "Sole cited source: E1", "No independent reporting"],
    answer: "irrelevant",
    answerNote:
      "This looks like independent corroboration and is not. Its only source is card E1. Two accounts of the same single origin are still one account.",
    circular: true,
  },
  {
    id: "E5",
    kind: "Instrument",
    title: "Downstream hydrological gauge record",
    body: "Automated gauge 22 km downstream, reporting every fifteen minutes. No anomalous flow change across the last twelve hours.",
    meta: ["22 km downstream", "15-minute interval", "No anomaly recorded"],
    answer: "contradicts",
    answerNote:
      "A dam failure of the scale claimed would show downstream within this window. The gauge is the only card here carrying real evidential weight, and it points against the claim.",
    circular: false,
  },
];

export const DEFENSIBLE_VERDICT: Verdict = "insufficient";

export type MissionCResult = {
  sorted: Record<string, Bucket | null>;
  circularFlags: string[];
  verdict: Verdict | null;
  elapsed: number;
  correctSorts: number;
  spottedCircular: boolean;
  falseCircular: number;
  verdictDefensible: boolean;
};

export function scoreMissionC(input: {
  sorted: Record<string, Bucket | null>;
  circularFlags: string[];
  verdict: Verdict | null;
  elapsed: number;
}): MissionCResult {
  const correctSorts = EVIDENCE.filter((e) => input.sorted[e.id] === e.answer).length;
  return {
    ...input,
    correctSorts,
    spottedCircular: input.circularFlags.includes("E4"),
    falseCircular: input.circularFlags.filter((id) => id !== "E4").length,
    verdictDefensible: input.verdict === DEFENSIBLE_VERDICT,
  };
}

export function debriefMissionC(r: MissionCResult): MissionDebrief {
  const paragraphs: string[] = [];

  if (r.spottedCircular) {
    paragraphs.push(
      "The strongest signal here was noticing that the 'independent' local report's only source was the original post. Circular sourcing is how most crisis misinformation gets laundered into credibility.",
    );
  } else {
    paragraphs.push(
      "The single most valuable observation in this set was available and unclaimed: the 'independent' local report's only cited source was the original social media post. Circular sourcing is how most crisis misinformation gets laundered into credibility — one origin, repeated, starts to look like corroboration.",
    );
  }

  if (r.verdictDefensible) {
    paragraphs.push(
      "Your verdict was insufficient evidence, which is the defensible answer. The gauge record points against the claim but a single instrument is not a refutation, and everything else in the set is either mis-dated, inconclusive, non-committal, or recycled.",
    );
  } else if (r.verdict === "not-verified") {
    paragraphs.push(
      "You returned not verified. That is close, and in a newsroom it would often be the practical call — but it states more than this evidence supports. The gauge leans against the claim; it does not close it. Insufficient evidence keeps the question open, which is what the situation still is.",
    );
  } else if (r.verdict === "verified") {
    paragraphs.push(
      "You returned verified. Nothing in this set can carry that: the photographs predate the event, the satellite pass is clouded out, the official statement neither confirms nor denies, the news report recycles the post, and the gauge reads normal. The pull toward a definite answer under time pressure is the thing to watch, not the answer itself.",
    );
  } else {
    paragraphs.push(
      "You did not reach a verdict inside the window. The defensible one was insufficient evidence — and reaching no conclusion is much closer to that than to a confident wrong call.",
    );
  }

  paragraphs.push(
    `You sorted ${r.correctSorts} of the ${EVIDENCE.length} cards the way the evidence supports. Three of them are designed to feel relevant and are not, which is the more useful lesson: most material in a live claim is noise wearing the clothes of evidence.`,
  );

  const signals: SignalSet = {
    scepticism: {
      value: clamp((r.correctSorts / EVIDENCE.length) * 60 + (r.spottedCircular ? 40 : 0) - r.falseCircular * 8),
      note: r.spottedCircular
        ? "You traced a claim back to its origin instead of counting repetitions."
        : "You assessed each card on its face; the sourcing chain between them went unexamined.",
    },
    calibration: {
      value: clamp(r.verdictDefensible ? 90 : r.verdict === "not-verified" ? 68 : r.verdict === null ? 55 : 24),
      note: r.verdictDefensible
        ? "You stopped at what the evidence actually supported."
        : "Your verdict claimed more or less certainty than the set could carry.",
    },
    speed: {
      value: clamp((Object.values(r.sorted).filter(Boolean).length / Math.max(r.elapsed, 8)) * 60 * 18, 12, 100),
      note: `You worked through ${Object.values(r.sorted).filter(Boolean).length} of ${EVIDENCE.length} cards in ${Math.round(r.elapsed)} seconds.`,
    },
  };

  return {
    missionId: "c",
    missionTitle: "Verify the claim",
    headline: "What the evidence actually supported",
    paragraphs,
    measures: [
      { label: "Sorting", value: `${r.correctSorts} / ${EVIDENCE.length}`, detail: "Cards placed as the evidence supports." },
      {
        label: "Circular sourcing",
        value: r.spottedCircular ? "Spotted" : "Missed",
        detail: "The highest-value observation in the set.",
        tone: r.spottedCircular ? "verified" : "signal",
      },
      {
        label: "Verdict",
        value: r.verdict === null ? "Not reached" : r.verdict === "insufficient" ? "Insufficient evidence" : r.verdict === "not-verified" ? "Not verified" : "Verified",
        detail: "The defensible verdict was insufficient evidence.",
        tone: r.verdictDefensible ? "verified" : "signal",
      },
    ],
    signals,
  };
}

export const SAMPLE_C = {
  sorted: { E1: "irrelevant", E2: "irrelevant", E3: "irrelevant", E4: "irrelevant", E5: "contradicts" } as Record<string, Bucket | null>,
  circularFlags: ["E4"],
  verdict: "insufficient" as Verdict,
};
