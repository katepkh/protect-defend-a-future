import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/journey/Placeholder";

export const Route = createFileRoute("/return")({
  head: () => ({
    meta: [
      { title: "Return and reroute — AZIMUTH" },
      { name: "description", content: "Come back weeks later. Check in, ask for a mentor, or take a different pathway without starting over." },
      { property: "og:title", content: "Return and reroute — AZIMUTH" },
      { property: "og:description", content: "Come back weeks later. Check in, ask for a mentor, or take a different pathway without starting over." },
    ],
  }),
  component: ReturnPage,
});

function ReturnPage() {
  return (
    <Placeholder
      step="08"
      title="Return and reroute"
      intro="Come back weeks later. Check in, ask for a mentor, or take a different pathway without starting over."
      next={{ label: "Read our data and ethics statement", to: "/ethics" }}
    />
  );
}
