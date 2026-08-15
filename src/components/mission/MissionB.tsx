import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Debrief } from "./Debrief";
import { MissionBrief, MissionHeader, MissionSwitcher, SyntheticBanner, TimerBar } from "./frame";
import { useMissionTimer } from "./useMissionTimer";
import { MISSIONS } from "@/lib/missions";
import { MISSION_DURATION_SECONDS, type MissionDebrief, type MissionId } from "@/lib/missions/types";
import {
  bestAchievable,
  blockedAssignments,
  CAPACITY_PER_VEHICLE,
  debriefMissionB,
  DISRUPTION_AT_SECONDS,
  EMPTY_ALLOCATION,
  loadFor,
  peopleServed,
  REQUESTS,
  SAMPLE_ALLOCATION_B,
  scoreMissionB,
  TOTAL_CAPACITY,
  type Allocation,
  type VehicleId,
} from "@/lib/missions/convoyB";

function VehicleMeter({ v, alloc, blocked }: { v: VehicleId; alloc: Allocation; blocked: string[] }) {
  const load = loadFor(alloc, v);
  const pct = Math.min(100, (load / CAPACITY_PER_VEHICLE) * 100);
  const over = load > CAPACITY_PER_VEHICLE + 1e-9;
  const items = REQUESTS.filter((r) => alloc[r.id] === v);
  return (
    <div className="border border-line bg-panel p-4">
      <div className="flex items-baseline justify-between">
        <p className="az-eyebrow">Vehicle {v}</p>
        <p className={`font-display text-[0.9rem] tabular-nums ${over ? "text-signal" : "text-ivory"}`}>
          {load.toFixed(1)} / {CAPACITY_PER_VEHICLE} t
        </p>
      </div>
      <div className="mt-3 h-[3px] w-full bg-line/60">
        <div
          className={`h-full transition-[width] duration-300 ${over ? "bg-signal/80" : "bg-accent-blue/70"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="mt-3 space-y-1">
        {items.length === 0 ? (
          <li className="text-[0.78rem] text-muted-ink/70">Empty.</li>
        ) : (
          items.map((r) => (
            <li
              key={r.id}
              className={`text-[0.78rem] ${blocked.includes(r.id) ? "text-signal line-through" : "text-muted-ink"}`}
            >
              {r.name} · {r.tonnes} t
            </li>
          ))
        )}
      </ul>
      {over ? (
        <p className="mt-3 text-[0.75rem] text-signal">Over capacity. This load cannot roll as planned.</p>
      ) : null}
    </div>
  );
}

export function MissionB({
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
  const meta = MISSIONS.b;
  const [alloc, setAlloc] = useState<Allocation>(sample ? SAMPLE_ALLOCATION_B : EMPTY_ALLOCATION);
  const [routeClosed, setRouteClosed] = useState(false);
  const [debrief, setDebrief] = useState<MissionDebrief | null>(null);
  const hadBlocked = useRef(false);
  const disruptedAt = useRef<number | null>(null);
  const replanSeconds = useRef<number | null>(null);

  const blocked = blockedAssignments(alloc, routeClosed);

  const finish = useCallback(
    (elapsed: number, expired: boolean) => {
      const r = scoreMissionB({
        alloc,
        elapsed,
        hadBlockedAtDisruption: hadBlocked.current,
        replanSeconds: replanSeconds.current,
      });
      const d = debriefMissionB(r);
      if (expired) {
        d.paragraphs = [
          "The window closed before you submitted. Nothing about that reads as failure here; the convoy simply rolled with whatever was loaded at the time, which is also how it happens.",
          ...d.paragraphs,
        ];
      }
      setDebrief(d);
      onComplete(d);
      setPhase("debrief");
    },
    [alloc, onComplete, setPhase],
  );

  const elapsed = useMissionTimer(phase === "active", MISSION_DURATION_SECONDS, () =>
    finish(MISSION_DURATION_SECONDS, true),
  );

  useEffect(() => {
    if (phase !== "active" || routeClosed) return;
    if (elapsed >= DISRUPTION_AT_SECONDS) {
      setRouteClosed(true);
      disruptedAt.current = elapsed;
      hadBlocked.current = REQUESTS.some((r) => r.usesRouteH11 && alloc[r.id] !== null);
    }
  }, [elapsed, phase, routeClosed, alloc]);

  useEffect(() => {
    if (!routeClosed || !hadBlocked.current || replanSeconds.current !== null) return;
    if (blockedAssignments(alloc, true).length === 0) {
      replanSeconds.current = Math.max(0, elapsed - (disruptedAt.current ?? 0));
    }
  }, [alloc, routeClosed, elapsed]);

  const assign = (id: string, v: VehicleId | null) =>
    setAlloc((prev) => ({ ...prev, [id]: prev[id] === v ? null : v }));

  const served = peopleServed(alloc, routeClosed);
  const ceiling = useMemo(() => bestAchievable(routeClosed), [routeClosed]);

  const shownDebrief =
    debrief ??
    (phase === "debrief"
      ? debriefMissionB(
          scoreMissionB({
            alloc: sample ? SAMPLE_ALLOCATION_B : alloc,
            elapsed: sample ? 78 : Math.max(elapsed, 1),
            hadBlockedAtDisruption: sample ? true : hadBlocked.current,
            replanSeconds: sample ? 14 : replanSeconds.current,
          }),
        )
      : null);

  if (phase === "brief") {
    return (
      <MissionBrief
        meta={meta}
        onBegin={() => setPhase("active")}
        switcher={<MissionSwitcher current="b" onSwitch={onSwitch} label="Or try a different mission" />}
      />
    );
  }

  if (phase === "debrief" && shownDebrief) {
    return <Debrief debrief={shownDebrief} onSwitch={onSwitch} />;
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
            Dispatch convoy
          </button>
        }
      />
      <div className="mt-5">
        <TimerBar elapsed={elapsed} duration={MISSION_DURATION_SECONDS} running={phase === "active"} />
      </div>
      <div className="mt-5">
        <SyntheticBanner />
      </div>

      {routeClosed ? (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 border border-signal/40 bg-signal/[0.07] px-4 py-3"
        >
          <span aria-hidden className="mt-[3px] block h-2 w-2 shrink-0 rotate-45 bg-signal/80" />
          <p className="text-[0.85rem] leading-relaxed text-signal/95">
            Route H-11 is now closed. Any allocation depending on it must be re-planned.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {REQUESTS.map((r) => {
            const isBlocked = routeClosed && r.usesRouteH11;
            const v = alloc[r.id];
            return (
              <li
                key={r.id}
                className={`border bg-panel p-4 transition-colors ${
                  isBlocked && v ? "border-signal/60" : v ? "border-accent-blue/50" : "border-line"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.95rem] text-ivory">{r.name}</p>
                    <p className="mt-1 text-[0.78rem] text-muted-ink">{r.destination}</p>
                  </div>
                  <p className="font-display text-[0.95rem] tabular-nums text-ivory">{r.tonnes} t</p>
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-2 border-y border-line/70 py-2 text-[0.72rem]">
                  <div>
                    <dt className="text-muted-ink/70">People</dt>
                    <dd className="text-ivory">{r.people.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-ink/70">Window</dt>
                    <dd className={r.expiresInHours ? "text-signal" : "text-ivory"}>
                      {r.urgencyHours} h
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-ink/70">Road risk</dt>
                    <dd className="text-ivory capitalize">{r.risk}</dd>
                  </div>
                </dl>

                <p className="mt-2 text-[0.78rem] leading-relaxed text-muted-ink">{r.detail}</p>
                {r.peopleNote ? (
                  <p className="mt-1 text-[0.74rem] text-muted-ink/70">{r.peopleNote}</p>
                ) : null}
                {r.expiresInHours ? (
                  <p className="mt-2 text-[0.78rem] text-signal/90">
                    Consignment expires in {r.expiresInHours} hours.
                  </p>
                ) : null}
                {isBlocked ? (
                  <p className="mt-2 text-[0.78rem] text-signal">
                    Depends on route H-11. Currently unreachable.
                  </p>
                ) : null}

                <div className="mt-3 flex gap-2">
                  {([1, 2] as VehicleId[]).map((vid) => (
                    <button
                      key={vid}
                      type="button"
                      onClick={() => assign(r.id, vid)}
                      aria-pressed={v === vid}
                      className={`flex-1 border px-2 py-2 text-[0.75rem] transition-colors ${
                        v === vid
                          ? "border-ivory/60 bg-ivory/5 text-ivory"
                          : "border-line text-muted-ink hover:border-ivory/40 hover:text-ivory"
                      }`}
                    >
                      Vehicle {vid}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAlloc((p) => ({ ...p, [r.id]: null }))}
                    disabled={!v}
                    className="border border-line px-3 py-2 text-[0.75rem] text-muted-ink transition-colors hover:border-ivory/40 hover:text-ivory disabled:opacity-40"
                  >
                    Unload
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="space-y-4" aria-label="Convoy state">
          <VehicleMeter v={1} alloc={alloc} blocked={blocked} />
          <VehicleMeter v={2} alloc={alloc} blocked={blocked} />
          <div className="border border-line bg-panel p-4">
            <p className="az-eyebrow">Currently reachable</p>
            <p className="mt-2 font-display text-[1.4rem] text-ivory">{served.toLocaleString()}</p>
            <p className="mt-1 text-[0.78rem] leading-relaxed text-muted-ink">
              people served by this plan. Best reachable right now is {ceiling.people.toLocaleString()}.
              Total capacity {TOTAL_CAPACITY} tonnes across two vehicles.
            </p>
          </div>
          <p className="text-[0.76rem] leading-relaxed text-muted-ink/80">
            Every request on this board is legitimate. Nothing here is a trick; the constraint is
            simply real.
          </p>
        </aside>
      </div>
    </div>
  );
}
