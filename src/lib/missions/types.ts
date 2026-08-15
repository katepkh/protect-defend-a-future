export type SignalKey =
  | "visual"
  | "calibration"
  | "speed"
  | "tradeoff"
  | "scepticism"
  | "adaptation";

export const SIGNAL_ORDER: SignalKey[] = [
  "visual",
  "calibration",
  "speed",
  "tradeoff",
  "scepticism",
  "adaptation",
];

export const SIGNAL_LABELS: Record<SignalKey, string> = {
  visual: "Visual analysis",
  calibration: "Uncertainty calibration",
  speed: "Decision speed under pressure",
  tradeoff: "Resource trade-off reasoning",
  scepticism: "Source scepticism",
  adaptation: "Adaptation to changed constraints",
};

/** A signal is only present when the task could legitimately observe it. */
export type Signal = { value: number; note: string };
export type SignalSet = Partial<Record<SignalKey, Signal>>;

export type Measure = {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "signal" | "verified";
};

export type MissionId = "a" | "b" | "c";

export type MissionDebrief = {
  missionId: MissionId;
  missionTitle: string;
  headline: string;
  paragraphs: string[];
  measures: Measure[];
  signals: SignalSet;
};

export const MISSION_DURATION_SECONDS = 90;

export const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));
