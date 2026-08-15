import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { VerificationBadge } from "./VerificationBadge";
import { CATEGORY_LABELS } from "@/lib/pathways/types";
import { REJECTION_LABELS, type RejectionDimension } from "@/lib/matching/types";
import type { RankedPathway } from "@/lib/matching/types";

const RISK_WORDS: Record<string, string> = {
  none: "No ordinary physical risk",
  low: "Low physical risk",
  moderate: "Moderate physical risk",
  high: "High physical risk",
};

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink p-5">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-ink">
        {label}
      </p>
      <p className="mt-2 text-[0.9rem] leading-snug text-ivory">{value}</p>
    </div>
  );
}

export function PathwayCard({
  ranked,
  index,
  onReject,
}: {
  ranked: RankedPathway;
  index: number;
  onReject: (dimension: RejectionDimension) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const p = ranked.pathway;

  return (
    <article className="border border-line bg-panel">
      <div className="border-b border-line p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="az-eyebrow">
              {String(index + 1).padStart(2, "0")} · {CATEGORY_LABELS[p.category]}
            </p>
            <h2 className="az-h2 mt-4 max-w-[24ch] text-ivory">{p.title}</h2>
            <p className="mt-3 text-[0.95rem] text-muted-ink">
              {p.organisationName} · {p.location}
            </p>
          </div>
          <VerificationBadge status={p.verificationStatus} />
        </div>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Fact
          label="Commitment"
          value={`${p.commitmentMonths.min}–${p.commitmentMonths.max} months`}
        />
        <Fact label="Hours" value={`${p.hoursPerWeek.min}–${p.hoursPerWeek.max} per week`} />
        <Fact label="Language" value={p.languageRequirement.label} />
        <Fact label="Risk" value={RISK_WORDS[p.riskBand] ?? p.riskBand} />
      </div>

      <div className="grid gap-px bg-line md:grid-cols-2">
        <div className="bg-panel p-8 md:p-10">
          <p className="az-eyebrow">Why this appeared</p>
          <ul className="mt-6 space-y-5">
            {ranked.lines.map((l) => (
              <li key={l.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.92rem] text-ivory">{l.label}</span>
                  <span className="font-display text-xs tracking-[0.18em] text-muted-ink">
                    +{l.points}
                  </span>
                </div>
                <div aria-hidden className="mt-2 h-px w-full bg-line">
                  <div
                    className="h-px bg-accent-blue"
                    style={{ width: `${Math.min(100, (l.points / 60) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 max-w-[52ch] text-[0.85rem] leading-relaxed text-muted-ink">
                  {l.reason}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-panel p-8 md:p-10">
          <p className="az-eyebrow" style={{ color: "hsl(var(--signal))" }}>
            The unflattering part
          </p>
          <ul className="mt-6 space-y-4">
            {[...p.honestRisks, ...p.honestLimitations].slice(0, 4).map((r) => (
              <li key={r} className="flex max-w-[52ch] gap-4">
                <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-signal/70" />
                <span className="text-[0.9rem] leading-relaxed text-ivory/90">{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[52ch] text-[0.85rem] leading-relaxed text-muted-ink">
            <span className="text-ivory">What this is not: </span>
            {p.whatItIsNot}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-8 border-t border-line p-8 md:px-10">
        <Link
          to="/reality"
          search={{ pathway: p.id }}
          className="inline-flex items-center gap-4 bg-accent-blue px-7 py-3.5 text-sm font-semibold tracking-wide text-ivory transition-opacity hover:opacity-90"
        >
          Understand what this really means <span aria-hidden>→</span>
        </Link>
        <button
          type="button"
          onClick={() => setRejecting((v) => !v)}
          aria-expanded={rejecting}
          className="text-sm text-ivory underline-offset-8 transition-colors hover:underline"
        >
          This does not fit me
        </button>
      </div>

      {rejecting ? (
        <div className="border-t border-line bg-panel-2 p-8 md:px-10">
          <p className="max-w-[62ch] text-[0.92rem] leading-relaxed text-muted-ink">
            Tell us what does not fit, and the list is rebuilt with that as a constraint you set.
            Nothing about you is recorded, and you can undo it at the top of the page.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {(Object.keys(REJECTION_LABELS) as RejectionDimension[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setRejecting(false);
                  onReject(d);
                }}
                className="border border-line px-5 py-3 text-left text-[0.85rem] text-ivory transition-colors hover:border-accent-blue"
              >
                {REJECTION_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}