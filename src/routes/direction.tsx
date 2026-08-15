import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { Reveal } from "@/components/journey/Reveal";
import { useJourney, type Direction } from "@/state/journey";

export const Route = createFileRoute("/direction")({
  head: () => ({
    meta: [
      { title: "Choose a direction — PROTECT" },
      {
        name: "description",
        content:
          "Serve, build, support, or explore. Choosing a direction is not a commitment — it only shapes the first task you try.",
      },
      { property: "og:title", content: "Choose a direction — PROTECT" },
      {
        property: "og:description",
        content: "Four honest starting points for contributing to Ukraine's defence.",
      },
    ],
  }),
  component: DirectionPage,
});

function ServeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden>
      <path d="M24 5 8 12v13c0 9 7 15.5 16 18 9-2.5 16-9 16-18V12L24 5Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M24 17v14M17 24h14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function BuildIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden>
      <rect x="7" y="17" width="34" height="20" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14 17V9h20v8M7 27h34M18 37v5M30 37v5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="1.2" />
      <path d="M24 15v18M15 24h18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function ExploreIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="1.2" />
      <path d="m30 18-4 12-8 0 4-12 8 0Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

const OPTIONS: {
  id: Exclude<Direction, null>;
  title: string;
  desc: string;
  note: string;
  icon: () => React.JSX.Element;
}[] = [
  {
    id: "serve",
    title: "Serve",
    desc: "Military service in Ukraine's forces.",
    note: "Most international units recruit light infantry. Language and eligibility constraints are real, and we will show them to you plainly.",
    icon: ServeIcon,
  },
  {
    id: "build",
    title: "Build",
    desc: "Defence technology, engineering, and analysis.",
    note: "Ukraine's defence-tech cluster spans thousands of companies. Some roles are remote.",
    icon: BuildIcon,
  },
  {
    id: "support",
    title: "Support",
    desc: "Humanitarian, medical, and civilian resilience.",
    note: "Often the largest need, and the pathway most people overlook.",
    icon: SupportIcon,
  },
  {
    id: "explore",
    title: "Explore",
    desc: "You are not sure yet.",
    note: "A completely legitimate answer. Start here and decide later.",
    icon: ExploreIcon,
  },
];

function DirectionPage() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const choose = (id: Exclude<Direction, null>) => {
    update({ direction: id });
    void navigate({ to: "/mission" });
  };

  return (
    <main className="relative overflow-hidden px-6 pb-28 pt-20">
      <div aria-hidden className="absolute inset-0 opacity-50">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">STEP 02 — DIRECTION</p>
          <h1 className="az-h2 mt-5 text-ivory">Where do you want to start?</h1>
          <p className="az-body mt-6 text-muted-ink">
            This is not a commitment. It only shapes the first task you will try — and you can change
            it at any point.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            const selected = journey.direction === opt.id;
            return (
              <Reveal key={opt.id} delay={i * 90}>
                <button
                  type="button"
                  onClick={() => choose(opt.id)}
                  aria-pressed={selected}
                  className={`group h-full w-full border bg-panel p-8 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-panel-2 md:p-10 ${
                    selected ? "border-accent-blue" : "border-line hover:border-accent-blue"
                  }`}
                >
                  <span className="block text-muted-ink transition-colors duration-300 group-hover:text-accent-blue">
                    <Icon />
                  </span>
                  <h2 className="mt-8 font-display text-2xl font-bold tracking-tight text-ivory">
                    {opt.title}
                  </h2>
                  <p className="mt-2 text-[1.0625rem] leading-relaxed text-ivory/85">{opt.desc}</p>
                  <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-muted-ink">{opt.note}</p>
                  <span className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-ink transition-colors duration-300 group-hover:text-accent-blue">
                    Start here <span aria-hidden>→</span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <section className="mt-6 border border-line bg-panel p-8 transition-colors duration-300 hover:border-accent-blue md:p-10">
            <h2 className="font-display text-xl font-bold tracking-tight text-ivory">
              I am not ready to choose.
            </h2>
            <p className="az-body mt-3 text-muted-ink">
              That is a normal place to be. We can simply show you how the pathways work, with no
              personal input and nothing stored about you.
            </p>
            <button
              type="button"
              onClick={() => {
                update({ direction: null });
                void navigate({ to: "/pathways" });
              }}
              className="mt-7 inline-flex items-center gap-3 border border-line px-6 py-3 text-sm font-semibold text-ivory transition-colors duration-300 hover:border-accent-blue hover:text-accent-blue"
            >
              Show me the pathways instead <span aria-hidden>→</span>
            </button>
          </section>
        </Reveal>
      </div>
    </main>
  );
}