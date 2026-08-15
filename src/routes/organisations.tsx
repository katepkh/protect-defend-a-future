import { createFileRoute, Link } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { Reveal } from "@/components/journey/Reveal";
import { VerificationBadge } from "@/components/pathways/VerificationBadge";
import { ORGANISATIONS, VERIFICATION_MEANING } from "@/lib/pathways/organisations";
import { CATEGORY_LABELS, CATEGORY_NOTES, ILLUSTRATIVE_NOTICE } from "@/lib/pathways/types";
import type { PathwayCategory, VerificationStatus } from "@/lib/pathways/types";

export const Route = createFileRoute("/organisations")({
  head: () => ({
    meta: [
      { title: "Organisation registry — TOPROTECT" },
      { name: "description", content: "Every organisation referenced in TOPROTECT, grouped by category, with an honest verification status and its official link." },
      { property: "og:title", content: "Organisation registry — TOPROTECT" },
      { property: "og:description", content: "Every organisation referenced in TOPROTECT, grouped by category, with an honest verification status and its official link." },
    ],
  }),
  component: OrganisationsPage,
});

const ORDER: PathwayCategory[] = ["military", "defence-tech", "humanitarian", "remote"];
const STATUSES: VerificationStatus[] = ["verified", "listed", "unverified"];

function OrganisationsPage() {
  return (
    <main className="relative overflow-hidden px-6 py-24">
      <div aria-hidden className="absolute inset-0 opacity-40">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">REGISTRY</p>
          <h1 className="az-h2 mt-5 max-w-[24ch] text-ivory">
            Every organisation named in this product, and exactly how far our checking goes.
          </h1>
          <p className="az-body mt-6 text-muted-ink">
            Each category is kept apart, because the obligations, the risks and the law differ
            entirely between them. Nothing you have entered has been sent to any of these
            organisations.
          </p>
        </Reveal>

        <div className="mt-12 grid max-w-[110ch] gap-px bg-line md:grid-cols-3">
          {STATUSES.map((s) => (
            <div key={s} className="bg-panel p-8">
              <VerificationBadge status={s} />
              <p className="mt-5 max-w-[42ch] text-[0.9rem] leading-relaxed text-ivory/90">
                {VERIFICATION_MEANING[s].means}
              </p>
              <p className="mt-4 max-w-[42ch] text-[0.9rem] leading-relaxed text-signal/90">
                {VERIFICATION_MEANING[s].doesNotMean}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[62ch] text-[0.85rem] leading-relaxed text-signal/90">
          {ILLUSTRATIVE_NOTICE}
        </p>

        <div className="mt-20 space-y-20">
          {ORDER.map((category) => {
            const list = ORGANISATIONS.filter((o) => o.category === category);
            if (list.length === 0) return null;
            return (
              <section key={category} className="border-t border-line pt-10">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-ivory">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <span className="text-[0.75rem] uppercase tracking-[0.22em] text-muted-ink">
                    {list.length} listed
                  </span>
                </div>
                <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-ink">
                  {CATEGORY_NOTES[category]}
                </p>
                <ul className="mt-8 grid gap-px bg-line md:grid-cols-2">
                  {list.map((o) => (
                    <li key={o.id} className="flex flex-col bg-panel p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <h3 className="max-w-[34ch] font-display text-lg font-bold leading-snug tracking-tight text-ivory">
                          {o.name}
                        </h3>
                        <VerificationBadge status={o.verificationStatus} />
                      </div>
                      <p className="mt-4 max-w-[52ch] flex-1 text-[0.92rem] leading-relaxed text-muted-ink">
                        {o.description}
                      </p>
                      <a
                        href={o.officialUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-6 inline-flex items-center gap-3 self-start text-sm text-accent-blue hover:underline"
                      >
                        Official channel <span aria-hidden>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-20 flex flex-wrap gap-8">
          <Link to="/pathways" className="text-sm text-muted-ink hover:text-ivory">
            Back to your pathways
          </Link>
          <Link to="/ethics" className="text-sm text-muted-ink hover:text-ivory">
            Data and ethics
          </Link>
          <Link to="/not-ready" className="text-sm text-muted-ink hover:text-ivory">
            I am not ready
          </Link>
        </div>
      </div>
    </main>
  );
}
