import type { Direction } from "@/state/journey";
import type { MissionDebrief, MissionId } from "./types";
import { debriefMissionA, SAMPLE_FLAGS_A, scoreMissionA } from "./sceneA";
import { debriefMissionB, SAMPLE_ALLOCATION_B, scoreMissionB } from "./convoyB";
import { debriefMissionC, SAMPLE_C, scoreMissionC } from "./claimC";

export type MissionMeta = {
  id: MissionId;
  code: string;
  title: string;
  strapline: string;
  brief: string;
  observes: string[];
};

export const MISSIONS: Record<MissionId, MissionMeta> = {
  a: {
    id: "a",
    code: "MISSION 01",
    title: "Infrastructure damage triage",
    strapline: "Read a processed aerial frame and say what you are sure of.",
    brief:
      "You are handed one frame of processed sensor imagery over a synthetic settlement. Somewhere in it, structures have been damaged. Flag what you believe is damaged and state how confident you are in each call. You have about ninety seconds, which is less than you want. Being unsure is a legitimate answer here and is recorded as such.",
    observes: ["Visual analysis", "Uncertainty calibration", "Decision speed under pressure"],
  },
  b: {
    id: "b",
    code: "MISSION 01",
    title: "Convoy prioritisation",
    strapline: "Two vehicles, twelve tonnes, six requests that all matter.",
    brief:
      "Six aid requests are open and you have two vehicles carrying six tonnes each. Everything on the board is legitimate and you cannot take all of it. Load the convoy. Conditions on the ground may change while you work, as they do. Read the cards carefully — nothing in this interface will tell you what to prioritise.",
    observes: ["Resource trade-off reasoning", "Adaptation to changed constraints", "Decision speed under pressure"],
  },
  c: {
    id: "c",
    code: "MISSION 01",
    title: "Verify the claim",
    strapline: "Five pieces of evidence. One claim. Say what you can actually stand behind.",
    brief:
      "A serious claim is circulating and five pieces of evidence have been collected. Sort each one by what it actually does to the claim, then give a verdict you would be willing to defend. Reaching no conclusion is a permitted and sometimes correct outcome.",
    observes: ["Source scepticism", "Uncertainty calibration", "Decision speed under pressure"],
  },
};

export function missionForDirection(direction: Direction): MissionId | "chooser" {
  if (direction === "build" || direction === "serve") return "a";
  if (direction === "support") return "b";
  return "chooser";
}

export function sampleDebrief(id: MissionId): MissionDebrief {
  if (id === "a") return debriefMissionA(scoreMissionA(SAMPLE_FLAGS_A, 71));
  if (id === "b")
    return debriefMissionB(
      scoreMissionB({
        alloc: SAMPLE_ALLOCATION_B,
        elapsed: 78,
        hadBlockedAtDisruption: true,
        replanSeconds: 14,
      }),
    );
  return debriefMissionC(scoreMissionC({ ...SAMPLE_C, elapsed: 74 }));
}

export * from "./types";
