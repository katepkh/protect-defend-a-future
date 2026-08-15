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
  guideAnswers: Record<string, string>;
  capabilitySignals: string[];
  selectedPathway: string | null;
  acknowledgedReality: boolean;
  plan: { title: string; steps: string[] } | null;
  checkIn: { simulatedDaysLater: number } | null;
};

export const EMPTY_JOURNEY: JourneyState = {
  direction: null,
  missionResults: null,
  guideAnswers: {},
  capabilitySignals: [],
  selectedPathway: null,
  acknowledgedReality: false,
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
  guideAnswers: {
    motivation: "I have eight years in embedded systems and want it to matter.",
    availability: "Remote, evenings and weekends, open to a 3-month placement.",
    constraints: "No Ukrainian language. EU passport. Family in Berlin.",
  },
  capabilitySignals: ["embedded engineering", "structured analysis", "remote-ready", "EU mobility"],
  selectedPathway: "defence-technology-remote",
  acknowledgedReality: true,
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

const KEY = "azimuth.journey.v1";

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
      const raw = localStorage.getItem(KEY);
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