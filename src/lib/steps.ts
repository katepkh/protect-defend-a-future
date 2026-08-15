export type StepPath =
  | "/"
  | "/direction"
  | "/mission"
  | "/guide"
  | "/pathways"
  | "/reality"
  | "/act"
  | "/return";

export const STEPS: { n: string; name: string; path: StepPath; line: string }[] = [
  {
    n: "01",
    name: "Inspire",
    path: "/",
    line: "Understand the shape of the need before anyone asks anything of you.",
  },
  {
    n: "02",
    name: "Choose a direction",
    path: "/direction",
    line: "Serve, build, support, or explore. Nothing here is a commitment.",
  },
  {
    n: "03",
    name: "Try a mission",
    path: "/mission",
    line: "One realistic, safe, synthetic task. Real work, no consequences.",
  },
  {
    n: "04",
    name: "Talk to the guide",
    path: "/guide",
    line: "A short conversation about what you actually want and can offer.",
  },
  {
    n: "05",
    name: "See your pathways",
    path: "/pathways",
    line: "Three options, each explained. Never a black-box verdict.",
  },
  {
    n: "06",
    name: "Understand reality",
    path: "/reality",
    line: "Commitment, risk, language, and legal constraints, stated plainly.",
  },
  {
    n: "07",
    name: "Act",
    path: "/act",
    line: "Save a plan, ask for a human, or go to the official application.",
  },
  {
    n: "08",
    name: "Return and reroute",
    path: "/return",
    line: "Come back later. Change your mind. Take a different route.",
  },
];

export const ALL_ROUTES = [
  ...STEPS.map((s) => ({ label: `${s.n} ${s.name}`, path: s.path as string })),
  { label: "Ethics", path: "/ethics" },
  { label: "Organisations", path: "/organisations" },
];