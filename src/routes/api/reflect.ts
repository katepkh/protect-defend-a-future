import { createFileRoute } from "@tanstack/react-router";

/**
 * Streams a single reflection sentence pair from the Lovable AI gateway.
 *
 * The model writes prose only. It never selects the next question, never
 * scores, and never decides anything about the person. If anything at all
 * goes wrong, this route fails quietly and the client falls back to the
 * scripted reflection with no visible degradation.
 */

const SYSTEM_PROMPT = `You are the reflection voice of TOPROTECT, a calm tool that helps people find where their skills are genuinely useful in supporting Ukraine.

Your only job is to mirror back what the person just said, in the manner of motivational interviewing.

Rules, all absolute:
- Autonomy-supportive. The person decides. You never persuade, encourage, recruit, or nudge anyone toward service or toward any pathway.
- Reflect, do not advise. Mirror their own words and framing rather than replacing them with yours.
- If they express doubt or ambivalence, reflect the doubt as legitimate information. Never argue with it, never reassure it away.
- Never promise or imply any outcome, placement, suitability or fit. Never say anyone would be good at, perfect for, or suited to anything.
- Never ask for or refer to political opinions, religious belief, health or medical history.
- No praise, no flattery, no gratitude, no exclamation marks, no emoji, no questions.
- Two sentences maximum. Plain language. Restrained, serious, unhurried.`;

export const Route = createFileRoute("/api/reflect")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("", { status: 204 });

        let payload: { question?: string; answer?: string };
        try {
          payload = (await request.json()) as { question?: string; answer?: string };
        } catch {
          return new Response("", { status: 204 });
        }
        const question = String(payload.question ?? "").slice(0, 400);
        const answer = String(payload.answer ?? "").slice(0, 600);
        if (!question || !answer) return new Response("", { status: 204 });

        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "openai/gpt-5.6-sol",
              stream: true,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                  role: "user",
                  content: `The guide asked: "${question}"\nThe person answered: "${answer}"\n\nWrite the reflection.`,
                },
              ],
            }),
          });

          if (!upstream.ok || !upstream.body) return new Response("", { status: 204 });

          const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
              const reader = upstream.body!.getReader();
              const decoder = new TextDecoder();
              const encoder = new TextEncoder();
              let buffer = "";
              try {
                for (;;) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop() ?? "";
                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const data = trimmed.slice(5).trim();
                    if (!data || data === "[DONE]") continue;
                    try {
                      const json = JSON.parse(data) as {
                        choices?: { delta?: { content?: string } }[];
                      };
                      const delta = json.choices?.[0]?.delta?.content;
                      if (delta) controller.enqueue(encoder.encode(delta));
                    } catch {
                      /* partial frame, ignore */
                    }
                  }
                }
              } catch {
                /* upstream cut: the client already has its scripted fallback */
              } finally {
                controller.close();
              }
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-store",
            },
          });
        } catch {
          return new Response("", { status: 204 });
        }
      },
    },
  },
});