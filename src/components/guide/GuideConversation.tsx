import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AI_DISCLOSURE,
  FREE_PREFIX,
  GUIDE_QUESTIONS,
  SKIPPED,
  answerLabel,
  scriptedReflection,
} from "@/lib/guide/script";
import { useJourney } from "@/state/journey";
import { useReflection } from "./useReflection";

type Turn = { questionId: string; value: string; reflection: string; earlier?: boolean };

export function GuideConversation({ prefill }: { prefill?: Record<string, string> }) {
  const navigate = useNavigate();
  const { journey, update } = useJourney();
  const [index, setIndex] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [free, setFree] = useState("");
  const [pending, setPending] = useState<{ questionId: string; value: string } | null>(null);
  const { text, streaming, reflect, setScripted } = useReflection();
  const endRef = useRef<HTMLDivElement | null>(null);
  const seeded = useRef(false);

  const question = GUIDE_QUESTIONS[index];
  const done = index >= GUIDE_QUESTIONS.length;

  const answers = useMemo(() => {
    const out: Record<string, string> = {};
    for (const t of turns) out[t.questionId] = t.value;
    return out;
  }, [turns]);

  // Demo control: fill the whole conversation with sample answers.
  useEffect(() => {
    if (!prefill) return;
    const filled = GUIDE_QUESTIONS.filter((q) => prefill[q.id]).map((q) => ({
      questionId: q.id,
      value: prefill[q.id]!,
      reflection: scriptedReflection(q.id, prefill[q.id]),
    }));
    setTurns(filled);
    setIndex(GUIDE_QUESTIONS.length);
    setPending(null);
  }, [prefill]);

  // Answers already given at /direction arrive here already answered, shown as
  // previously given, with a visible way to change them. Nothing is re-asked.
  useEffect(() => {
    if (prefill || seeded.current) return;
    const existing = journey.guideAnswers;
    if (!existing || Object.keys(existing).length === 0) return;
    const filled: Turn[] = [];
    for (const q of GUIDE_QUESTIONS) {
      const v = existing[q.id];
      if (!v) break;
      filled.push({ questionId: q.id, value: v, reflection: scriptedReflection(q.id, v), earlier: true });
    }
    if (filled.length === 0) return;
    seeded.current = true;
    setTurns(filled);
    setIndex(filled.length);
  }, [prefill, journey.guideAnswers]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, pending, done]);

  const answer = (value: string) => {
    if (!question || pending) return;
    const fallback = scriptedReflection(question.id, value);
    setPending({ questionId: question.id, value });
    setFree("");
    if (value === SKIPPED) {
      setScripted(fallback);
    } else {
      void reflect(question.prompt, answerLabel(question.id, value), fallback);
    }
  };

  const advance = () => {
    if (!pending) return;
    setTurns((prev) => [...prev, { ...pending, reflection: text || scriptedReflection(pending.questionId, pending.value) }]);
    setPending(null);
    setScripted("");
    setIndex((i) => i + 1);
  };

  const finish = () => {
    update({ guideAnswers: answers });
    void navigate({ to: "/pathways" });
  };

  return (
    <div className="mx-auto max-w-[62ch]">
      <p className="az-eyebrow">STEP 04</p>
      <h1 className="az-h2 mt-5 text-ivory">Talk to the guide</h1>
      <p className="az-body mt-6 text-muted-ink">
        Six questions. Every one of them can be skipped, and skipping widens your results rather
        than blocking them. The guide reflects back what you say. It does not decide anything.
      </p>
      <p className="mt-4 border-l border-line pl-4 text-[0.8rem] leading-relaxed text-muted-ink">
        {AI_DISCLOSURE}
      </p>

      <div className="mt-16 space-y-14">
        {turns.map((t, ti) => {
          const q = GUIDE_QUESTIONS.find((x) => x.id === t.questionId)!;
          return (
            <article key={t.questionId} className="az-turn space-y-4 opacity-60">
              <p className="text-[0.95rem] leading-relaxed text-muted-ink">{q.prompt}</p>
              <p className="border-l-2 border-accent-blue/60 pl-4 text-[0.95rem] leading-relaxed text-ivory">
                {answerLabel(t.questionId, t.value)}
              </p>
              <p className="text-[0.95rem] leading-relaxed text-muted-ink">{t.reflection}</p>
              {t.earlier ? (
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-[0.8rem] uppercase tracking-[0.22em] text-muted-ink">
                    Answered earlier
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTurns((prev) => prev.slice(0, ti));
                      setIndex(ti);
                      setPending(null);
                      setScripted("");
                    }}
                    className="border border-line px-4 py-2 text-sm text-ivory transition-colors hover:border-accent-blue"
                  >
                    Change this answer
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}

        {pending ? (
          <article className="az-turn space-y-5">
            <p className="border-l-2 border-accent-blue pl-4 text-[0.95rem] leading-relaxed text-ivory">
              {answerLabel(pending.questionId, pending.value)}
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
              {index + 1 >= GUIDE_QUESTIONS.length ? "Finish" : "Next question"}
            </button>
          </article>
        ) : null}

        {!pending && question ? (
          <article key={question.id} className="az-turn space-y-6">
            <p className="az-eyebrow">{question.eyebrow}</p>
            <h2 className="font-display text-[1.6rem] leading-tight tracking-[-0.02em] text-ivory">
              {question.prompt}
            </h2>
            <p className="text-[0.9rem] leading-relaxed text-muted-ink">{question.helper}</p>
            <div className="space-y-2">
              {question.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => answer(o.id)}
                  className="block w-full border border-line bg-panel px-5 py-4 text-left text-[0.95rem] leading-relaxed text-ivory transition-colors hover:border-accent-blue"
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="border border-line bg-panel/60 p-5">
              <label
                htmlFor={`free-${question.id}`}
                className="text-[0.8rem] uppercase tracking-[0.22em] text-muted-ink"
              >
                {question.freeTextLabel}
              </label>
              <textarea
                id={`free-${question.id}`}
                value={free}
                onChange={(e) => setFree(e.target.value)}
                rows={2}
                className="mt-3 w-full resize-none border border-line bg-ink px-4 py-3 text-[0.95rem] text-ivory outline-none focus-visible:border-accent-blue"
              />
              <button
                type="button"
                onClick={() => answer(`${FREE_PREFIX}${free.trim()}`)}
                disabled={free.trim().length === 0}
                className="mt-3 border border-line px-4 py-2 text-sm text-ivory transition-colors hover:border-accent-blue disabled:opacity-40"
              >
                Use my own words
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <button
                type="button"
                onClick={() => answer(SKIPPED)}
                className="border border-line px-5 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
              >
                Skip this question
              </button>
              <p className="max-w-sm text-[0.8rem] leading-relaxed text-muted-ink">
                {question.skipNote}
              </p>
            </div>
          </article>
        ) : null}

        {done ? (
          <article className="az-turn space-y-6 border border-line bg-panel p-8">
            <p className="az-eyebrow">End of the conversation</p>
            <p className="text-[1.05rem] leading-relaxed text-ivory">
              That is everything we ask. What happens next is a deterministic rule engine, not a
              model: it uses only the answers you gave and the signals from the task you tried, and
              it will show you what it excluded and why.
            </p>
            <p className="text-[0.9rem] leading-relaxed text-muted-ink">
              {Object.keys(answers).filter((k) => answers[k] !== SKIPPED).length} of{" "}
              {GUIDE_QUESTIONS.length} questions answered
              {journey.missionCompleted
                ? ", plus the capability signals from your mission."
                : ". You did not do a mission, so no capability signals are in play."}
            </p>
            <button
              type="button"
              onClick={finish}
              className="border border-accent-blue bg-accent-blue/10 px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-accent-blue/20"
            >
              See your pathways
            </button>
          </article>
        ) : null}
      </div>

      <div ref={endRef} />

      <div className="mt-20 border-t border-line pt-6">
        <Link
          to="/not-ready"
          className="text-sm text-muted-ink underline decoration-line underline-offset-4 transition-colors hover:text-ivory"
        >
          I'm not ready to continue
        </Link>
      </div>
    </div>
  );
}