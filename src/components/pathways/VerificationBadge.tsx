import { VERIFICATION_MEANING } from "@/lib/pathways/organisations";
import type { VerificationStatus } from "@/lib/pathways/types";

const TONE: Record<VerificationStatus, string> = {
  verified: "border-verified/50 text-verified",
  listed: "border-line text-muted-ink",
  unverified: "border-signal/50 text-signal",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const meaning = VERIFICATION_MEANING[status];
  return (
    <span className="group relative inline-block">
      <span
        tabIndex={0}
        role="button"
        aria-label={`${meaning.label}. ${meaning.means} ${meaning.doesNotMean}`}
        className={`inline-flex cursor-help items-center gap-2 border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${TONE[status]}`}
      >
        {meaning.label}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-[34ch] border border-line bg-panel p-4 text-[0.8rem] leading-relaxed text-muted-ink shadow-2xl group-hover:block group-focus-within:block"
      >
        <span className="block text-ivory">{meaning.means}</span>
        <span className="mt-2 block text-signal">{meaning.doesNotMean}</span>
      </span>
    </span>
  );
}