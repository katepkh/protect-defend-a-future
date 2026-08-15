import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/journey/Placeholder";

export const Route = createFileRoute("/pathways")({
  head: () => ({
    meta: [
      { title: "See your pathways — PROTECT" },
      { name: "description", content: "Three transparent options with honest trade-offs, each explained in plain language. Never a black-box verdict." },
      { property: "og:title", content: "See your pathways — PROTECT" },
      { property: "og:description", content: "Three transparent options with honest trade-offs, each explained in plain language. Never a black-box verdict." },
    ],
  }),
  component: PathwaysPage,
});

function PathwaysPage() {
  return (
    <Placeholder
      step="05"
      title="See your pathways"
      intro="Three transparent options with honest trade-offs, each explained in plain language. Never a black-box verdict."
      next={{ label: "Continue to reality", to: "/reality" }}
    />
  );
}
