import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ALL_ROUTES } from "@/lib/steps";
import { useJourney } from "@/state/journey";

export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const taps = useRef<number[]>([]);
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const { loadSample, simulateLater, reset, journey } = useJourney();

  useEffect(() => {
    if (search.includes("demo=1")) setOpen(true);
  }, [search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (e.key.toLowerCase() !== "d") return;
      const now = Date.now();
      taps.current = [...taps.current, now].filter((t) => now - t < 1200);
      if (taps.current.length >= 3) {
        taps.current = [];
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <aside
      aria-label="Demo controls"
      className="fixed bottom-5 right-5 z-[60] w-72 border border-line bg-panel/95 p-4 text-xs shadow-2xl backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <p className="az-eyebrow">Demo control</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-ink transition-colors hover:text-ivory"
          aria-label="Close demo panel"
        >
          ✕
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1">
        {ALL_ROUTES.map((r) => (
          <button
            key={r.path}
            type="button"
            onClick={() => void navigate({ to: r.path as "/" })}
            className="truncate border border-line px-2 py-1.5 text-left text-[0.7rem] text-muted-ink transition-colors hover:border-accent-blue hover:text-ivory"
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-1">
        <button
          type="button"
          onClick={loadSample}
          className="w-full border border-line px-2 py-1.5 text-left text-[0.7rem] text-ivory transition-colors hover:border-accent-blue"
        >
          Load sample journey
        </button>
        <button
          type="button"
          onClick={simulateLater}
          className="w-full border border-line px-2 py-1.5 text-left text-[0.7rem] text-ivory transition-colors hover:border-accent-blue"
        >
          Simulate 14 days later
        </button>
        <button
          type="button"
          onClick={reset}
          className="w-full border border-line px-2 py-1.5 text-left text-[0.7rem] text-signal transition-colors hover:border-signal"
        >
          Reset
        </button>
      </div>
      <p className="mt-3 text-[0.65rem] leading-relaxed text-muted-ink">
        direction: {journey.direction ?? "—"} · pathway: {journey.selectedPathway ?? "—"} ·{" "}
        {journey.checkIn ? "+14 days" : "day 0"}
      </p>
    </aside>
  );
}