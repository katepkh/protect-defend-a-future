import { clamp, type MissionDebrief, type SignalSet } from "./types";

export type Risk = "low" | "medium" | "high";
export type VehicleId = 1 | 2;

export type AidRequest = {
  id: string;
  name: string;
  destination: string;
  people: number;
  peopleNote?: string;
  urgencyHours: number;
  risk: Risk;
  tonnes: number;
  detail: string;
  /** Perishable window in hours — the hard constraint the user must notice. */
  expiresInHours?: number;
  /** Depends on route H-11, which closes mid-exercise. */
  usesRouteH11: boolean;
};

export const CAPACITY_PER_VEHICLE = 6;
export const TOTAL_CAPACITY = 12;
export const DISRUPTION_AT_SECONDS = 35;

export const REQUESTS: AidRequest[] = [
  {
    id: "R1",
    name: "Hospital generator set",
    destination: "District hospital, Sorokyne",
    people: 1200,
    urgencyHours: 10,
    risk: "medium",
    tonnes: 4.2,
    detail: "Mains supply intermittent for nine days. Theatre and neonatal load only.",
    usesRouteH11: false,
  },
  {
    id: "R2",
    name: "Water pump station parts",
    destination: "Pump house 2, Verkhne",
    people: 3400,
    urgencyHours: 18,
    risk: "low",
    tonnes: 3.1,
    detail: "Restores piped water to four residential blocks. Currently tankered.",
    usesRouteH11: true,
  },
  {
    id: "R3",
    name: "Family food parcels",
    destination: "Community point, Bilokamin",
    people: 850,
    urgencyHours: 24,
    risk: "low",
    tonnes: 2.4,
    detail: "Two-week rations. Last delivery eleven days ago.",
    usesRouteH11: false,
  },
  {
    id: "R4",
    name: "School shelter heating",
    destination: "School 7 basement shelter",
    people: 420,
    urgencyHours: 36,
    risk: "medium",
    tonnes: 3.6,
    detail: "Shelter in nightly use. Currently 9°C at night.",
    usesRouteH11: true,
  },
  {
    id: "R5",
    name: "Livestock feed",
    destination: "Farm cooperative, Nyzhnia",
    people: 260,
    peopleNote: "household livelihoods, not immediate survival",
    urgencyHours: 48,
    risk: "low",
    tonnes: 2.8,
    detail: "Feed stocks exhausted. Loss of herd ends sixty households' income.",
    usesRouteH11: false,
  },
  {
    id: "R6",
    name: "Mobile clinic cold-chain consignment",
    destination: "Mobile clinic rendezvous, Sorokyne",
    people: 2100,
    urgencyHours: 6,
    risk: "high",
    tonnes: 1.5,
    detail: "Temperature-controlled consignment. Unusable once the cold chain lapses.",
    expiresInHours: 6,
    usesRouteH11: false,
  },
];

export type Allocation = Record<string, VehicleId | null>;

export const EMPTY_ALLOCATION: Allocation = Object.fromEntries(
  REQUESTS.map((r) => [r.id, null]),
) as Allocation;

export const COLD_CHAIN_ID = "R6";

export function loadFor(alloc: Allocation, v: VehicleId) {
  return REQUESTS.filter((r) => alloc[r.id] === v).reduce((s, r) => s + r.tonnes, 0);
}

export function peopleServed(alloc: Allocation, routeClosed: boolean) {
  return REQUESTS.filter(
    (r) => alloc[r.id] !== null && !(routeClosed && r.usesRouteH11),
  ).reduce((s, r) => s + r.people, 0);
}

export function blockedAssignments(alloc: Allocation, routeClosed: boolean) {
  if (!routeClosed) return [];
  return REQUESTS.filter((r) => r.usesRouteH11 && alloc[r.id] !== null).map((r) => r.id);
}

/** Exhaustive search over every allocation. Honest ceiling, not a magic number. */
export function bestAchievable(routeClosed: boolean) {
  let best = { people: 0, coldChain: false, ids: [] as string[] };
  const n = REQUESTS.length;
  for (let mask = 0; mask < 3 ** n; mask++) {
    let m = mask;
    const loads = [0, 0];
    let people = 0;
    let coldChain = false;
    const ids: string[] = [];
    let valid = true;
    for (let i = 0; i < n; i++) {
      const slot = m % 3;
      m = Math.floor(m / 3);
      if (slot === 0) continue;
      const r = REQUESTS[i]!;
      if (routeClosed && r.usesRouteH11) {
        valid = false;
        break;
      }
      loads[slot - 1]! += r.tonnes;
      if (loads[slot - 1]! > CAPACITY_PER_VEHICLE + 1e-9) {
        valid = false;
        break;
      }
      people += r.people;
      ids.push(r.id);
      if (r.id === COLD_CHAIN_ID) coldChain = true;
    }
    if (!valid) continue;
    const score = people + (coldChain ? 100000 : 0);
    const bestScore = best.people + (best.coldChain ? 100000 : 0);
    if (score > bestScore) best = { people, coldChain, ids };
  }
  return best;
}

export type MissionBResult = {
  alloc: Allocation;
  elapsed: number;
  served: number;
  achievable: number;
  coldChainProtected: boolean;
  coldChainAchievable: boolean;
  blockedLeftAssigned: string[];
  hadBlockedAtDisruption: boolean;
  replanSeconds: number | null;
  overweight: boolean;
};

export function scoreMissionB(input: {
  alloc: Allocation;
  elapsed: number;
  hadBlockedAtDisruption: boolean;
  replanSeconds: number | null;
}): MissionBResult {
  const best = bestAchievable(true);
  return {
    alloc: input.alloc,
    elapsed: input.elapsed,
    served: peopleServed(input.alloc, true),
    achievable: best.people,
    coldChainProtected:
      input.alloc[COLD_CHAIN_ID] !== null &&
      !REQUESTS.find((r) => r.id === COLD_CHAIN_ID)!.usesRouteH11,
    coldChainAchievable: best.coldChain,
    blockedLeftAssigned: blockedAssignments(input.alloc, true),
    hadBlockedAtDisruption: input.hadBlockedAtDisruption,
    replanSeconds: input.replanSeconds,
    overweight: loadFor(input.alloc, 1) > CAPACITY_PER_VEHICLE || loadFor(input.alloc, 2) > CAPACITY_PER_VEHICLE,
  };
}

export function debriefMissionB(r: MissionBResult): MissionDebrief {
  const ratio = r.achievable > 0 ? r.served / r.achievable : 0;
  const paragraphs: string[] = [];

  paragraphs.push(
    `Your final plan reached ${r.served.toLocaleString()} people. The best reachable total after route H-11 closed was ${r.achievable.toLocaleString()}. That gap is not a mark against you; two vehicles and twelve tonnes cannot cover six requests, and that is the point of the exercise.`,
  );

  if (r.coldChainProtected) {
    paragraphs.push(
      "You protected the cold-chain consignment. It had a six-hour window and 1.5 tonnes of it — small, easy to deprioritise, and worthless an hour late. Noticing that without being told is the specific habit this task looks for.",
    );
  } else {
    paragraphs.push(
      "The cold-chain consignment did not go out. It was the smallest item on the board at 1.5 tonnes, with a six-hour expiry stated in its card. Nothing flagged it for you, which is exactly how it is lost in practice. This is a reading problem, not a judgement problem, and it is the easiest of these to fix.",
    );
  }

  if (!r.hadBlockedAtDisruption) {
    paragraphs.push(
      "The route closure did not touch your plan, so you were not tested on re-planning here. That may be foresight or it may be sequence; one exercise cannot tell the difference.",
    );
  } else if (r.blockedLeftAssigned.length === 0) {
    paragraphs.push(
      `The closure invalidated part of your plan and you rebuilt it${r.replanSeconds !== null ? ` in about ${Math.round(r.replanSeconds)} seconds` : ""}, without unwinding the allocations that were still sound. Holding what still works is harder than starting over.`,
    );
  } else {
    paragraphs.push(
      `You left ${r.blockedLeftAssigned.length} allocation${r.blockedLeftAssigned.length === 1 ? "" : "s"} on the closed route. Those loads do not arrive, so the people behind them were counted in your plan but not served by it. Under time pressure this is ordinary; it is also why convoys are read back before they roll.`,
    );
  }

  paragraphs.push(
    "There is no clean answer here. Every allocation you made meant someone else waited. Logistics officers make this call several times a day and then live with it.",
  );

  const signals: SignalSet = {
    tradeoff: {
      value: clamp(ratio * 100),
      note: `You reached ${Math.round(ratio * 100)}% of the achievable coverage under a hard weight ceiling.`,
    },
    adaptation: {
      value: r.hadBlockedAtDisruption
        ? clamp(r.blockedLeftAssigned.length === 0 ? 92 - Math.min((r.replanSeconds ?? 0) * 1.2, 30) : 34)
        : clamp(62),
      note: r.hadBlockedAtDisruption
        ? r.blockedLeftAssigned.length === 0
          ? "You re-planned around a mid-task constraint change and kept the sound parts of the plan."
          : "Part of the plan still depended on a route that had closed."
        : "The disruption did not intersect your plan, so this reading is weak.",
    },
    speed: {
      value: clamp((Object.values(r.alloc).filter(Boolean).length / Math.max(r.elapsed, 8)) * 60 * 22, 12, 100),
      note: `You committed ${Object.values(r.alloc).filter(Boolean).length} allocations in ${Math.round(r.elapsed)} seconds while the board kept changing.`,
    },
  };

  return {
    missionId: "b",
    missionTitle: "Convoy prioritisation",
    headline: "What your convoy actually carried",
    paragraphs,
    measures: [
      { label: "People served", value: `${r.served.toLocaleString()} of ${r.achievable.toLocaleString()} reachable`, detail: "Counted only where the route was open." },
      {
        label: "Cold chain",
        value: r.coldChainProtected ? "Protected" : "Lost",
        detail: "The six-hour consignment. Nothing in the interface pointed at it.",
        tone: r.coldChainProtected ? "verified" : "signal",
      },
      {
        label: "Re-plan",
        value: r.hadBlockedAtDisruption ? (r.blockedLeftAssigned.length === 0 ? "Clean" : "Incomplete") : "Not tested",
        detail: "How the plan absorbed the route closure.",
      },
    ],
    signals,
  };
}

export const SAMPLE_ALLOCATION_B: Allocation = {
  R1: 1,
  R2: null,
  R3: 2,
  R4: null,
  R5: null,
  R6: 1,
} as Allocation;
