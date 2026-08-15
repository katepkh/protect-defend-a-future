import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/journey/Placeholder";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Talk to the guide — AZIMUTH" },
      { name: "description", content: "A short, autonomy-supportive conversation. The guide asks questions and reflects back what it hears. It never decides for you." },
      { property: "og:title", content: "Talk to the guide — AZIMUTH" },
      { property: "og:description", content: "A short, autonomy-supportive conversation. The guide asks questions and reflects back what it hears. It never decides for you." },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <Placeholder
      step="04"
      title="Talk to the guide"
      intro="A short, autonomy-supportive conversation. The guide asks questions and reflects back what it hears. It never decides for you."
      next={{ label: "Continue to your pathways", to: "/pathways" }}
    />
  );
}
