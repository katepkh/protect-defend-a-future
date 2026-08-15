import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PathwayCard } from "@/components/pathways/PathwayCard";
import { Disclosure } from "@/components/pathways/Disclosure";
import { Reveal } from "@/components/journey/Reveal";
import { Graticule } from "@/components/atmosphere/Graticule";
import { matchPathways } from "@/lib/matching";
import { ALGORITHM_EXPLANATION } from "@/lib/matching/explanation";
import {
  REJECTION_LABELS,
  type PathwayRejection,
  type RejectionDimension,
} from "@/lib/matching/types";
import { ILLUSTRATIVE_NOTICE } from "@/lib/pathways/types";
import { PATHWAYS } from "@/lib/pathways/data";
import { useJourney } from "@/state/journey";

export const Route = createFileRoute("/pathways")({
  head: () => ({
    meta: [
      { title: "See your pathways — TOPROTECT" },
      { name: "description", content: "Three transparent options with honest trade-offs, each explained in plain language. Never a black-box verdict." },
      { property: "og:title", content: "See your pathways — TOPROTECT" },
      { property: "og:description", content: "Three transparent options with honest trade-offs, each explained in plain language. Never a black-box verdict." },
    ],
  }),
  component: PathwaysPage,
});

function PathwaysPage() {
  const { journey } = useJourney();
  const [rejections, setRejections] = useState<PathwayRejection[]>([]);

  const result = useMemo(
    () =>
      matchPathways({
        signals: journey.missionSignals,
        answers: journey.guideAnswers,
        direction: journey.direction,
        rejections,
      }),
    [journey.missionSignals, journey.guideAnswers, journey.direction, rejections],
  );

  const reject = (pathwayId: string) => (dimension: RejectionDimension) =>
    setRejections((prev) => [...prev, { pathwayId, dimension }]);

  return (
    <main className="relative overflow-hidden px-6 py-24">
      <div aria-hidden className="absolute inset-0 opacity-40">
        <Graticule />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">STEP 05 · YOUR PATHWAYS</p>
          <h1 className="az-h2 mt-5 max-w-[20ch] text-ivory">
            {result.top.length === 0
              ? "Nothing here fits what you told us."
              : `${result.top.length === 1 ? "One pathway" : `${result.top.length} pathways`} fit what you told us.`}
          </h1>
          <p className="az-body mt-6 text-muted-ink">
            This is a suggestion, not a verdict. Nothing here qualifies or disqualifies you from
            anything, and every decision after this point is yours.
          </p>
        </Reveal>

        {result.shortfall ? (
          <Reveal delay={80}>
            <p className="mt-8 max-w-[62ch] border-l-2 border-signal/70 pl-6 text-[0.95rem] leading-relaxed text-ivory/90">
              {result.shortfall}
            </p>
          </Reveal>
        ) : null}

        {result.constraintsApplied.length > 0 ? (
          <Reveal delay={120}>
            <div className="mt-10 border border-line bg-panel p-7">
              <p className="az-eyebrow">Constraints you set</p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                {result.constraintsApplied.map((c) => (
                  <li key={c} className="text-[0.88rem] text-muted-ink">
                    {c}
                  </li>
                ))}
              </ul>
              <Link
                to="/guide"
                className="mt-5 inline-block text-[0.85rem] text-accent-blue underline-offset-8 hover:underline"
              >
                Change an answer
              </Link>
            </div>
          </Reveal>
        ) : null}

        {rejections.length > 0 ? (
          <Reveal delay={140}>
            <div className="mt-6 border border-line bg-panel-2 p-7">
              <p className="az-eyebrow">You set these aside yourself</p>
              <ul className="mt-4 space-y-2">
                {rejections.map((r, i) => (
                  <li key={`${r.pathwayId}-${i}`} className="text-[0.88rem] text-muted-ink">
                    {PATHWAYS.find((p) => p.id === r.pathwayId)?.title} —{" "}
                    {REJECTION_LABELS[r.dimension].toLowerCase()}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setRejections([])}
                className="mt-5 text-[0.85rem] text-accent-blue underline-offset-8 hover:underline"
              >
                Undo and show everything again
              </button>
            </div>
          </Reveal>
        ) : null}

        <div className="mt-14 space-y-10">
          {result.top.map((r, i) => (
            <Reveal key={r.pathway.id} delay={i * 80}>
              <PathwayCard ranked={r} index={i} onReject={reject(r.pathway.id)} />
            </Reveal>
          ))}
        </div>

        {result.top.length === 0 ? (
          <Reveal>
            <div className="mt-12 max-w-[62ch] border border-line bg-panel p-10">
              <p className="text-[1.0625rem] leading-[1.65] text-ivory">
                Your own constraints removed everything on the list. That is a legitimate result,
                not a failure, and the list was not padded to hide it.
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                <Link to="/guide" className="text-sm text-accent-blue hover:underline">
                  Change an answer
                </Link>
                <Link to="/not-ready" className="text-sm text-ivory hover:underline">
                  I am not ready for any of this
                </Link>
              </div>
            </div>
          </Reveal>
        ) : null}

        <div className="mt-16 space-y-4">
          <Disclosure
            label={ALGORITHM_EXPLANATION.title}
            hint={ALGORITHM_EXPLANATION.intro}
          >
            <ol className="space-y-7">
              {ALGORITHM_EXPLANATION.steps.map((s) => (
                <li key={s.heading}>
                  <h3 className="font-display text-base font-bold tracking-tight text-ivory">
                    {s.heading}
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-[0.9rem] leading-relaxed text-muted-ink">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-[62ch] border-l-2 border-signal/70 pl-6 text-[0.9rem] leading-relaxed text-ivory/90">
              {ALGORITHM_EXPLANATION.article22}
            </p>
          </Disclosure>

          <Disclosure
            label={`Everything that was excluded (${result.excluded.length})`}
            hint="This is part of the result, not a debug view. Each entry names the answer that removed it. Change that answer and it comes back."
          >
            <ul className="space-y-6">
              {result.excluded.map((e) => (
                <li key={e.pathway.id} className="border-l border-line pl-6">
                  <p className="font-display text-[0.95rem] font-bold tracking-tight text-ivory">
                    {e.pathway.title}
                  </p>
                  <p className="mt-1 max-w-[62ch] text-[0.88rem] leading-relaxed text-muted-ink">
                    {e.reason}
                  </p>
                  <p className="mt-1 text-[0.78rem] text-muted-ink/70">{e.fromAnswer}</p>
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>

        <p className="mt-12 max-w-[62ch] text-[0.8rem] leading-relaxed text-signal/90">
          {ILLUSTRATIVE_NOTICE}
        </p>

        <div className="mt-10 flex flex-wrap gap-8">
          <Link to="/organisations" className="text-sm text-muted-ink hover:text-ivory">
            See the organisation registry
          </Link>
          <Link to="/not-ready" className="text-sm text-muted-ink hover:text-ivory">
            None of this is right for me
          </Link>
        </div>
      </div>
    </main>
  );
}
