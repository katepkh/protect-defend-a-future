import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Reveal } from "@/components/journey/Reveal";
import { Graticule } from "@/components/atmosphere/Graticule";
import { VerificationBadge } from "@/components/pathways/VerificationBadge";
import { PATHWAYS } from "@/lib/pathways/data";
import { CATEGORY_LABELS, CATEGORY_NOTES, ILLUSTRATIVE_NOTICE } from "@/lib/pathways/types";
import { VOICES, VOICE_NOTICE } from "@/lib/pathways/voices";
import { useJourney } from "@/state/journey";

export const Route = createFileRoute("/reality")({
  validateSearch: (search: Record<string, unknown>) => ({
    pathway: typeof search["pathway"] === "string" ? (search["pathway"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Understand reality — TOPROTECT" },
      { name: "description", content: "Commitment, risk, language requirements, and legal constraints, stated plainly before you go any further." },
      { property: "og:title", content: "Understand reality — TOPROTECT" },
      { property: "og:description", content: "Commitment, risk, language requirements, and legal constraints, stated plainly before you go any further." },
    ],
  }),
  component: RealityPage,
});

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12">
      <p className="az-eyebrow">{label}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex max-w-[62ch] gap-5">
      <span aria-hidden className="mt-3 h-px w-6 shrink-0 bg-signal/70" />
      <span className="text-[1rem] leading-[1.65] text-ivory/90">{children}</span>
    </li>
  );
}

function RealityPage() {
  const { pathway: pathwayParam } = Route.useSearch();
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const id = pathwayParam ?? journey.selectedPathway ?? null;
  const p = PATHWAYS.find((x) => x.id === id) ?? null;

  if (!p) {
    return (
      <main className="relative px-6 py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="az-eyebrow">STEP 06 · UNDERSTAND REALITY</p>
          <h1 className="az-h2 mt-5 text-ivory">Choose a pathway first.</h1>
          <p className="az-body mt-6 text-muted-ink">
            This page states plainly what one specific pathway would ask of you. Pick one and it
            will be laid out here in full.
          </p>
          <Link
            to="/pathways"
            className="mt-10 inline-flex items-center gap-4 bg-accent-blue px-7 py-3.5 text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
          >
            Back to your pathways <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    );
  }

  const acknowledged = journey.acknowledgedReality && journey.selectedPathway === p.id;

  return (
    <main className="relative overflow-hidden px-6 py-24">
      <div aria-hidden className="absolute inset-0 opacity-40">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">STEP 06 · UNDERSTAND REALITY</p>
          <h1 className="az-h2 mt-5 max-w-[22ch] text-ivory">{p.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <p className="text-[0.95rem] text-muted-ink">
              {p.organisationName} · {p.location} · {CATEGORY_LABELS[p.category]}
            </p>
            <VerificationBadge status={p.verificationStatus} />
          </div>
          <p className="az-body mt-8 text-muted-ink">
            Everything below is the unglamorous version. If any of it changes your mind, that is the
            page working as intended.
          </p>
        </Reveal>

        <div className="mt-12 max-w-[80ch]">
          <Block label="What it asks of you">
            <dl className="grid gap-px bg-line sm:grid-cols-2">
              {[
                ["Commitment", `${p.commitmentMonths.min}–${p.commitmentMonths.max} months`],
                ["Hours", `${p.hoursPerWeek.min}–${p.hoursPerWeek.max} per week`],
                ["Language", p.languageRequirement.label],
                ["Relocation", p.relocationRequired ? "Required" : "Not required"],
              ].map(([k, v]) => (
                <div key={k} className="bg-panel p-6">
                  <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-ink">
                    {k}
                  </dt>
                  <dd className="mt-2 text-[0.95rem] text-ivory">{v}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block label="Risk, stated plainly">
            <ul className="space-y-5">
              {p.honestRisks.map((r) => (
                <Line key={r}>{r}</Line>
              ))}
            </ul>
          </Block>

          <Block label="Limits and legal consequences">
            <ul className="space-y-5">
              {[...p.honestLimitations, ...p.eligibilityNotes].map((r) => (
                <Line key={r}>{r}</Line>
              ))}
            </ul>
          </Block>

          <Block label="An ordinary day">
            <p className="max-w-[62ch] text-[1.0625rem] leading-[1.7] text-ivory/90">
              {p.ordinaryDayDescription}
            </p>
            <p className="mt-6 max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-ink">
              <span className="text-ivory">What this is not: </span>
              {p.whatItIsNot}
            </p>
          </Block>

          <Block label="Accounts from this kind of work">
            <div className="grid gap-px bg-line md:grid-cols-2">
              {VOICES[p.category].map((v) => (
                <blockquote key={v.text} className="bg-panel p-8">
                  <p
                    className="text-[0.62rem] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      color: v.tone === "difficult" ? "hsl(var(--signal))" : "hsl(var(--muted-ink))",
                    }}
                  >
                    {v.tone === "difficult" ? "A harder account" : "A steady account"}
                  </p>
                  <p className="mt-4 text-[0.98rem] leading-[1.7] text-ivory/90">{v.text}</p>
                </blockquote>
              ))}
            </div>
            <p className="mt-5 max-w-[62ch] text-[0.8rem] leading-relaxed text-signal/90">
              {VOICE_NOTICE}
            </p>
          </Block>

          <Block label="Where this goes, and where it does not">
            <p className="max-w-[62ch] text-[0.98rem] leading-relaxed text-muted-ink">
              {CATEGORY_NOTES[p.category]}
            </p>
            <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-muted-ink">
              This pathway sits in one category only. Interest here is never passed to another
              category, and nothing you do on this page is sent anywhere: it stays in your browser
              until you clear it.
            </p>
          </Block>

          <div className="border-t border-line py-12">
            <div className="border border-line bg-panel p-8 md:p-10">
              <label className="flex cursor-pointer items-start gap-5">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) =>
                    update({
                      acknowledgedReality: e.target.checked,
                      acknowledgedRealityAt: e.target.checked ? new Date().toISOString() : null,
                      selectedPathway: e.target.checked ? p.id : null,
                    })
                  }
                  className="mt-1 h-5 w-5 shrink-0 accent-[hsl(var(--accent-blue))]"
                />
                <span className="max-w-[62ch] text-[1rem] leading-[1.65] text-ivory">
                  I have read the commitment, the risk, the language requirement and the legal
                  consequences above, and I want to continue with this pathway.
                </span>
              </label>
              <div className="mt-8 flex flex-wrap items-center gap-8">
                <button
                  type="button"
                  disabled={!acknowledged}
                  onClick={() => void navigate({ to: "/act" })}
                  className="inline-flex items-center gap-4 bg-accent-blue px-7 py-3.5 text-sm font-semibold text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Continue <span aria-hidden>→</span>
                </button>
                <Link to="/pathways" className="text-sm text-ivory underline-offset-8 hover:underline">
                  This changed my mind, show me something else
                </Link>
                <Link to="/not-ready" className="text-sm text-ivory underline-offset-8 hover:underline">
                  I am not ready
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-[62ch] text-[0.8rem] leading-relaxed text-signal/90">
          {ILLUSTRATIVE_NOTICE}
        </p>
      </div>
    </main>
  );
}
