import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { MissionMeta } from "@/lib/missions";
import type { MissionId } from "@/lib/missions/types";

export function SyntheticBanner() {
  return (
    <div className="flex items-start gap-3 border border-signal/30 bg-signal/[0.06] px-4 py-3">
      <span aria-hidden className="mt-[3px] block h-2 w-2 shrink-0 rotate-45 bg-signal/70" />
      <p className="text-[0.82rem] leading-relaxed text-signal/90">
        Synthetic data. Generated for this exercise. Not a real location, not a real incident, not
        operational.
      </p>
    </div>
  );
}

export function TimerBar({
  elapsed,
  duration,
  running,
}: {
  elapsed: number;
  duration: number;
  running: boolean;
}) {
  const pct = Math.min(100, (elapsed / duration) * 100);
  const remaining = duration - elapsed;
  const closing = remaining <= 15;
  return (
    <div
      className="h-[3px] w-full bg-line/60"
      role="progressbar"
      aria-label="Time used in this exercise"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className={`h-full transition-[width,background-color] duration-200 ease-linear ${
          closing ? "bg-signal/80" : "bg-muted-ink/70"
        }`}
        style={{ width: `${running || pct > 0 ? pct : 0}%` }}
      />
    </div>
  );
}

export function MissionHeader({
  meta,
  right,
}: {
  meta: MissionMeta;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="az-eyebrow">{meta.code} · SYNTHETIC EXERCISE</p>
        <h1 className="az-h2 mt-3 text-ivory">{meta.title}</h1>
      </div>
      {right}
    </div>
  );
}

export function MissionBrief({
  meta,
  onBegin,
  switcher,
}: {
  meta: MissionMeta;
  onBegin: () => void;
  switcher?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <SyntheticBanner />
      <p className="az-eyebrow mt-10">{meta.code} · SYNTHETIC EXERCISE</p>
      <h1 className="az-h2 mt-3 text-ivory">{meta.title}</h1>
      <p className="mt-3 text-[0.95rem] text-muted-ink">{meta.strapline}</p>
      <p className="az-body mt-8 text-muted-ink">{meta.brief}</p>

      <div className="mt-8 border-l border-line pl-5">
        <p className="az-eyebrow">What this task can observe</p>
        <ul className="mt-3 space-y-1.5">
          {meta.observes.map((o) => (
            <li key={o} className="text-[0.9rem] text-muted-ink">
              {o}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[52ch] text-[0.82rem] leading-relaxed text-muted-ink/80">
          Nothing else is inferred, nothing is stored anywhere but this browser, and no one else
          sees it.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={onBegin}
          className="border border-accent-blue bg-accent-blue/10 px-8 py-3.5 text-sm font-semibold tracking-wide text-ivory transition-colors hover:bg-accent-blue/20"
        >
          Begin
        </button>
        <Link
          to="/guide"
          className="border border-line px-8 py-3.5 text-sm font-semibold tracking-wide text-ivory transition-colors hover:border-ivory/50"
        >
          Skip the task and just talk to the guide
        </Link>
      </div>
      <p className="mt-4 text-[0.8rem] text-muted-ink/80">
        Both routes are equally valid. Skipping loses nothing except one set of signals.
      </p>

      {switcher ? <div className="mt-12 border-t border-line pt-6">{switcher}</div> : null}
    </div>
  );
}

const SWITCH_LABELS: Record<MissionId, string> = {
  a: "Infrastructure damage triage",
  b: "Convoy prioritisation",
  c: "Verify the claim",
};

export function MissionSwitcher({
  current,
  onSwitch,
  label = "Try a different mission",
}: {
  current: MissionId;
  onSwitch: (id: MissionId) => void;
  label?: string;
}) {
  return (
    <div>
      <p className="az-eyebrow">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(SWITCH_LABELS) as MissionId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onSwitch(id)}
            aria-current={id === current ? "true" : undefined}
            className={`border px-4 py-2 text-[0.82rem] transition-colors ${
              id === current
                ? "border-ivory/40 text-ivory"
                : "border-line text-muted-ink hover:border-ivory/40 hover:text-ivory"
            }`}
          >
            {SWITCH_LABELS[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
