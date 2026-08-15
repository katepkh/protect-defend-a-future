import { createFileRoute } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { Reveal } from "@/components/journey/Reveal";

export const Route = createFileRoute("/ethics")({
  head: () => ({
    meta: [
      { title: "Data and ethics — PROTECT" },
      {
        name: "description",
        content:
          "How PROTECT handles your data: everything stays in your browser. No accounts, no tracking, no transfer of military applications to private companies.",
      },
      { property: "og:title", content: "Data and ethics — PROTECT" },
      {
        property: "og:description",
        content: "Everything stays in your browser. No accounts, no tracking, no scoring.",
      },
    ],
  }),
  component: EthicsPage,
});

const PRINCIPLES = [
  {
    h: "Your data never leaves this device.",
    p: "The journey is stored in your browser's local storage under a single key. There is no account, no server, and no analytics profile.",
  },
  {
    h: "You are never scored.",
    p: "There is no ranking, no suitability percentage, and no hidden verdict. Everything we infer is shown back to you in plain language and can be rejected.",
  },
  {
    h: "Military and commercial pathways are kept apart.",
    p: "An interest in service is never passed to a private company, and a commercial pathway never quietly becomes a recruitment funnel.",
  },
  {
    h: "Verification is done by humans, elsewhere.",
    p: "We do not run background checks. Authorised organisations verify people through their own official processes.",
  },
];

function EthicsPage() {
  return (
    <main className="relative overflow-hidden px-6 pb-28 pt-20">
      <div aria-hidden className="absolute inset-0 opacity-50">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">DATA AND ETHICS</p>
          <h1 className="az-h2 mt-5 text-ivory">What we do with what you tell us.</h1>
          <p className="az-body mt-6 text-muted-ink">
            Almost nothing. That is deliberate, and it is the whole design.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-2">
          {PRINCIPLES.map((item, i) => (
            <Reveal key={item.h} delay={i * 80}>
              <div className="h-full bg-panel p-8 md:p-10">
                <h2 className="font-display text-lg font-bold tracking-tight text-ivory">{item.h}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-ink">{item.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <p className="mt-10 max-w-[62ch] border-l-2 border-signal/60 pl-5 text-sm leading-relaxed text-muted-ink">
            PROTECT is a demonstration prototype. It is not affiliated with any government or armed
            force, and nothing here constitutes legal advice.
          </p>
        </Reveal>
      </div>
    </main>
  );
}