import { useCallback, useMemo, useState } from "react";
import { AerialScene } from "./AerialScene";
import { Debrief } from "./Debrief";
import { MissionBrief, MissionHeader, MissionSwitcher, SyntheticBanner, TimerBar } from "./frame";
import { useMissionTimer } from "./useMissionTimer";
import { MISSIONS } from "@/lib/missions";
import { MISSION_DURATION_SECONDS, type MissionDebrief, type MissionId } from "@/lib/missions/types";
import {
  debriefMissionA,
  SAMPLE_FLAGS_A,
  scoreMissionA,
  STRUCTURES,
  TRUE_DAMAGE_COUNT,
  type Confidence,
  type Flag,
} from "@/lib/missions/sceneA";

const CONFIDENCES: { id: Confidence; label: string; hint: string }[] = [
  { id: "certain", label: "Certain", hint: "I would send a crew on this." },
  { id: "likely", label: "Likely", hint: "I think so, but I would want a second frame." },
  { id: "uncertain", label: "Uncertain", hint: "Something is there. I cannot say what." },
];

const labelOf = (id: string) => STRUCTURES.find((s) => s.id === id)?.label ?? id;

export function MissionA({
  phase,
  setPhase,
  onSwitch,
  onComplete,
  sample,
}: {
  phase: "brief" | "active" | "debrief";
  setPhase: (p: "brief" | "active" | "debrief") => void;
  onSwitch: (id: MissionId) => void;
  onComplete: (d: MissionDebrief) => void;
  sample: boolean;
}) {
  const meta = MISSIONS.a;
  const [flags, setFlags] = useState<Flag[]>(sample ? SAMPLE_FLAGS_A : []);
  const [debrief, setDebrief] = useState<MissionDebrief | null>(null);
  const [result, setResult] = useState<ReturnType<typeof scoreMissionA> | null>(null);

  const finish = useCallback(
    (elapsed: number, expired: boolean) => {
      const r = scoreMissionA(flags, elapsed);
      const d = debriefMissionA(r);
      if (expired) {
        d.paragraphs = [
          "The window closed before you submitted. That is not a failure state — it is simply the point the frame was taken from you, and the debrief below reads only what you had reached by then.",
          ...d.paragraphs,
        ];
      }
      setResult(r);
      setDebrief(d);
      onComplete(d);
      setPhase("debrief");
    },
    [flags, onComplete, setPhase],
  );

  const elapsed = useMissionTimer(phase === "active", MISSION_DURATION_SECONDS, () =>
    finish(MISSION_DURATION_SECONDS, true),
  );

  const shownDebrief = useMemo(() => {
    if (debrief) return debrief;
    if (phase === "debrief") {
      const r = scoreMissionA(sample ? SAMPLE_FLAGS_A : flags, sample ? 71 : Math.max(elapsed, 1));
      return debriefMissionA(r);
    }
    return null;
  }, [debrief, phase, sample, flags, elapsed]);

  const shownResult = useMemo(
    () => result ?? (shownDebrief ? scoreMissionA(sample ? SAMPLE_FLAGS_A : flags, 71) : null),
    [result, shownDebrief, sample, flags],
  );

  const toggle = (id: string) =>
    setFlags((prev) =>
      prev.some((f) => f.id === id)
        ? prev.filter((f) => f.id !== id)
        : [...prev, { id, confidence: null }],
    );

  const setConfidence = (id: string, c: Confidence) =>
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, confidence: c } : f)));

  if (phase === "brief") {
    return (
      <MissionBrief
        meta={meta}
        onBegin={() => setPhase("active")}
        switcher={<MissionSwitcher current="a" onSwitch={onSwitch} label="Or try a different mission" />}
      />
    );
  }

  if (phase === "debrief" && shownDebrief && shownResult) {
    return (
      <Debrief
        debrief={shownDebrief}
        onSwitch={onSwitch}
        scene={
          <div>
            <AerialScene
              mode="reveal"
              flags={shownResult.flags}
              missed={shownResult.missed}
              falsePositives={shownResult.falsePositives}
              focusable={false}
            />
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] text-muted-ink">
              <span className="flex items-center gap-2">
                <span className="block h-2 w-4 border border-verified" aria-hidden /> True damage
              </span>
              <span className="flex items-center gap-2">
                <span className="block h-2 w-4 border border-signal" aria-hidden /> Damage you did not reach
              </span>
              <span className="flex items-center gap-2">
                <span className="block h-2 w-4 border border-dashed border-muted-ink" aria-hidden /> Flagged but intact
              </span>
              <span className="flex items-center gap-2">
                <span className="block h-2 w-4 border border-accent-blue" aria-hidden /> Your flags
              </span>
            </div>
            <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
              {STRUCTURES.filter((s) => s.truth !== "clean").map((s) => (
                <div key={s.id} className="bg-panel p-4">
                  <p className="text-[0.8rem] text-ivory">
                    {s.label}
                    <span className={`ml-2 ${s.truth === "damaged" ? "text-verified" : "text-signal"}`}>
                      {s.truth === "damaged" ? "damaged" : "ambiguous"}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-ink">{s.truthNote}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <MissionHeader
        meta={meta}
        right={
          <button
            type="button"
            onClick={() => finish(elapsed, false)}
            className="border border-accent-blue bg-accent-blue/10 px-6 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-accent-blue/20"
          >
            Submit assessment
          </button>
        }
      />
      <div className="mt-5">
        <TimerBar elapsed={elapsed} duration={MISSION_DURATION_SECONDS} running={phase === "active"} />
      </div>
      <div className="mt-5">
        <SyntheticBanner />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <AerialScene mode="active" flags={flags} onToggle={toggle} />
          <p className="mt-3 text-[0.82rem] text-muted-ink">
            Select any structure you believe is damaged, then set how confident you are. Select it
            again to remove the flag. Keyboard: tab to a structure, press Enter.
          </p>
        </div>

        <aside className="border border-line bg-panel p-5" aria-label="Your flags">
          <p className="az-eyebrow">Flagged structures</p>
          <p className="mt-2 text-[0.8rem] text-muted-ink">
            {flags.length === 0
              ? "Nothing flagged yet. Submitting an empty assessment is permitted."
              : `${flags.length} flagged. Confidence is part of the assessment, not an afterthought.`}
          </p>

          <ul className="mt-4 space-y-3">
            {flags.map((f, i) => (
              <li key={f.id} className="border border-line bg-panel-2/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[0.85rem] text-ivory">
                    <span className="mr-2 font-display text-accent-blue">{i + 1}</span>
                    {labelOf(f.id)}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggle(f.id)}
                    className="text-[0.75rem] text-muted-ink transition-colors hover:text-ivory"
                    aria-label={`Remove flag on ${labelOf(f.id)}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {CONFIDENCES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      title={c.hint}
                      onClick={() => setConfidence(f.id, c.id)}
                      aria-pressed={f.confidence === c.id}
                      className={`border px-1.5 py-1.5 text-[0.7rem] transition-colors ${
                        f.confidence === c.id
                          ? "border-ivory/60 bg-ivory/5 text-ivory"
                          : "border-line text-muted-ink hover:border-ivory/40 hover:text-ivory"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                {f.confidence === null ? (
                  <p className="mt-2 text-[0.72rem] text-muted-ink/80">
                    No confidence set — this will be recorded as uncertain.
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-line pt-4 text-[0.76rem] leading-relaxed text-muted-ink/80">
            There are {TRUE_DAMAGE_COUNT} genuinely damaged structures in this frame and two that
            are deliberately ambiguous. You are not told which, and you are not expected to reach
            all of them.
          </p>
        </aside>
      </div>
    </div>
  );
}
