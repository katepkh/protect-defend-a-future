import { useEffect, useRef, useState } from "react";

/** Elapsed-seconds timer. No digits are ever shown to the user. */
export function useMissionTimer(running: boolean, duration: number, onExpire: () => void) {
  const [elapsed, setElapsed] = useState(0);
  const start = useRef<number | null>(null);
  const fired = useRef(false);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  useEffect(() => {
    if (!running) return;
    start.current = performance.now();
    fired.current = false;
    const tick = window.setInterval(() => {
      const e = (performance.now() - (start.current ?? 0)) / 1000;
      setElapsed(Math.min(e, duration));
      if (e >= duration && !fired.current) {
        fired.current = true;
        window.clearInterval(tick);
        expire.current();
      }
    }, 100);
    return () => window.clearInterval(tick);
  }, [running, duration]);

  return elapsed;
}
