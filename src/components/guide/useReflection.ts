import { useCallback, useRef, useState } from "react";

/**
 * Streams an AI-written reflection, with an unconditional scripted safety net.
 *
 * If the model has not produced its first characters within FIRST_TOKEN_MS,
 * or anything fails at any point, the scripted reflection is shown instead —
 * silently. No toast, no retry, no spinner that can hang. The in-flight
 * request is left to finish on its own rather than being aborted, so nothing
 * half-generated is thrown away, but its output is simply ignored.
 */
const FIRST_TOKEN_MS = 6000;

export function useReflection() {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const runId = useRef(0);

  const reflect = useCallback(async (question: string, answer: string, fallback: string) => {
    const id = ++runId.current;
    setText("");
    setStreaming(true);

    let settled = false;
    const useFallback = () => {
      if (settled || runId.current !== id) return;
      settled = true;
      setText(fallback);
      setStreaming(false);
    };
    const timer = window.setTimeout(useFallback, FIRST_TOKEN_MS);

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      if (!res.ok || !res.body) throw new Error("no stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        acc += chunk;
        if (settled || runId.current !== id) continue;
        window.clearTimeout(timer);
        setText(acc);
      }
      window.clearTimeout(timer);
      if (runId.current !== id) return;
      if (settled) return;
      settled = true;
      setText(acc.trim().length > 0 ? acc.trim() : fallback);
      setStreaming(false);
    } catch {
      window.clearTimeout(timer);
      useFallback();
    }
  }, []);

  const setScripted = useCallback((value: string) => {
    runId.current += 1;
    setText(value);
    setStreaming(false);
  }, []);

  return { text, streaming, reflect, setScripted };
}