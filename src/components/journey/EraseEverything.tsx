import { useState } from "react";
import { useJourney } from "@/state/journey";

/**
 * Proof of the privacy claim rather than a promise about it. Clears every
 * PROTECT key from this browser and says exactly what went.
 */
export function EraseEverything({ className = "" }: { className?: string }) {
  const { reset } = useJourney();
  const [erased, setErased] = useState<string[] | null>(null);

  const erase = () => {
    const removed: string[] = [];
    try {
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith("protect.")) {
          localStorage.removeItem(key);
          removed.push(key);
        }
      }
    } catch {
      /* storage unavailable: nothing was ever stored either */
    }
    reset();
    setErased(removed);
  };

  return (
    <div className={`border border-line bg-panel p-8 md:p-10 ${className}`}>
      <p className="az-eyebrow">Your data, on your device</p>
      <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-muted-ink">
        Everything PROTECT holds about you is in this browser&rsquo;s local storage. There is no
        account and no copy anywhere else, so erasing it here erases it entirely.
      </p>
      <button
        type="button"
        onClick={erase}
        className="mt-7 border border-signal/60 px-6 py-3 text-sm font-semibold text-signal transition-colors hover:bg-signal/10"
      >
        Erase everything stored on this device
      </button>
      {erased ? (
        <div role="status" className="mt-6 border-l-2 border-verified pl-5">
          <p className="text-[0.95rem] text-ivory">
            {erased.length === 0
              ? "Nothing was stored, so nothing had to be removed."
              : `Removed ${erased.length} stored item${erased.length === 1 ? "" : "s"}, and reset the journey in this tab.`}
          </p>
          {erased.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {erased.map((k) => (
                <li key={k} className="font-mono text-[0.78rem] text-muted-ink">
                  {k}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}