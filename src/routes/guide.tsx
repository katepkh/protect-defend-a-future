import { createFileRoute } from "@tanstack/react-router";
import { Graticule } from "@/components/atmosphere/Graticule";
import { GuideConversation } from "@/components/guide/GuideConversation";
import { SAMPLE_GUIDE_ANSWERS } from "@/lib/guide/script";

export const Route = createFileRoute("/guide")({
  validateSearch: (search: Record<string, unknown>) => {
    const out: { sample?: "1"; demo?: "1" } = {};
    if (search["sample"] === "1") out.sample = "1";
    if (search["demo"] === "1") out.demo = "1";
    return out;
  },
  head: () => ({
    meta: [
      { title: "Talk to the guide — PROTECT" },
      { name: "description", content: "A short, autonomy-supportive conversation. The guide asks questions and reflects back what it hears. It never decides for you." },
      { property: "og:title", content: "Talk to the guide — PROTECT" },
      { property: "og:description", content: "A short, autonomy-supportive conversation. The guide asks questions and reflects back what it hears. It never decides for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const search = Route.useSearch();
  return (
    <main className="relative min-h-[calc(100vh-53px)] overflow-hidden px-6 py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30">
        <Graticule />
      </div>
      <div className="relative">
        <GuideConversation {...(search.sample === "1" ? { prefill: SAMPLE_GUIDE_ANSWERS } : {})} />
      </div>
    </main>
  );
}
