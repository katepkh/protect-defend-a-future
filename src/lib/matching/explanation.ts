/**
 * Displayed verbatim in the UI. This is the answer to "is this a black box?".
 */
export const ALGORITHM_EXPLANATION = {
  title: "How this list was produced",
  intro:
    "No model ranked you. This is a fixed set of rules, written down, running in your browser. The same answers always produce the same list, and you can read every step of it below.",
  steps: [
    {
      heading: "1. Only what you said is used",
      body: "The engine reads two things: the answers you gave the guide, and the capability signals from the mission you tried. Nothing is inferred about your character, your suitability, or your commitment. There is no personality model here, because there is no defensible way to build one.",
    },
    {
      heading: "2. Hard filters run first, and only from your own constraints",
      body: "Relocation, hours available, language, and the level of risk you said you are prepared to accept. A pathway is removed only when it conflicts with something you stated yourself. Anything you skipped filters nothing — skipping widens the list. Anything you wrote in your own words is never parsed into a filter, because guessing at your meaning would be exactly the kind of silent inference this product refuses to make.",
    },
    {
      heading: "3. What survives is scored on three visible measures",
      body: "Signal fit, up to 60 points, from the capability signals a mission legitimately observed. Commitment fit, up to 25, comparing the hours a pathway needs against the hours you said you have. Category preference, up to 15, for the direction you chose yourself at step 02. Every point that lands on a pathway is written out as a sentence you can read on its card.",
    },
    {
      heading: "4. A signal that was not observed scores nothing, not zero",
      body: "If the mission you tried could not observe a signal, it is left unset and contributes nothing in either direction. It is never treated as a low score.",
    },
    {
      heading: "5. Everything excluded is shown to you, with its reason",
      body: "The excluded list is part of the result, not a debug view. Each entry names the answer that removed it. Change that answer and the pathway comes back.",
    },
    {
      heading: "6. Fewer than three is a valid answer",
      body: "If your constraints leave one pathway, you get one pathway and a sentence saying so. The list is never padded to look fuller than it is.",
    },
  ],
  article22:
    "This is a deliberate GDPR Article 22 design decision. There is no automated decision-making about you here: the engine is deterministic and rule-based, every contribution is auditable, no result qualifies or disqualifies you from anything, and the decision at the end of it is yours. The AI in this product writes explanatory prose only. It never ranks, never scores, and never chooses.",
} as const;