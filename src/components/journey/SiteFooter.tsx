import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink px-6 py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="font-display text-sm font-extrabold tracking-[0.3em] text-ivory">
          PROTECT
        </Link>
        <nav aria-label="Footer" className="flex gap-8 text-sm text-muted-ink">
          <Link to="/ethics" className="transition-colors hover:text-ivory">
            Data &amp; ethics
          </Link>
          <Link to="/organisations" className="transition-colors hover:text-ivory">
            Organisations
          </Link>
        </nav>
        <p className="max-w-[40ch] text-xs leading-relaxed text-muted-ink/80">
          A demonstration prototype. Not affiliated with any government or armed force.
        </p>
      </div>
    </footer>
  );
}