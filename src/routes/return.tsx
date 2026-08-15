import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { Reveal } from "@/components/journey/Reveal";
import { EraseEverything } from "@/components/journey/EraseEverything";
import { PathwayCard } from "@/components/pathways/PathwayCard";
import { matchPathways } from "@/lib/matching";
import { REJECTION_LABELS, type RejectionDimension } from "@/lib/matching/types";
import { PATHWAYS } from "@/lib/pathways/data";
import { CATEGORY_LABELS, ILLUSTRATIVE_NOTICE } from "@/lib/pathways/types";
import { useJourney } from "@/state/journey";

export const Route = createFileRoute("/return")({
  head: () => ({
    meta: [
      { title: "Return and reroute — PROTECT" },
      { name: "description", content: "Come back weeks later. Check in, ask for a mentor, or take a different pathway without starting over." },
      { property: "og:title", content: "Return and reroute — PROTECT" },
      { property: "og:description", content: "Come back weeks later. Check in, ask for a mentor, or take a different pathway without starting over." },
    ],
  }),
  component: ReturnPage,
});

type Answer = "progressing" | "stalled" | "didnt-fit" | "changed-mind";

const ANSWERS: { id: Answer; label: string; sub: string }[] = [
  { id: "progressing", label: "It's progressing", sub: "Something moved, even slightly." },
  { id: "stalled", label: "It has stalled", sub: "Nothing has happened, or nothing is happening." },
  { id: "didnt-fit", label: "It didn't fit", sub: "The pathway itself was wrong for me." },
  { id: "changed-mind", label: "I've changed my mind", sub: "I do not want to continue with this." },
];

const BLOCKERS = [
  {
    h: "No reply at all.",
    p: "Common, and rarely about you. Send one short follow-up naming the role and the date you first wrote, then stop. A second unanswered message is information: try another organisation in the registry.",
  },
  {
    h: "The documents are the obstacle.",
    p: "Recognition of qualifications abroad is slow and bureaucratic. Start the recognition process in parallel rather than waiting for the organisation to ask for it.",
  },
  {
    h: "The language requirement turned out to be real.",
    p: "It usually is. Either move to a pathway where English is genuinely sufficient, or set a modest, boring study routine and check back in three months.",
  },
  {
    h: "Ordinary life absorbed it.",
    p: "The most common blocker of all. Shrink the commitment rather than abandoning it: a remote pathway at two hours a week that you actually keep is worth more than a plan you do not.",
  },
];

const MENTOR_NOTICE =
  "Composite illustration written for this prototype. Not a real person, and no introduction is made.";

function ReturnPage() {
  const { journey } = useJourney();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [reason, setReason] = useState<RejectionDimension | null>(null);
  const [mentor, setMentor] = useState(false);

  const pathway = PATHWAYS.find((p) => p.id === journey.selectedPathway) ?? null;
  const returned = Boolean(journey.checkIn?.simulatedDaysLater);

  const rerun = useMemo(() => {
    if (!reason || !pathway) return null;
    return matchPathways({
      signals: journey.missionSignals,
      answers: journey.guideAnswers,
      direction: journey.direction,
      rejections: [{ pathwayId: pathway.id, dimension: reason }],
    });
  }, [reason, pathway, journey.missionSignals, journey.guideAnswers, journey.direction]);

  return (
    <main className="relative overflow-hidden px-6 py-24">
      <div aria-hidden className="absolute inset-0 opacity-40">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">STEP 08 · RETURN AND REROUTE</p>
          <h1 className="az-h2 mt-5 max-w-[22ch] text-ivory">
            {returned
              ? "It has been two weeks. How did it actually go?"
              : "When you come back, this is what you see."}
          </h1>
          <p className="az-body mt-6 text-muted-ink">
            {pathway
              ? `You left with one pathway written down: ${pathway.title}. `
              : "Nothing is assumed about what you did, and nothing was checked up on. "}
            None of the four answers below is better than the others.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px bg-line md:grid-cols-4">
          {ANSWERS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setAnswer(a.id);
                setReason(null);
              }}
              aria-pressed={answer === a.id}
              className={`bg-panel p-8 text-left transition-colors hover:bg-panel-2 ${
                answer === a.id ? "ring-1 ring-inset ring-accent-blue" : ""
              }`}
            >
              <span className="block font-display text-lg font-bold tracking-tight text-ivory">
                {a.label}
              </span>
              <span className="mt-2 block text-[0.88rem] leading-relaxed text-muted-ink">
                {a.sub}
              </span>
            </button>
          ))}
        </div>

        {answer === "progressing" ? (
          <div className="mt-12 max-w-[80ch] border border-line bg-panel p-8 md:p-10">
            <p className="az-eyebrow">The next realistic milestone</p>
            <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.65] text-ivory/90">
              {pathway
                ? `A first substantive exchange with ${pathway.organisationName} in which they, not you, set the timetable: a call, a document request, or a place on a roster.`
                : "A first substantive exchange with the organisation in which they, not you, set the timetable."}
            </p>
            <p className="az-eyebrow mt-8" style={{ color: "hsl(var(--signal))" }}>
              What commonly goes wrong at this stage
            </p>
            <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-muted-ink">
              People read early momentum as a decision and start rearranging their life around it.
              Nothing is decided until the organisation says so in writing, and momentum stalls
              often. Keep your ordinary commitments intact until you have something concrete.
            </p>
          </div>
        ) : null}

        {answer === "stalled" ? (
          <div className="mt-12 max-w-[90ch]">
            <div className="grid gap-px bg-line md:grid-cols-2">
              {BLOCKERS.map((b) => (
                <div key={b.h} className="bg-panel p-8">
                  <h2 className="font-display text-lg font-bold tracking-tight text-ivory">
                    {b.h}
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-[0.92rem] leading-relaxed text-muted-ink">
                    {b.p}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMentor(true)}
              className="mt-8 border border-line px-6 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
            >
              Talk to a person about this
            </button>
          </div>
        ) : null}

        {answer === "didnt-fit" ? (
          <div className="mt-12">
            <div className="max-w-[80ch] border border-line bg-panel p-8 md:p-10">
              <p className="az-eyebrow">What did not fit?</p>
              <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-muted-ink">
                One reason is enough. It is added as a constraint you set, the same deterministic
                rules run again, and a different set of pathways comes back.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {(Object.keys(REJECTION_LABELS) as RejectionDimension[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setReason(d)}
                    aria-pressed={reason === d}
                    className={`border px-5 py-3 text-left text-[0.88rem] text-ivory transition-colors ${
                      reason === d ? "border-accent-blue" : "border-line hover:border-accent-blue"
                    }`}
                  >
                    {REJECTION_LABELS[d]}
                  </button>
                ))}
              </div>
              {!pathway ? (
                <p className="mt-6 text-[0.9rem] text-muted-ink">
                  No pathway was saved on this device, so there is nothing to reroute from.{" "}
                  <Link to="/pathways" className="text-accent-blue hover:underline">
                    Start from the full list instead.
                  </Link>
                </p>
              ) : null}
            </div>

            {rerun ? (
              <div className="mt-10 space-y-10">
                <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-ink">
                  {rerun.top.length === 0
                    ? "With that constraint added, nothing is left. That is a real answer, not a failure."
                    : `${rerun.top.length} pathway${rerun.top.length === 1 ? "" : "s"} survive that constraint.`}
                </p>
                {rerun.top.map((r, i) => (
                  <PathwayCard key={r.pathway.id} ranked={r} index={i} onReject={() => {}} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {answer === "changed-mind" ? (
          <div className="mt-12 max-w-[62ch]">
            <h2 className="az-h2 text-ivory">That is a legitimate outcome.</h2>
            <p className="az-body mt-6 text-muted-ink">
              Deciding not to proceed is a decision, not a withdrawal. Changing your mind after
              learning what something actually involves is this system working correctly — it is the
              precise thing it was built to make possible.
            </p>
            <p className="az-body mt-5 text-muted-ink">
              Nothing was submitted, nobody was told, and there is nothing to cancel. You are not
              asked for a reason.
            </p>
            <EraseEverything className="mt-10" />
          </div>
        ) : null}

        <div className="mt-16 max-w-[80ch] border border-line bg-panel p-8 md:p-10">
          <p className="az-eyebrow">Someone who has already done this</p>
          <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-muted-ink">
            A mentor is someone who has taken the pathway you are looking at, and who will answer
            the unglamorous questions honestly.
          </p>
          <button
            type="button"
            onClick={() => setMentor((v) => !v)}
            aria-expanded={mentor}
            className="mt-6 border border-line px-6 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
          >
            See what this would look like
          </button>
          {mentor ? (
            <div className="mt-6 border-l-2 border-signal/70 pl-6">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-signal">
                {MENTOR_NOTICE}
              </p>
              <p className="mt-4 font-display text-lg font-bold tracking-tight text-ivory">
                M. — {pathway ? CATEGORY_LABELS[pathway.category] : "Remote contribution"}, two years in
              </p>
              <p className="mt-3 max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-ink">
                &ldquo;Ask me the practical things. How long the paperwork took, what I got wrong at
                the start, what I would not do again. I will not tell you whether to go. I do not
                know your life, and anyone who answers that question for you is not being
                serious.&rdquo;
              </p>
            </div>
          ) : null}
        </div>

        <EraseEverything className="mt-8 max-w-[80ch]" />

        <p className="mt-10 max-w-[62ch] text-[0.8rem] leading-relaxed text-signal/90">
          {ILLUSTRATIVE_NOTICE}
        </p>

        <div className="mt-8 flex flex-wrap gap-8">
          <Link to="/act" className="text-sm text-muted-ink hover:text-ivory">
            Back to your next step
          </Link>
          <Link to="/pathways" className="text-sm text-muted-ink hover:text-ivory">
            See all pathways again
          </Link>
          <Link to="/ethics" className="text-sm text-muted-ink hover:text-ivory">
            Data and ethics
          </Link>
        </div>
      </div>
    </main>
  );
}
