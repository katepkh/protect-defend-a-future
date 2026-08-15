import { createFileRoute } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { Reveal } from "@/components/journey/Reveal";

export const Route = createFileRoute("/organisations")({
  head: () => ({
    meta: [
      { title: "Verified organisations — PROTECT" },
      {
        name: "description",
        content:
          "A registry of organisations, with the basis of verification stated openly and the limits of that verification stated just as openly.",
      },
      { property: "og:title", content: "Verified organisations — PROTECT" },
      {
        property: "og:description",
        content: "Who verified an organisation, when, and what that verification does not cover.",
      },
    ],
  }),
  component: OrganisationsPage,
});

function OrganisationsPage() {
  return (
    <main className="relative overflow-hidden px-6 pb-28 pt-20">
      <div aria-hidden className="absolute inset-0 opacity-50">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">REGISTRY</p>
          <h1 className="az-h2 mt-5 text-ivory">Verified organisations</h1>
          <p className="az-body mt-6 text-muted-ink">
            Every entry will state who verified it, when, and what the verification does not cover.
            An unverified organisation is not necessarily illegitimate — it simply has not been
            checked.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-12 max-w-xl border border-line bg-panel p-8">
            <p className="az-eyebrow">Coming next</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-ink">
              The registry is scaffolded for this pass. No organisation is listed yet, because
              listing one before it is genuinely verified would be the exact failure this product
              exists to fix.
            </p>
            <p className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-verified">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-verified" />
              Verification badge reserved
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}