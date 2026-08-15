import type { Pathway, PathwayCategory } from "@/lib/pathways/types";

/** What is worth having ready before the official process starts. */
export const PREPARE: Record<PathwayCategory, string[]> = {
  military: [
    "Your passport, and any military or professional service record you hold.",
    "An honest written account of your own medical fitness, kept by you and given only to the organisation if it asks.",
    "A settled answer to: how long can I be away, and who depends on me while I am.",
    "Questions worth asking them: contract length, what happens if I want to leave, and what my legal status is as a foreign national.",
  ],
  "defence-tech": [
    "A one-page summary of what you have actually built, with the boring parts included.",
    "Your right-to-work status for the country the company operates from.",
    "A check on export-control and dual-use rules in your own country before you write any code.",
    "Questions worth asking them: what will I actually be allowed to see, and who owns what I make.",
  ],
  humanitarian: [
    "Professional registration or qualification documents, and their validity abroad.",
    "Any security or first-aid training certificates you already hold.",
    "A realistic view of your own funding: many roles are unpaid or barely covered.",
    "Questions worth asking them: who is responsible for my security, and what is the evacuation plan.",
  ],
  remote: [
    "A short note on the hours you can genuinely sustain each week, for months, not for one enthusiastic fortnight.",
    "A working setup you control: your own machine, your own accounts, sensible passwords.",
    "An honest language self-assessment, without rounding up.",
    "Questions worth asking them: what happens to the work if I stop, and who reviews it.",
  ],
};

/** Realistic, uncertain, never a promise. */
export const WHAT_USUALLY_HAPPENS: Record<PathwayCategory, string> = {
  military:
    "Typically an initial contact, then a long gap, then documentation and in-person stages that take weeks rather than days. Delays are normal and are not a signal about you. Nothing is decided until the official structure decides it, and it may decide no.",
  "defence-tech":
    "Usually a screening conversation, then a technical exchange, then a slow legal and access process. Weeks is common. Many applications get no reply at all, which is a property of small overloaded teams rather than a judgement.",
  humanitarian:
    "Often a roster or registration step first, then a wait until a specific need matches you. That wait can be months, and it can end with nothing. Organisations deploy against needs, not against willingness.",
  remote:
    "Frequently the fastest to start and the easiest to drift out of. Expect a light onboarding within days or weeks, and expect the work itself to be smaller and more repetitive than it sounded.",
};

/** Per-category consent. Nothing is ever pre-ticked, and one grants nothing to another. */
export const CONSENT: Record<PathwayCategory, { shared: string; with: string; purpose: string }> = {
  military: {
    shared:
      "Only what you type into the official form on their site. PROTECT sends nothing at all: your answers, your mission result and your plan stay in this browser.",
    with: "Ukraine's official recruitment structures only.",
    purpose:
      "So the authorised body can run its own process. This consent covers military service alone and grants nothing to any private company, in this category or any other.",
  },
  "defence-tech": {
    shared:
      "Only what you submit directly to the company's own channel. PROTECT transmits nothing on your behalf.",
    with: "The private defence-technology company you choose to contact.",
    purpose:
      "So a commercial employer can consider you under its own hiring rules. It covers this category only, and nothing from a military pathway is ever included.",
  },
  humanitarian: {
    shared: "Only what you enter into the organisation's own registration or roster form.",
    with: "The civilian humanitarian or medical organisation you choose to contact.",
    purpose:
      "So a civilian organisation can assess a specific need under its own safeguarding rules. Separate from every other category.",
  },
  remote: {
    shared: "Only what you enter into the platform's own sign-up.",
    with: "The volunteer coordination platform you choose to contact.",
    purpose:
      "So a coordinator can give you a task. Separate from every other category, and revocable by simply stopping.",
  },
};

export const LEGAL_SELF_CHECK =
  "Check the law of your own country of citizenship before you act. Serving in, or working for, a foreign armed force or defence industry can carry criminal liability, loss of citizenship, loss of security clearance, insurance invalidity or travel consequences, and the rules differ sharply between countries. PROTECT does not and cannot advise you on this, and nothing on this page is legal advice.";

export function buildPlanText(input: {
  pathway: Pathway;
  sentence: string;
}): string {
  const { pathway: p, sentence } = input;
  const lines = [
    "PROTECT — your plan",
    "There is more than one way to defend a future.",
    "",
    `Pathway: ${p.title}`,
    `Organisation: ${p.organisationName} (${p.verificationStatus})`,
    `Commitment: ${p.commitmentMonths.min}-${p.commitmentMonths.max} months, ${p.hoursPerWeek.min}-${p.hoursPerWeek.max} hours per week`,
    `Language: ${p.languageRequirement.label}`,
    "",
    "YOUR NEXT STEP",
    sentence,
    "",
    "PREPARE BEFOREHAND",
    ...PREPARE[p.category].map((s) => `- ${s}`),
    "",
    "CHECK FOR YOURSELF",
    LEGAL_SELF_CHECK,
    "",
    "WHAT USUALLY HAPPENS NEXT",
    WHAT_USUALLY_HAPPENS[p.category],
    "",
    "OFFICIAL NEXT STEP",
    `${p.officialNextStepLabel}: ${p.officialNextStepUrl}`,
    "",
    "Organisation details in this prototype are illustrative and must be re-verified against official sources before any real deployment.",
    "This file was generated in your browser. Nothing was uploaded.",
  ];
  return lines.join("\n");
}