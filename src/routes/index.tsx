import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroBackdrop } from "@/components/atmosphere/HeroBackdrop";
import { Reveal } from "@/components/journey/Reveal";
import { STEPS } from "@/lib/steps";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOPROTECT — There is more than one way to defend democracy." },
      {
        name: "description",
        content:
          "Try the work, understand what it really costs, and find the pathway that genuinely fits you. A gateway for international supporters of Ukraine.",
      },
      { property: "og:title", content: "TOPROTECT — There is more than one way to defend democracy." },
      {
        property: "og:description",
        content:
          "Try the work, understand what it really costs, and find the pathway that genuinely fits you.",
      },
    ],
  }),
  component: Index,
});

const PROBLEM = [
  {
    h: "You want to help.",
    p: "Engineers, medics, analysts, logisticians, translators, pilots, welders. The need is enormous and specific.",
  },
  {
    h: "You cannot tell what is real.",
    p: "Dozens of channels, unclear legitimacy, contradictory information, and no way to know which opportunities are verified.",
  },
  {
    h: "So nothing happens.",
    p: "Most people close the tab. Intent that never becomes action helps no one.",
  },
];

const REFUSALS = [
  "We will not tell you that serving is the right choice for you. That is yours to decide.",
  "We will not hide the risk, the language requirements, or the legal consequences.",
  "We will not perform background checks. Verification is done by the authorised organisation, by a human.",
  "We will not pass your military application to a private company. Those pathways are kept separate.",
];

function Index() {
  return (
    <main>
      <section className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6">
        <HeroBackdrop />
        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-14 pb-24 pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          <div>
          <Reveal>
            <p className="az-eyebrow">INTERNATIONAL CONTRIBUTION TO UKRAINE&rsquo;S DEFENCE</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="az-hero mt-7 max-w-[18ch] text-ivory">
              There is more than one way to defend democracy.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-[1.65] text-muted-ink">
              Thousands of people outside Ukraine want to help and do not know where they are
              actually useful. TOPROTECT lets you try the work, understand what it really costs, and
              find the pathway that genuinely fits you.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Link
                to="/direction"
                className="inline-flex items-center gap-4 bg-accent-blue px-8 py-4 text-sm font-semibold tracking-wide text-ivory transition-opacity duration-300 hover:opacity-90"
              >
                Find your direction <span aria-hidden>→</span>
              </Link>
              <a
                href="#how-this-works"
                className="text-sm text-muted-ink underline-offset-8 transition-colors duration-300 hover:text-ivory hover:underline"
              >
                How this works
              </a>
            </div>
          </Reveal>
          </div>
          <Reveal delay={420}>
            <aside className="border border-line bg-panel p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-verified"
                />
                <p className="az-eyebrow">AI CONTRIBUTION GUIDE</p>
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-ink">
                  ready
                </span>
              </div>
              <h2 className="az-h3 mt-5 text-ivory">Start with what you can offer.</h2>
              <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed text-muted-ink">
                Tell the guide about your skills, the time you have, where you are, and the kind of
                commitment you are considering.
              </p>

              <p className="az-eyebrow mt-8">Example exchange</p>
              <div className="mt-4 space-y-4">
                <p className="border-l-2 border-line bg-panel-2 px-4 py-3 text-[0.9rem] leading-relaxed text-ivory/90">
                  &ldquo;I&rsquo;m an electrical engineer in London. I can help five hours a
                  week.&rdquo;
                </p>
                <div className="border-l-2 border-accent-blue/70 px-4 py-1">
                  <p className="text-[0.9rem] leading-relaxed text-muted-ink">
                    &ldquo;You have credible routes in remote infrastructure resilience and defence
                    technology. Let&rsquo;s try a short mission before you choose.&rdquo;
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["BUILD", "SUPPORT", "REMOTE"].map((t) => (
                      <span
                        key={t}
                        className="border border-line px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-ink"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/guide"
                className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-accent-blue px-6 py-3.5 text-sm font-semibold tracking-wide text-ivory transition-opacity duration-300 hover:opacity-90"
              >
                Talk to the guide <span aria-hidden>→</span>
              </Link>
            </aside>
          </Reveal>
        </div>
        <div
          aria-hidden
          className="az-cue pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg width="16" height="34" viewBox="0 0 16 34" fill="none">
            <path d="M8 0v26M2 20l6 7 6-7" stroke="hsl(var(--muted-ink))" strokeWidth="1" />
          </svg>
        </div>
      </section>

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="az-eyebrow">THE PROBLEM</p>
          </Reveal>
          <div className="mt-14 grid gap-px bg-line md:grid-cols-3">
            {PROBLEM.map((item, i) => (
              <Reveal key={item.h} delay={i * 100}>
                <div className="h-full bg-ink pr-8 pt-8 md:p-10 md:pl-10">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-ivory">
                    {item.h}
                  </h2>
                  <p className="mt-4 max-w-[38ch] text-[0.98rem] leading-relaxed text-muted-ink">
                    {item.p}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-this-works" className="relative border-t border-line px-6 py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="az-eyebrow">HOW THIS WORKS</p>
            <h2 className="az-h2 mt-5 max-w-[18ch] text-ivory">Eight steps, in your own time.</h2>
          </Reveal>
          <ol className="relative mt-16 max-w-3xl border-l border-line">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.path} delay={i * 60} className="relative block pb-12 pl-10">
                <span
                  aria-hidden
                  className="absolute -left-[3px] top-2 h-1.5 w-1.5 rounded-full bg-accent-blue"
                />
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-xs font-semibold tracking-[0.22em] text-muted-ink">
                    {step.n}
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight text-ivory">
                    {step.name}
                  </h3>
                </div>
                <p className="mt-3 max-w-[54ch] text-[0.98rem] leading-relaxed text-muted-ink">
                  {step.line}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="border border-signal/30 bg-panel p-10 md:p-14">
              <p className="az-eyebrow" style={{ color: "hsl(var(--signal))" }}>
                HONESTY
              </p>
              <h2 className="az-h2 mt-5 text-ivory">What we will not do.</h2>
              <ul className="mt-10 space-y-6">
                {REFUSALS.map((line) => (
                  <li key={line} className="flex max-w-[68ch] gap-5">
                    <span aria-hidden className="mt-3 h-px w-6 shrink-0 bg-signal/70" />
                    <span className="text-[1.0625rem] leading-[1.65] text-ivory/90">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line px-6 py-40 text-center">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 100%, hsl(var(--accent-blue) / 0.18) 0%, transparent 70%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-3xl">
          <h2 className="az-hero text-ivory">Start where you are.</h2>
          <div className="mt-12">
            <Link
              to="/direction"
              className="inline-flex items-center gap-4 bg-accent-blue px-8 py-4 text-sm font-semibold tracking-wide text-ivory transition-opacity duration-300 hover:opacity-90"
            >
              Find your direction <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="mx-auto mt-8 max-w-[46ch] text-sm leading-relaxed text-muted-ink">
            Takes about six minutes. You can stop at any point, and nothing is submitted anywhere.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
