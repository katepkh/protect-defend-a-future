import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/journey/Placeholder";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Try a mission — AZIMUTH" },
      { name: "description", content: "One realistic, safe, synthetic task, shaped by the direction you chose. Nothing you do here is submitted anywhere." },
      { property: "og:title", content: "Try a mission — AZIMUTH" },
      { property: "og:description", content: "One realistic, safe, synthetic task, shaped by the direction you chose. Nothing you do here is submitted anywhere." },
    ],
  }),
  component: MissionPage,
});

function MissionPage() {
  return (
    <Placeholder
      step="03"
      title="Try a mission"
      intro="One realistic, safe, synthetic task, shaped by the direction you chose. Nothing you do here is submitted anywhere."
      next={{ label: "Continue to the guide", to: "/guide" }}
    />
  );
}
