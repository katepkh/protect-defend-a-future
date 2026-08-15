import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { Reveal } from "@/components/journey/Reveal";
import { VerificationBadge } from "@/components/pathways/VerificationBadge";
import { PATHWAYS } from "@/lib/pathways/data";
import { CATEGORY_LABELS, ILLUSTRATIVE_NOTICE } from "@/lib/pathways/types";
import {
  CONSENT,
  LEGAL_SELF_CHECK,
  PREPARE,
  WHAT_USUALLY_HAPPENS,
  buildPlanText,
} from "@/lib/act/plan";
import { useJourney } from "@/state/journey";

export const Route = createFileRoute("/act")({
  head: () => ({
    meta: [
      { title: "Act — PROTECT" },
      { name: "description", content: "Save a plan for yourself, request a conversation with a human, or go directly to the official application." },
      { property: "og:title", content: "Act — PROTECT" },
      { property: "og:description", content: "Save a plan for yourself, request a conversation with a human, or go directly to the official application." },
    ],
  }),
  component: ActPage,
});

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "this evening",
];

const TIMES = ["07:30", "09:00", "12:30", "17:30", "19:00", "21:00"];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12">
      <p className="az-eyebrow">{label}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ActPage() {
  const { journey, update } = useJourney();
  const pathway = PATHWAYS.find((p) => p.id === journey.selectedPathway) ?? null;

  const [day, setDay] = useState(DAYS[0]!);
  const [time, setTime] = useState(TIMES[1]!);
  const [action, setAction] = useState(
    pathway ? pathway.officialNextStepLabel.toLowerCase() : "read the official entry requirements",
  );
  const [saved, setSaved] = useState(false);
  const [human, setHuman] = useState(false);
  const [consent, setConsent] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const sentence = `On ${day} at ${time}, I will ${action.trim() || "…"}.`;
  const planText = useMemo(
    () => (pathway ? buildPlanText({ pathway, sentence }) : ""),
    [pathway, sentence],
  );

  if (!pathway) {
    return (
      <main className="relative px-6 py-24">
        <div className="mx-auto max-w-[1100px]">
          <p className="az-eyebrow">STEP 07 · YOUR NEXT STEP</p>
          <h1 className="az-h2 mt-5 text-ivory">Choose a pathway first.</h1>
          <p className="az-body mt-6 text-muted-ink">
            This page turns one specific pathway into one specific next step. Pick one, read what it
            really asks, and come back.
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link
              to="/pathways"
              className="bg-accent-blue px-7 py-3.5 text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
            >
              See your pathways
            </Link>
            <Link to="/not-ready" className="self-center text-sm text-ivory hover:underline">
              I am not ready
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const consentDetail = CONSENT[pathway.category];

  const savePlan = () => {
    update({ plan: { title: pathway.title, steps: [sentence] } });
    setSaved(true);
  };

  const downloadPlan = () => {
    const blob = new Blob([planText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "protect-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="relative overflow-hidden px-6 py-24">
      <div aria-hidden className="absolute inset-0 opacity-40">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="az-eyebrow">STEP 07 · YOUR NEXT STEP</p>
          <h1 className="az-h2 mt-5 max-w-[20ch] text-ivory">
            Decide the one thing you will actually do.
          </h1>
          <p className="az-body mt-6 text-muted-ink">
            People who name a specific day and time are far more likely to follow through than
            people who intend to act soon. Write it as though you are telling a friend.
          </p>
        </Reveal>

        <div className="mt-12 max-w-[90ch]">
          <Reveal>
            <div className="border border-line bg-panel p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-4 text-[0.95rem] text-muted-ink">
                <span>On</span>
                <select
                  aria-label="Day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="border border-line bg-ink px-4 py-2.5 text-ivory outline-none focus-visible:border-accent-blue"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <span>at</span>
                <select
                  aria-label="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border border-line bg-ink px-4 py-2.5 text-ivory outline-none focus-visible:border-accent-blue"
                >
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span>, I will</span>
              </div>
              <label className="mt-5 block">
                <span className="sr-only">What you will do</span>
                <textarea
                  value={action}
                  rows={2}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full resize-none border border-line bg-ink px-5 py-4 text-[1rem] leading-relaxed text-ivory outline-none focus-visible:border-accent-blue"
                />
              </label>
              <p className="mt-8 font-display text-[1.6rem] font-bold leading-[1.25] tracking-tight text-ivory md:text-[2rem]">
                {sentence}
              </p>
            </div>
          </Reveal>

          <Section label="Your plan">
            <div className="border border-line bg-panel p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-ivory">
                    {pathway.title}
                  </h2>
                  <p className="mt-2 text-[0.92rem] text-muted-ink">
                    {pathway.organisationName} · {CATEGORY_LABELS[pathway.category]}
                  </p>
                </div>
                <VerificationBadge status={pathway.verificationStatus} />
              </div>
              <p className="mt-8 max-w-[62ch] text-[1rem] leading-[1.65] text-ivory/90">
                {sentence}
              </p>

              <p className="az-eyebrow mt-10">Prepare beforehand</p>
              <ul className="mt-4 space-y-3">
                {PREPARE[pathway.category].map((item) => (
                  <li key={item} className="flex max-w-[62ch] gap-4">
                    <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-line" />
                    <span className="text-[0.95rem] leading-relaxed text-muted-ink">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 border border-signal/40 bg-ink p-7">
                <p className="az-eyebrow" style={{ color: "hsl(var(--signal))" }}>
                  You must check this yourself
                </p>
                <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-ivory/90">
                  {LEGAL_SELF_CHECK}
                </p>
              </div>

              <p className="az-eyebrow mt-10">What usually happens next</p>
              <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-muted-ink">
                {WHAT_USUALLY_HAPPENS[pathway.category]}
              </p>
            </div>
          </Section>

          <Section label="Three ways forward, all equal">
            <div className="grid gap-px bg-line md:grid-cols-3">
              <div className="bg-panel p-8">
                <h3 className="font-display text-lg font-bold tracking-tight text-ivory">
                  Save this plan
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-ink">
                  Kept in this browser only. No upload, no server, no email address asked for.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={savePlan}
                    className="border border-line px-5 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
                  >
                    Save to this device
                  </button>
                  <button
                    type="button"
                    onClick={downloadPlan}
                    className="border border-line px-5 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
                  >
                    Download as a text file
                  </button>
                </div>
                {saved ? (
                  <p role="status" className="mt-4 text-[0.85rem] text-verified">
                    Saved here, and nowhere else.
                  </p>
                ) : null}
              </div>

              <div className="bg-panel p-8">
                <h3 className="font-display text-lg font-bold tracking-tight text-ivory">
                  Talk to a person first
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-ink">
                  Some questions should be answered by a human before anything else happens.
                </p>
                <button
                  type="button"
                  onClick={() => setHuman((v) => !v)}
                  aria-expanded={human}
                  className="mt-6 border border-line px-5 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
                >
                  How this would work
                </button>
                {human ? (
                  <div className="mt-5 border-l-2 border-signal/70 pl-5">
                    <p className="text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-signal">
                      Demonstration only. This sends nothing and contacts no one.
                    </p>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-ink">
                      In a real deployment, a named person at the organisation would contact you
                      through their own channel, on their own timetable, and would answer questions
                      before any application existed. PROTECT would not sit in the middle of that
                      conversation, and would not collect your contact details to arrange it — which
                      is why there is no form here.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="bg-panel p-8">
                <h3 className="font-display text-lg font-bold tracking-tight text-ivory">
                  Go to the official application
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-ink">
                  The organisation runs its own process, its own verification, and its own decision.
                </p>
                <button
                  type="button"
                  onClick={() => setLeaving(true)}
                  className="mt-6 bg-accent-blue px-5 py-3 text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
                >
                  {pathway.officialNextStepLabel}
                </button>
              </div>
            </div>
          </Section>

          {leaving ? (
            <Section label="Before you go">
              <div className="border border-line bg-panel p-8 md:p-10">
                <h2 className="az-h2 text-ivory">You are leaving PROTECT.</h2>
                <p className="mt-6 max-w-[62ch] text-[1rem] leading-[1.65] text-muted-ink">
                  Everything from here is handled by the organisation itself. They perform the
                  verification, with a human. PROTECT has sent them nothing about you, and has no
                  role in their decision.
                </p>

                <div className="mt-8 border border-line bg-ink p-7">
                  <p className="az-eyebrow">
                    Consent · {CATEGORY_LABELS[pathway.category]} only
                  </p>
                  <dl className="mt-5 space-y-4">
                    {[
                      ["What would be shared", consentDetail.shared],
                      ["With whom", consentDetail.with],
                      ["For what purpose", consentDetail.purpose],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-ink">
                          {k}
                        </dt>
                        <dd className="mt-1 max-w-[62ch] text-[0.95rem] leading-relaxed text-ivory/90">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 max-w-[62ch] text-[0.9rem] leading-relaxed text-signal/90">
                    Consent given here covers this category alone. It grants nothing to any other
                    category, and military-pathway information is never shared with private
                    companies.
                  </p>
                  <label className="mt-6 flex cursor-pointer items-start gap-4">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-[hsl(var(--accent-blue))]"
                    />
                    <span className="max-w-[62ch] text-[0.95rem] leading-relaxed text-ivory">
                      I have read the above and I want to continue to{" "}
                      {pathway.organisationName} for this pathway only.
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-8">
                  <a
                    href={consent ? pathway.officialNextStepUrl : undefined}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-disabled={!consent}
                    onClick={(e) => {
                      if (!consent) e.preventDefault();
                    }}
                    className={`inline-flex items-center gap-4 bg-accent-blue px-7 py-3.5 text-sm font-semibold text-ivory transition-opacity ${
                      consent ? "hover:opacity-90" : "pointer-events-none opacity-30"
                    }`}
                  >
                    Continue to {pathway.organisationName} <span aria-hidden>↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setLeaving(false)}
                    className="text-sm text-ivory underline-offset-8 hover:underline"
                  >
                    Not yet, take me back
                  </button>
                </div>
              </div>
            </Section>
          ) : null}
        </div>

        <p className="mt-10 max-w-[62ch] text-[0.8rem] leading-relaxed text-signal/90">
          {ILLUSTRATIVE_NOTICE}
        </p>

        <div className="mt-8 flex flex-wrap gap-8">
          <Link
            to="/reality"
            search={{ pathway: pathway.id }}
            className="text-sm text-muted-ink hover:text-ivory"
          >
            Back to what this really means
          </Link>
          <Link to="/return" className="text-sm text-accent-blue hover:underline">
            What happens when I come back later →
          </Link>
          <Link to="/not-ready" className="text-sm text-muted-ink hover:text-ivory">
            I am not ready
          </Link>
        </div>
      </div>
    </main>
  );
}
