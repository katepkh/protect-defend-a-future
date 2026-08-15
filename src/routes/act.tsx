import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/journey/Placeholder";

export const Route = createFileRoute("/act")({
  head: () => ({
    meta: [
      { title: "Act — AZIMUTH" },
      { name: "description", content: "Save a plan for yourself, request a conversation with a human, or go directly to the official application." },
      { property: "og:title", content: "Act — AZIMUTH" },
      { property: "og:description", content: "Save a plan for yourself, request a conversation with a human, or go directly to the official application." },
    ],
  }),
  component: ActPage,
});

function ActPage() {
  return (
    <Placeholder
      step="07"
      title="Act"
      intro="Save a plan for yourself, request a conversation with a human, or go directly to the official application."
      next={{ label: "See how returning works", to: "/return" }}
    />
  );
}
