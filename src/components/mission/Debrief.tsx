import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MissionSwitcher } from "./frame";
import { SIGNAL_LABELS, SIGNAL_ORDER, type MissionDebrief, type MissionId } from "@/lib/missions/types";

function SignalRow({
  label,
  signal,
}: {
  label: string;
  signal: { value: number; note: string } | undefined;
}) {
  if (!signal) {
    return (
      <div className="grid gap-2 border-t border-line/70 py-4 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-8">
        <p className="text-[0.9rem] text-muted-ink/60">{label}</p>
        <div>
          <div className="h-[3px] w-full bg-line/40" aria-hidden />
          <p className="mt-2 text-[0.82rem] text-muted-ink/60">Not observed in this task.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-2 border-t border-line/70 py-4 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-8">
      <div className="flex items-baseline justify-between gap-4 md:block">
        <p className="text-[0.9rem] text-ivory">{label}</p>
        <p className="font-display text-[0.9rem] tabular-nums text-muted-ink md:mt-1">
          {signal.value} <span className="text-muted-ink/60">/ 100</span>
        </p>
      </div>
      <div>
        <div className="h-[3px] w-full bg-line/50">
          <div
            className="h-full bg-accent-blue/70 transition-[width] duration-700 ease-out"
            style={{ width: `${signal.value}%` }}
            role="img"
            aria-label={`${label}: ${signal.value} out of 100`}
          />
        </div>
        <p className="mt-2 max-w-[62ch] text-[0.85rem] leading-relaxed text-muted-ink">
          {signal.note}
        </p>
      </div>
    </div>
  );
}

export function Debrief({
  debrief,
  scene,
  onSwitch,
}: {
  debrief: MissionDebrief;
  scene?: ReactNode;
  onSwitch: (id: MissionId) => void;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="az-eyebrow">Debrief · {debrief.missionTitle}</p>
      <h2 className="az-h2 mt-3 text-ivory">{debrief.headline}</h2>

      {scene ? <div className="mt-8">{scene}</div> : null}

      <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
        {debrief.measures.map((m) => (
          <div key={m.label} className="bg-panel p-5">
            <p className="az-eyebrow">{m.label}</p>
            <p
              className={`mt-3 font-display text-[1.35rem] font-semibold leading-tight ${
                m.tone === "verified"
                  ? "text-verified"
                  : m.tone === "signal"
                    ? "text-signal"
                    : "text-ivory"
              }`}
            >
              {m.value}
            </p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-muted-ink">{m.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-5">
        {debrief.paragraphs.map((p) => (
          <p key={p.slice(0, 32)} className="az-body text-ivory/85">
            {p}
          </p>
        ))}
      </div>

      <section className="mt-14" aria-label="Capability signals">
        <p className="az-eyebrow">Signals from this task</p>
        <p className="mt-3 max-w-[62ch] text-[0.88rem] leading-relaxed text-muted-ink">
          These are signals from one short task, not an assessment of you. They shape what we
          suggest next. They do not qualify or disqualify you from anything, and no one else sees
          them.
        </p>
        <div className="mt-6 border-b border-line/70">
          {SIGNAL_ORDER.map((key) => (
            <SignalRow key={key} label={SIGNAL_LABELS[key]} signal={debrief.signals[key]} />
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link
          to="/guide"
          className="border border-accent-blue bg-accent-blue/10 px-8 py-3.5 text-sm font-semibold tracking-wide text-ivory transition-colors hover:bg-accent-blue/20"
        >
          Continue
        </Link>
        <span className="text-[0.82rem] text-muted-ink">Next: a short conversation with the guide.</span>
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <MissionSwitcher current={debrief.missionId} onSwitch={onSwitch} />
      </div>
    </div>
  );
}
