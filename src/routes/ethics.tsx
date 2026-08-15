import { createFileRoute, Link } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { Reveal } from "@/components/journey/Reveal";
import { EraseEverything } from "@/components/journey/EraseEverything";
import { ILLUSTRATIVE_NOTICE } from "@/lib/pathways/types";

export const Route = createFileRoute("/ethics")({
  head: () => ({
    meta: [
      { title: "Data and ethics — PROTECT" },
      { name: "description", content: "What PROTECT collects, what it never asks, why there is no automated decision about you, and what we deliberately did not build." },
      { property: "og:title", content: "Data and ethics — PROTECT" },
      { property: "og:description", content: "What PROTECT collects, what it never asks, why there is no automated decision about you, and what we deliberately did not build." },
    ],
  }),
  component: EthicsPage,
});

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-14">
      <p className="az-eyebrow">{n}</p>
      <h2 className="az-h3 mt-4 max-w-[24ch] text-ivory">{title}</h2>
      <div className="mt-6 max-w-[62ch] space-y-5 text-[1rem] leading-[1.7] text-muted-ink">
        {children}
      </div>
    </section>
  );
}

const NOT_BUILT: [string, string][] = [
  ["No countdown timers or urgency mechanics", "Pressure produces decisions people regret, and this decision is not reversible on a whim."],
  ["No scarcity claims", "There is no honest way to say a place is running out, so we do not imply it."],
  ["No points, XP, streaks or badges", "Rewarding progress toward a military commitment would be grotesque."],
  ["No testimonials presented as real people", "Every voice here is a labelled composite, because fabricated authenticity is still fabrication."],
  ["No hidden scoring or personality profiling", "Every point the ranking awards is shown to you with its reason on the same screen."],
  ["No pre-ticked consent", "Consent that you did not actively give is not consent."],
  ["No persuasion toward service", "'I am not ready' and 'this does not fit' are first-class outcomes, styled exactly like every other option."],
  ["No account, no login, no email capture", "The safest personal data is the data that was never collected."],
  ["No recruiter view, no applicant pipeline", "You are the person deciding here, never a record being processed by someone else."],
];

function EthicsPage() {
  return (
    <main className="relative overflow-hidden px-6 py-24">
      <div aria-hidden className="absolute inset-0 opacity-40">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">DATA AND ETHICS</p>
          <h1 className="az-h2 mt-5 max-w-[22ch] text-ivory">
            What this product does, in plain English.
          </h1>
          <p className="az-body mt-6 text-muted-ink">
            Thirty seconds gets you the shape of it. Three minutes gets you the whole thing. Nothing
            below is written to be difficult to read.
          </p>
        </Reveal>

        <div className="mt-10 max-w-[80ch]">
          <Block n="01" title="What we collect">
            <p>
              Nothing leaves your browser. Your direction, your mission results, your answers to the
              guide and your saved plan are stored in this device's local storage and nowhere else.
            </p>
            <p>
              There is no account, no login, no server-side record of you, and no analytics on your
              personal answers. If you clear this browser's storage, the product forgets you
              completely, because there is nowhere else for it to remember you.
            </p>
          </Block>

          <Block n="02" title="What we never ask">
            <p>
              We do not ask for political opinions, religious belief, or health and medical history.
              These are special categories of personal data under Article 9 of the GDPR.
            </p>
            <p>
              This is a design choice, not an oversight. A product that steers people toward military
              and humanitarian service could construct a startlingly intimate profile from those
              three fields, so we removed the possibility rather than promising to handle it well.
              The organisation you approach may ask about health at the point of assessment. That
              conversation belongs to them, with a human, and none of it passes through us.
            </p>
          </Block>

          <Block n="03" title="No automated decisions about you">
            <p>
              Article 22 of the GDPR concerns decisions made about a person by automated means alone.
              Nothing here makes one.
            </p>
            <p>
              Pathway ranking is deterministic and rule-based. The same inputs always produce the
              same output. Every point awarded is shown to you with the reason for it, the full rule
              set is published inside the product rather than described in the abstract, and every
              excluded pathway is listed with the specific answer of yours that excluded it — so you
              can change that answer and watch the result change.
            </p>
            <p>
              The AI model writes prose only: it mirrors back what you said in the guide. It does not
              rank, filter, score, or decide anything. You can always reject a suggestion, and
              rejecting one is treated as a constraint you set, not a mistake you made.
            </p>
          </Block>

          <Block n="04" title="We do not verify people">
            <p>
              There is no background check here, no screening, and no eligibility rejection. We could
              not perform one lawfully or competently, and a product that pretended otherwise would
              be dangerous.
            </p>
            <p>
              Verification belongs to the authorised organisation and is carried out by a human being
              who is accountable for it. Wherever verification appears in this product, it is
              labelled as their process, not ours.
            </p>
          </Block>

          <Block n="05" title="Separation of pathways">
            <p>
              Military service, defence industry, humanitarian and medical work, and remote
              contribution are kept apart throughout. Each has its own consent statement naming what
              would be shared, with whom, and for what purpose.
            </p>
            <p>
              Consent for one category grants nothing to any other. Information relating to a
              military pathway is never shown as flowing to a private defence company.
            </p>
          </Block>

          <Block n="06" title="What we deliberately did not build">
            <ul className="space-y-5">
              {NOT_BUILT.map(([h, why]) => (
                <li key={h}>
                  <span className="block text-ivory">{h}</span>
                  <span className="mt-1 block text-[0.95rem] text-muted-ink">{why}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block n="07" title="Limitations of this prototype">
            <p>{ILLUSTRATIVE_NOTICE}</p>
            <p>
              Every personal voice in the product is a composite written for it, not a real
              individual. No verification, referral or introduction actually occurs: the handoff
              screens demonstrate what would happen, and send nothing to anyone.
            </p>
            <p>
              Before any real deployment, four things would have to change: organisation data would
              need re-verification against official sources and a maintained update process; the
              composite voices would need replacing with consented real accounts; the consent and
              handoff flow would need a legal review in each jurisdiction it operates in; and the
              matching rules would need review by people who actually run these intake processes.
            </p>
          </Block>
        </div>

        <EraseEverything className="mt-6 max-w-[80ch]" />

        <div className="mt-10 flex flex-wrap gap-8">
          <Link to="/organisations" className="text-sm text-muted-ink hover:text-ivory">
            Organisation registry
          </Link>
          <Link to="/" className="text-sm text-muted-ink hover:text-ivory">
            Back to the start
          </Link>
          <Link to="/not-ready" className="text-sm text-muted-ink hover:text-ivory">
            I am not ready
          </Link>
        </div>
      </div>
    </main>
  );
}
