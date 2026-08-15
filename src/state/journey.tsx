import type { MissionId, SignalSet } from "@/lib/missions/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Direction = "serve" | "build" | "support" | "explore" | null;

export type JourneyState = {
  direction: Direction;
  missionResults: Record<string, unknown> | null;
  missionCompleted: MissionId | null;
  missionSignals: SignalSet;
  guideAnswers: Record<string, string>;
  capabilitySignals: string[];
  selectedPathway: string | null;
  acknowledgedReality: boolean;
  /** ISO timestamp of the moment the reality gate was ticked. */
  acknowledgedRealityAt: string | null;
  plan: { title: string; steps: string[] } | null;
  checkIn: { simulatedDaysLater: number } | null;
};

export const EMPTY_JOURNEY: JourneyState = {
  direction: null,
  missionResults: null,
  missionCompleted: null,
  missionSignals: {},
  guideAnswers: {},
  capabilitySignals: [],
  selectedPathway: null,
  acknowledgedReality: false,
  acknowledgedRealityAt: null,
  plan: null,
  checkIn: null,
};

export const SAMPLE_JOURNEY: JourneyState = {
  direction: "build",
  missionResults: {
    task: "Triage three logistics reports for a resupply window",
    accuracy: 0.82,
    minutes: 6,
  },
  missionCompleted: "a",
  missionSignals: {
    visual: { value: 83, note: "You identified 5 of 6 genuine damage indicators in a low-contrast synthetic frame." },
    calibration: { value: 88, note: "Your stated confidence matched what the ground truth supported." },
    speed: { value: 68, note: "You made 8 judgements in 71 seconds without the option to defer." },
  },
  guideAnswers: {
    capability: "c-engineering",
    time: "t-part",
    reloc: "r-none",
    lang: "l-en",
    risk: "k-low",
    blocker: "b-family",
  },
  capabilitySignals: ["embedded engineering", "structured analysis", "remote-ready", "EU mobility"],
  selectedPathway: "defence-technology-remote",
  acknowledgedReality: true,
  acknowledgedRealityAt: null,
  plan: {
    title: "Remote defence-technology contribution",
    steps: [
      "Read the verified organisation registry entries for three UAV firms",
      "Prepare a one-page capability summary",
      "Submit through the official application channel",
    ],
  },
  checkIn: null,
};

const KEY = "protect.journey.v1";
/** Pre-rename key. Read once, rewritten under the new key, then left alone. */
const LEGACY_KEY = "azimuth.journey.v1";

type Ctx = {
  journey: JourneyState;
  update: (patch: Partial<JourneyState>) => void;
  loadSample: () => void;
  simulateLater: () => void;
  reset: () => void;
  hydrated: boolean;
};

const JourneyContext = createContext<Ctx | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journey, setJourney] = useState<JourneyState>(EMPTY_JOURNEY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      let raw = localStorage.getItem(KEY);
      if (!raw) {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          localStorage.setItem(KEY, legacy);
          localStorage.removeItem(LEGACY_KEY);
          raw = legacy;
        }
      }
      if (raw) setJourney({ ...EMPTY_JOURNEY, ...(JSON.parse(raw) as JourneyState) });
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(journey));
    } catch {
      /* storage unavailable */
    }
  }, [journey, hydrated]);

  const update = useCallback((patch: Partial<JourneyState>) => {
    setJourney((prev) => ({ ...prev, ...patch }));
  }, []);

  const loadSample = useCallback(() => setJourney(SAMPLE_JOURNEY), []);
  const simulateLater = useCallback(
    () => setJourney((prev) => ({ ...prev, checkIn: { simulatedDaysLater: 14 } })),
    [],
  );
  const reset = useCallback(() => setJourney(EMPTY_JOURNEY), []);

  const value = useMemo(
    () => ({ journey, update, loadSample, simulateLater, reset, hydrated }),
    [journey, update, loadSample, simulateLater, reset, hydrated],
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used inside JourneyProvider");
  return ctx;
}