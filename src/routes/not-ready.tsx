import { createFileRoute, Link } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";

export const Route = createFileRoute("/not-ready")({
  head: () => ({
    meta: [
      { title: "Not right now — AZIMUTH" },
      {
        name: "description",
        content:
          "Stopping is a legitimate answer. Nothing was saved from the conversation, and nothing follows you.",
      },
      { property: "og:title", content: "Not right now — AZIMUTH" },
      {
        property: "og:description",
        content: "Stopping is a legitimate answer. Nothing was saved, and nothing follows you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotReadyPage,
});

function NotReadyPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-53px)] items-center overflow-hidden px-6 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
        <Graticule />
      </div>
      <div className="relative mx-auto max-w-[52ch]">
        <p className="az-eyebrow">Stopped</p>
        <h1 className="az-h2 mt-5 text-ivory">Not right now.</h1>
        <p className="az-body mt-8 text-muted-ink">
          That is a complete answer and it needs no explanation. Nothing from the conversation was
          saved. No account exists, no message is sent, and nobody is told you were here.
        </p>
        <p className="az-body mt-5 text-muted-ink">
          Thank you for looking properly rather than deciding quickly.
        </p>
        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            to="/"
            className="border border-line px-6 py-3 text-sm text-ivory transition-colors hover:border-accent-blue"
          >
            Back to the start
          </Link>
          <Link
            to="/guide"
            className="border border-line px-6 py-3 text-sm text-muted-ink transition-colors hover:border-accent-blue hover:text-ivory"
          >
            Return to the conversation
          </Link>
        </div>
      </div>
    </main>
  );
}