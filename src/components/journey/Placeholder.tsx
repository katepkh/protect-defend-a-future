import { Link } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";

export function Placeholder({
  step,
  title,
  intro,
  next,
}: {
  step: string;
  title: string;
  intro: string;
  next?: { label: string; to: string };
}) {
  return (
    <main className="relative min-h-[calc(100vh-53px)] overflow-hidden px-6 py-24">
      <div aria-hidden className="absolute inset-0 opacity-60">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <p className="az-eyebrow">STEP {step}</p>
        <h1 className="az-h2 mt-5 text-ivory">{title}</h1>
        <p className="az-body mt-6 text-muted-ink">{intro}</p>
        <div className="mt-12 max-w-xl border border-line bg-panel p-8">
          <p className="az-eyebrow">Coming next</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-ink">
            This step is scaffolded and part of the journey, but its experience is not built yet in
            this pass. The route, the state, and the navigation all work.
          </p>
          {next ? (
            <Link
              to={next.to}
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-accent-blue transition-opacity hover:opacity-80"
            >
              {next.label}
              <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}