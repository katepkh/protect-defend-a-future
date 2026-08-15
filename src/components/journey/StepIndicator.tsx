import { Link, useRouterState } from "@tanstack/react-router";
import { STEPS } from "@/lib/steps";

export function StepIndicator() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/") return null;

  const currentIndex = STEPS.findIndex((s) => s.path === pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <nav
        aria-label="Journey steps"
        className="mx-auto flex max-w-[1400px] items-center gap-6 px-6 py-3"
      >
        <Link to="/" className="font-display text-sm font-extrabold tracking-[0.28em] text-ivory">
          AZIMUTH
        </Link>
        <ol className="flex flex-1 flex-wrap items-center gap-x-1 gap-y-2">
          {STEPS.map((step, i) => {
            const isCurrent = i === currentIndex;
            const done = currentIndex > -1 && i < currentIndex;
            return (
              <li key={step.path} className="flex items-center">
                <Link
                  to={step.path}
                  aria-current={isCurrent ? "step" : undefined}
                  title={step.name}
                  className={`flex items-center gap-2 rounded-sm px-2 py-1 text-[0.68rem] font-semibold tracking-[0.18em] transition-colors duration-300 ${
                    isCurrent
                      ? "text-accent-blue"
                      : done
                        ? "text-ivory/70 hover:text-ivory"
                        : "text-muted-ink/60 hover:text-muted-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-px w-4 ${isCurrent ? "bg-accent-blue" : done ? "bg-ivory/40" : "bg-line"}`}
                  />
                  {step.n}
                  <span className="hidden xl:inline font-medium tracking-normal">{step.name}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}