import { Link } from "@tanstack/react-router";

/**
 * The PROTECT wordmark. Archivo, uppercase, wide tracking, always ivory —
 * never the accent colour.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="PROTECT, home"
      className={`font-display font-extrabold uppercase tracking-[0.18em] text-ivory ${className}`}
    >
      PROTECT
    </Link>
  );
}