import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/journey/Placeholder";

export const Route = createFileRoute("/reality")({
  head: () => ({
    meta: [
      { title: "Understand reality — AZIMUTH" },
      { name: "description", content: "Commitment, risk, language requirements, and legal constraints, stated plainly before you go any further." },
      { property: "og:title", content: "Understand reality — AZIMUTH" },
      { property: "og:description", content: "Commitment, risk, language requirements, and legal constraints, stated plainly before you go any further." },
    ],
  }),
  component: RealityPage,
});

function RealityPage() {
  return (
    <Placeholder
      step="06"
      title="Understand reality"
      intro="Commitment, risk, language requirements, and legal constraints, stated plainly before you go any further."
      next={{ label: "Continue to act", to: "/act" }}
    />
  );
}
