import type { ReactNode } from "react";

export function Disclosure({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <details className="group border border-line bg-panel/60">
      <summary className="flex cursor-pointer list-none items-start gap-5 p-7 outline-none focus-visible:ring-2 focus-visible:ring-accent-blue">
        <span aria-hidden className="mt-2 text-muted-ink transition-transform group-open:rotate-90">
          →
        </span>
        <span>
          <span className="block font-display text-lg font-bold tracking-tight text-ivory">
            {label}
          </span>
          <span className="mt-2 block max-w-[62ch] text-[0.92rem] leading-relaxed text-muted-ink">
            {hint}
          </span>
        </span>
      </summary>
      <div className="border-t border-line px-7 py-8">{children}</div>
    </details>
  );
}