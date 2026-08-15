import { useCallback, useState } from "react";
import { Debrief } from "./Debrief";
import { MissionBrief, MissionHeader, MissionSwitcher, SyntheticBanner, TimerBar } from "./frame";
import { useMissionTimer } from "./useMissionTimer";
import { MISSIONS } from "@/lib/missions";
import { MISSION_DURATION_SECONDS, type MissionDebrief, type MissionId } from "@/lib/missions/types";
import {
  CLAIM,
  debriefMissionC,
  EVIDENCE,
  SAMPLE_C,
  scoreMissionC,
  type Bucket,
  type Verdict,
} from "@/lib/missions/claimC";

const BUCKETS: { id: Bucket; label: string }[] = [
  { id: "supports", label: "Supports" },
  { id: "contradicts", label: "Contradicts" },
  { id: "irrelevant", label: "Not relevant" },
];

const VERDICTS: { id: Verdict; label: string; hint: string }[] = [
  { id: "verified", label: "Verified", hint: "The evidence establishes the claim." },
  { id: "not-verified", label: "Not verified", hint: "The evidence stands against the claim." },
  {
    id: "insufficient",
    label: "Insufficient evidence",
    hint: "The set cannot settle it either way.",
  },
];

const EMPTY_SORT: Record<string, Bucket | null> = Object.fromEntries(EVIDENCE.map((e) => [e.id, null]));

export function MissionC({
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
  const meta = MISSIONS.c;
  const [sorted, setSorted] = useState<Record<string, Bucket | null>>(
    sample ? { ...SAMPLE_C.sorted } : EMPTY_SORT,
  );
  const [circularFlags, setCircularFlags] = useState<string[]>(sample ? [...SAMPLE_C.circularFlags] : []);
  const [verdict, setVerdict] = useState<Verdict | null>(sample ? SAMPLE_C.verdict : null);
  const [debrief, setDebrief] = useState<MissionDebrief | null>(null);

  const finish = useCallback(
    (elapsed: number, expired: boolean) => {
      const d = debriefMissionC(scoreMissionC({ sorted, circularFlags, verdict, elapsed }));
      if (expired) {
        d.paragraphs = [
          "The window closed before you submitted. That is recorded as what it is — a task that ran out of time, not a wrong answer.",
          ...d.paragraphs,
        ];
      }
      setDebrief(d);
      onComplete(d);
      setPhase("debrief");
    },
    [sorted, circularFlags, verdict, onComplete, setPhase],
  );

  const elapsed = useMissionTimer(phase === "active", MISSION_DURATION_SECONDS, () =>
    finish(MISSION_DURATION_SECONDS, true),
  );

  const shownDebrief =
    debrief ??
    (phase === "debrief"
      ? debriefMissionC(
          scoreMissionC(
            sample
              ? { ...SAMPLE_C, elapsed: 74 }
              : { sorted, circularFlags, verdict, elapsed: Math.max(elapsed, 1) },
          ),
        )
      : null);

  if (phase === "brief") {
    return (
      <MissionBrief
        meta={meta}
        onBegin={() => setPhase("active")}
        switcher={<MissionSwitcher current="c" onSwitch={onSwitch} label="Or try a different mission" />}
      />
    );
  }

  if (phase === "debrief" && shownDebrief) {
    return (
      <Debrief
        debrief={shownDebrief}
        onSwitch={onSwitch}
        scene={
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {EVIDENCE.map((e) => (
              <div key={e.id} className="bg-panel p-4">
                <p className="az-eyebrow">
                  {e.id} · {e.kind}
                </p>
                <p className="mt-2 text-[0.85rem] text-ivory">{e.title}</p>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-ink">{e.answerNote}</p>
                <p className="mt-2 text-[0.76rem] text-muted-ink/70">
                  Defensible sort: {BUCKETS.find((b) => b.id === e.answer)?.label}
                  {e.circular ? " · circular sourcing" : ""}
                </p>
              </div>
            ))}
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
            Submit verdict
          </button>
        }
      />
      <div className="mt-5">
        <TimerBar elapsed={elapsed} duration={MISSION_DURATION_SECONDS} running={phase === "active"} />
      </div>
      <div className="mt-5">
        <SyntheticBanner />
      </div>

      <div className="mt-6 border border-line bg-panel p-5">
        <p className="az-eyebrow">The claim · {CLAIM.postedAgo}</p>
        <p className="mt-3 max-w-[62ch] font-display text-[1.15rem] leading-snug text-ivory">
          “{CLAIM.text}”
        </p>
        <p className="mt-3 max-w-[62ch] text-[0.8rem] leading-relaxed text-muted-ink">{CLAIM.note}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ul className="space-y-3">
          {EVIDENCE.map((e) => (
            <li key={e.id} className="border border-line bg-panel p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="az-eyebrow">
                  {e.id} · {e.kind}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setCircularFlags((p) => (p.includes(e.id) ? p.filter((x) => x !== e.id) : [...p, e.id]))
                  }
                  aria-pressed={circularFlags.includes(e.id)}
                  className={`flex items-center gap-2 border px-3 py-1.5 text-[0.72rem] font-medium transition-colors ${
                    circularFlags.includes(e.id)
                      ? "border-signal bg-signal/15 text-signal"
                      : "border-ivory/35 text-ivory/85 hover:border-ivory/70 hover:text-ivory"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`inline-block h-2.5 w-2.5 border ${
                      circularFlags.includes(e.id) ? "border-signal bg-signal" : "border-ivory/50"
                    }`}
                  />
                  {circularFlags.includes(e.id) ? "Marked: not independent" : "Mark as not independent"}
                </button>
              </div>
              <p className="mt-2 text-[0.95rem] text-ivory">{e.title}</p>
              <p className="mt-2 max-w-[62ch] text-[0.82rem] leading-relaxed text-muted-ink">{e.body}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {e.meta.map((m) => (
                  <li key={m} className="text-[0.74rem] text-muted-ink/70">
                    {m}
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {BUCKETS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() =>
                      setSorted((p) => ({ ...p, [e.id]: p[e.id] === b.id ? null : b.id }))
                    }
                    aria-pressed={sorted[e.id] === b.id}
                    className={`border px-2 py-2 text-[0.75rem] transition-colors ${
                      sorted[e.id] === b.id
                        ? "border-ivory/60 bg-ivory/5 text-ivory"
                        : "border-line text-muted-ink hover:border-ivory/40 hover:text-ivory"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <aside className="space-y-4" aria-label="Verdict">
          <div className="border border-line bg-panel p-5">
            <p className="az-eyebrow">Your verdict</p>
            <div className="mt-3 space-y-2">
              {VERDICTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVerdict(verdict === v.id ? null : v.id)}
                  aria-pressed={verdict === v.id}
                  className={`w-full border px-3 py-3 text-left transition-colors ${
                    verdict === v.id
                      ? "border-ivory/60 bg-ivory/5"
                      : "border-line hover:border-ivory/40"
                  }`}
                >
                  <span className="block text-[0.88rem] text-ivory">{v.label}</span>
                  <span className="mt-1 block text-[0.75rem] leading-relaxed text-muted-ink">
                    {v.hint}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 border-t border-line pt-3 text-[0.76rem] leading-relaxed text-muted-ink/80">
              Sorted {Object.values(sorted).filter(Boolean).length} of {EVIDENCE.length} cards. You
              may submit without sorting everything, and reaching no verdict is a permitted outcome.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
