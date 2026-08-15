import { useState } from "react";
import {
  CAPABILITY_QUESTION,
  MOBILITY_OPTIONS,
  MOBILITY_QUESTION,
  MOBILITY_BY_ID,
  suggestDirections,
  type DirectionSuggestion,
} from "@/lib/guide/directionHint";
import { AI_DISCLOSURE, FREE_PREFIX, SKIPPED, answerLabel, scriptedReflection } from "@/lib/guide/script";
import { useReflection } from "@/components/guide/useReflection";
import { useJourney } from "@/state/journey";

type Props = {
  suggestions: DirectionSuggestion[] | null;
  onSuggest: (s: DirectionSuggestion[] | null) => void;
};

/**
 * A two-question nudge for people who cannot yet choose a direction.
 * The mapping is deterministic; the AI only rewrites the reflective sentence.
 * Nothing here navigates on the person's behalf.
 */
export function DirectionHelper({ suggestions, onSuggest }: Props) {
  const { journey, update } = useJourney();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [capability, setCapability] = useState<string | null>(null);
  const [free, setFree] = useState("");
  const [pending, setPending] = useState<{ prompt: string; label: string } | null>(null);
  const [history, setHistory] = useState<{ prompt: string; label: string; reflection: string }[]>([]);
  const { text, streaming, reflect, setScripted } = useReflection();

  const ask = (prompt: string, label: string, fallback: string, skipped: boolean) => {
    setPending({ prompt, label });
    if (skipped) setScripted(fallback);
    else void reflect(prompt, label, fallback);
  };

  const answerCapability = (value: string) => {
    if (pending) return;
    setCapability(value);
    setFree("");
    ask(
      CAPABILITY_QUESTION.prompt,
      answerLabel("capability", value),
      scriptedReflection("capability", value),
      value === SKIPPED,
    );
  };

  const answerMobility = (value: string) => {
    if (pending) return;
    const opt = MOBILITY_BY_ID.get(value);
    const label = opt ? opt.label : "Skipped";
    const fallback = opt ? opt.reflection : MOBILITY_QUESTION.skipReflection;
    ask(MOBILITY_QUESTION.prompt, label, fallback, value === SKIPPED || value === "m-unknown");

    const result = suggestDirections(capability ?? undefined, value === SKIPPED ? undefined : value);
    onSuggest(result);
    update({
      guideAnswers: {
        ...journey.guideAnswers,
        ...(capability ? { capability } : {}),
        ...(opt ? { time: opt.time, reloc: opt.reloc } : { time: SKIPPED, reloc: SKIPPED }),
      },
    });
  };

  const advance = () => {
    if (!pending) return;
    setHistory((h) => [...h, { ...pending, reflection: text }]);
    setPending(null);
    setScripted("");
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setCapability(null);
    setHistory([]);
    setPending(null);
    setScripted("");
    onSuggest(null);
  };

  if (!open) {
    return (
      <section className="mt-6 border border-line bg-panel p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-ivory">
              Not sure which one? Ask the guide.
            </h2>
            <p className="az-body mt-3 text-muted-ink">
              Two questions. It suggests a direction and tells you why — you still choose.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 border border-line px-6 py-3 text-sm font-semibold text-ivory transition-colors duration-300 hover:border-accent-blue hover:text-accent-blue"
          >
            Ask the guide <span aria-hidden>→</span>
          </button>
        </div>
      </section>
    );
  }

  const options =
    step === 0
      ? CAPABILITY_QUESTION.options.map((o) => ({ id: o.id, label: o.label }))
      : MOBILITY_OPTIONS.map((o) => ({ id: o.id, label: o.label }));
  const q = step === 0 ? CAPABILITY_QUESTION : MOBILITY_QUESTION;

  return (
    <section className="mt-6 border border-line bg-panel p-8 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="az-eyebrow">GUIDE ASSISTANCE</p>
          <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-ivory">
            Not sure which one? Ask the guide.
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border border-line px-5 py-2.5 text-sm text-ivory transition-colors hover:border-accent-blue"
        >
          Close
        </button>
      </div>
      <p className="mt-4 max-w-[62ch] border-l border-line pl-4 text-[0.8rem] leading-relaxed text-muted-ink">
        {AI_DISCLOSURE}
      </p>

      <div className="mt-10 max-w-[62ch] space-y-12">
        {history.map((h, i) => (
          <article key={i} className="space-y-3 opacity-60">
            <p className="text-[0.95rem] leading-relaxed text-muted-ink">{h.prompt}</p>
            <p className="border-l-2 border-accent-blue/60 pl-4 text-[0.95rem] leading-relaxed text-ivory">
              {h.label}
            </p>
            <p className="text-[0.95rem] leading-relaxed text-muted-ink">{h.reflection}</p>
          </article>
        ))}

        {pending ? (
          <article className="space-y-5">
            <p className="border-l-2 border-accent-blue pl-4 text-[0.95rem] leading-relaxed text-ivory">
              {pending.label}
            </p>
            <p className="min-h-[3.5rem] text-[1.05rem] leading-relaxed text-ivory">
              {text}
              {streaming ? <span className="az-caret" aria-hidden /> : null}
            </p>
            <button
              type="button"
              onClick={advance}
              disabled={!text}
              className="border border-accent-blue px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-accent-blue/10 disabled:opacity-40"
            >
              {step === 0 ? "Next question" : "See the suggestion"}
            </button>
          </article>
        ) : null}

        {!pending && step < 2 ? (
          <article className="space-y-6">
            <p className="az-eyebrow">
              {step === 0 ? "QUESTION 01 OF 02" : MOBILITY_QUESTION.eyebrow}
            </p>
            <h3 className="font-display text-[1.4rem] leading-tight tracking-[-0.02em] text-ivory">
              {q.prompt}
            </h3>
            <p className="text-[0.9rem] leading-relaxed text-muted-ink">{q.helper}</p>
            <div className="space-y-2">
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => (step === 0 ? answerCapability(o.id) : answerMobility(o.id))}
                  className="block w-full border border-line bg-panel-2 px-5 py-4 text-left text-[0.95rem] leading-relaxed text-ivory transition-colors hover:border-accent-blue"
                >
                  {o.label}
                </button>
              ))}
            </div>
            {step === 0 ? (
              <div className="border border-line bg-panel/60 p-5">
                <label htmlFor="dh-free" className="text-[0.8rem] uppercase tracking-[0.22em] text-muted-ink">
                  {CAPABILITY_QUESTION.freeTextLabel}
                </label>
                <textarea
                  id="dh-free"
                  value={free}
                  onChange={(e) => setFree(e.target.value)}
                  rows={2}
                  className="mt-3 w-full resize-none border border-line bg-ink px-4 py-3 text-[0.95rem] text-ivory outline-none focus-visible:border-accent-blue"
                />
                <button
                  type="button"
                  onClick={() => answerCapability(`${FREE_PREFIX}${free.trim()}`)}
                  disabled={free.trim().length === 0}
                  className="mt-3 border border-line px-4 py-2 text-sm text-ivory transition-colors hover:border-accent-blue disabled:opacity-40"
                >
                  Use my own words
                </button>
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <button
                type="button"
                onClick={() => (step === 0 ? answerCapability(SKIPPED) : answerMobility(SKIPPED))}
                className="border border-line px-5 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
              >
                Skip this question
              </button>
              <p className="max-w-sm text-[0.8rem] leading-relaxed text-muted-ink">
                {step === 0 ? CAPABILITY_QUESTION.skipNote : MOBILITY_QUESTION.skipNote}
              </p>
            </div>
          </article>
        ) : null}

        {!pending && step >= 2 && suggestions ? (
          <article className="space-y-5 border border-line bg-panel-2 p-7">
            <p className="az-eyebrow">Suggestion</p>
            {suggestions.map((s) => (
              <div key={s.direction} className="space-y-2">
                <p className="font-display text-lg font-bold capitalize tracking-tight text-ivory">
                  {s.direction}
                </p>
                <p className="text-[0.95rem] leading-relaxed text-muted-ink">{s.reason}</p>
              </div>
            ))}
            <p className="text-[0.85rem] leading-relaxed text-muted-ink">
              {suggestions.length > 1
                ? "Both are highlighted above. The other directions are exactly as available as these."
                : "It is highlighted above. The other directions are exactly as available as this one."}{" "}
              Choose by clicking a card yourself — nothing has been decided for you.
            </p>
            <p className="border-l border-line pl-4 text-[0.8rem] leading-relaxed text-muted-ink">
              This is a suggestion from two answers. You know things about yourself that we do not.
            </p>
            <button
              type="button"
              onClick={restart}
              className="border border-line px-5 py-2.5 text-sm text-ivory transition-colors hover:border-accent-blue"
            >
              Answer again
            </button>
          </article>
        ) : null}
      </div>
    </section>
  );
}
