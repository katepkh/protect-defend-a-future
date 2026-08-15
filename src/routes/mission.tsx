import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { MissionA } from "@/components/mission/MissionA";
import { MissionB } from "@/components/mission/MissionB";
import { MissionC } from "@/components/mission/MissionC";
import { SyntheticBanner } from "@/components/mission/frame";
import { MISSIONS, missionForDirection } from "@/lib/missions";
import type { MissionDebrief, MissionId } from "@/lib/missions/types";
import { useJourney } from "@/state/journey";

type Phase = "brief" | "active" | "debrief";

const isMission = (v: unknown): v is MissionId => v === "a" || v === "b" || v === "c";
const isPhase = (v: unknown): v is Phase => v === "brief" || v === "active" || v === "debrief";

export const Route = createFileRoute("/mission")({
  validateSearch: (search: Record<string, unknown>) => {
    const out: { m?: MissionId; phase?: Phase; sample?: "1"; demo?: "1" } = {};
    if (isMission(search["m"])) out.m = search["m"];
    if (isPhase(search["phase"])) out.phase = search["phase"];
    if (search["sample"] === "1") out.sample = "1";
    if (search["demo"] === "1") out.demo = "1";
    return out;
  },
  head: () => ({
    meta: [
      { title: "Try a mission — AZIMUTH" },
      {
        name: "description",
        content:
          "One short, entirely synthetic task. Not a test and not a game — a rehearsal that reads honest capability signals from how you actually work.",
      },
      { property: "og:title", content: "Try a mission — AZIMUTH" },
      {
        property: "og:description",
        content:
          "Damage triage, convoy prioritisation, or claim verification. Synthetic data, no score, no one else sees the result.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MissionPage,
});

function MissionChooser({ onPick }: { onPick: (id: MissionId) => void }) {
  return (
    <div className="mx-auto max-w-4xl">
      <SyntheticBanner />
      <p className="az-eyebrow mt-10">Mission 01 · Synthetic exercise</p>
      <h1 className="az-h2 mt-3 text-ivory">Choose a rehearsal</h1>
      <p className="az-body mt-6 text-muted-ink">
        You chose to explore, so nothing is preselected. Each of these takes about ninety seconds,
        uses entirely invented data, and produces only the signals it can honestly observe. You can
        try more than one, or none at all.
      </p>

      <ul className="mt-10 grid gap-px border border-line bg-line">
        {(Object.keys(MISSIONS) as MissionId[]).map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onPick(id)}
              className="group block w-full bg-panel p-6 text-left transition-colors hover:bg-panel-2"
            >
              <p className="az-eyebrow">Mission {id.toUpperCase()}</p>
              <p className="mt-2 font-display text-[1.3rem] font-semibold tracking-tight text-ivory">
                {MISSIONS[id].title}
              </p>
              <p className="mt-2 max-w-[62ch] text-[0.9rem] leading-relaxed text-muted-ink">
                {MISSIONS[id].strapline}
              </p>
              <p className="mt-3 text-[0.76rem] text-muted-ink/70">
                Observes: {MISSIONS[id].observes.join(" · ")}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissionPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { journey, update, hydrated } = useJourney();

  const suggested = missionForDirection(journey.direction);
  const [mission, setMission] = useState<MissionId | null>(search.m ?? null);
  const [phase, setPhase] = useState<Phase>(search.phase ?? "brief");

  useEffect(() => {
    if (search.m) setMission(search.m);
    if (search.phase) setPhase(search.phase);
  }, [search.m, search.phase]);

  useEffect(() => {
    if (!hydrated || mission || search.m) return;
    if (suggested !== "chooser") setMission(suggested);
  }, [hydrated, mission, search.m, suggested]);

  const switchTo = (id: MissionId) => {
    setMission(id);
    setPhase("brief");
    void navigate({
      to: "/mission",
      search: search.demo ? { m: id, demo: "1" as const } : { m: id },
    });
  };

  const onComplete = (d: MissionDebrief) => {
    update({
      missionCompleted: d.missionId,
      missionSignals: d.signals,
      missionResults: {
        mission: d.missionId,
        title: d.missionTitle,
        measures: d.measures,
      },
    });
  };

  const sample = search.sample === "1";
  const common = { phase, setPhase, onSwitch: switchTo, onComplete, sample };

  return (
    <main className="relative min-h-[calc(100vh-53px)] overflow-hidden px-6 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
        <Graticule />
      </div>
      <div className="relative">
        {!hydrated && !search.m ? (
          <div className="mx-auto h-40 max-w-3xl" aria-hidden />
        ) : mission === null ? (
          <MissionChooser onPick={switchTo} />
        ) : mission === "a" ? (
          <MissionA key={`a-${sample}`} {...common} />
        ) : mission === "b" ? (
          <MissionB key={`b-${sample}`} {...common} />
        ) : (
          <MissionC key={`c-${sample}`} {...common} />
        )}
      </div>
    </main>
  );
}
