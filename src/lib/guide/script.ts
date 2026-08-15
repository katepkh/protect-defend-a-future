/**
 * The deterministic conversation script.
 *
 * Six fixed questions. The AI layer may only rewrite the *reflection* prose;
 * it never chooses a question, never scores, never decides.
 *
 * Prohibited by construction: political opinion, religious belief, health or
 * medical history — GDPR Article 9 special categories are not asked for here
 * and must never be added to this file.
 */

export type GuideOption = {
  id: string;
  label: string;
  /** Scripted reflection: mirrors the person's own words, never persuades. */
  reflection: string;
};

export type GuideQuestion = {
  id: string;
  eyebrow: string;
  prompt: string;
  helper: string;
  options: GuideOption[];
  freeTextLabel: string;
  /** What is lost — and gained — by skipping. Shown next to the skip control. */
  skipNote: string;
  skipReflection: string;
};

export const SKIPPED = "skipped";
export const FREE_PREFIX = "free:";

export const GUIDE_QUESTIONS: GuideQuestion[] = [
  {
    id: "capability",
    eyebrow: "QUESTION 01 OF 06",
    prompt: "What can you actually do, that you could demonstrate to someone tomorrow?",
    helper: "Not what you are studying towards. What you could show, in its unfinished state, tomorrow.",
    options: [
      {
        id: "c-engineering",
        label: "Engineering — hardware, software, or both",
        reflection:
          "So there is something you could put in front of someone tomorrow and say: I built this. That is a different starting point from wanting to help.",
      },
      {
        id: "c-medical",
        label: "Clinical or medical practice",
        reflection:
          "Clinical practice, then. Something you have done with your hands on real people, under supervision or alone.",
      },
      {
        id: "c-logistics",
        label: "Logistics, driving, trades, practical work",
        reflection:
          "Practical work that either functions or does not. That is easier to demonstrate than most things on this list.",
      },
      {
        id: "c-analysis",
        label: "Analysis, research, languages, writing",
        reflection:
          "Work that lives in judgement rather than in objects. Harder to show in one afternoon, and still real.",
      },
      {
        id: "c-none-yet",
        label: "Honestly, nothing I would call a skill yet",
        reflection:
          "You said it plainly, which is worth something. Some pathways start from willingness and train the rest; several on this list do not, and we will show you both.",
      },
    ],
    freeTextLabel: "Or describe it in your own words",
    skipNote: "Skipping widens the results rather than narrowing them. Nothing is blocked.",
    skipReflection:
      "You skipped that one. We will keep the results wider instead of guessing at an answer for you.",
  },
  {
    id: "time",
    eyebrow: "QUESTION 02 OF 06",
    prompt: "How much time can you realistically commit — honestly rather than optimistically?",
    helper: "The honest number is the useful one. An optimistic number produces a list you cannot act on.",
    options: [
      {
        id: "t-minimal",
        label: "A few hours a week at most",
        reflection:
          "A few hours a week. That is a real constraint, and it removes a lot of this list — which is better than finding out later.",
      },
      {
        id: "t-part",
        label: "Around five to fifteen hours a week",
        reflection:
          "Five to fifteen hours. Enough for sustained remote work, not enough for anything that expects your week.",
      },
      {
        id: "t-most",
        label: "Most of a working week, for a while",
        reflection:
          "Most of a working week, for a while. You have qualified that with 'for a while', and we will hold you to your own qualification.",
      },
      {
        id: "t-full",
        label: "Everything, for as long as it takes",
        reflection:
          "Everything, for as long as it takes. That opens the whole list. It is also the answer people revise most often, and revising it later is allowed.",
      },
    ],
    freeTextLabel: "Or say it in your own words",
    skipNote: "Skipping leaves every commitment level in the results.",
    skipReflection: "Left open. Every commitment level stays in your results, including the demanding ones.",
  },
  {
    id: "reloc",
    eyebrow: "QUESTION 03 OF 06",
    prompt: "Could you relocate, and for how long?",
    helper: "This is a logistics question, not a test of seriousness. Remote contribution is a genuine answer.",
    options: [
      {
        id: "r-none",
        label: "No. I need to contribute from where I am",
        reflection:
          "From where you are, then. That rules out a large part of this list, and leaves a part of it that is real work rather than a consolation.",
      },
      {
        id: "r-short",
        label: "Yes, for up to about three months",
        reflection:
          "Up to about three months. Short deployments exist; long contracts will drop out of your results because you told us they would not fit.",
      },
      {
        id: "r-medium",
        label: "Yes, for up to a year",
        reflection: "Up to a year. That is long enough for most civilian placements and short of most service contracts.",
      },
      {
        id: "r-long",
        label: "Yes, open-ended",
        reflection:
          "Open-ended. Nothing gets filtered out on that basis, which means you will see the heaviest commitments too.",
      },
    ],
    freeTextLabel: "Or describe your situation",
    skipNote: "Skipping keeps both relocation and remote pathways in the results.",
    skipReflection: "Left open, so both relocation and remote pathways stay in your results.",
  },
  {
    id: "lang",
    eyebrow: "QUESTION 04 OF 06",
    prompt: "What languages do you speak, and how well?",
    helper: "Language is the single most common reason a role turns out to be unavailable. It is worth being exact.",
    options: [
      { id: "l-en", label: "English only", reflection: "English only. That is workable in more places than people expect, and closes some doors firmly." },
      {
        id: "l-en-other",
        label: "English plus another European language",
        reflection: "English plus another. Useful in coordination and translation work, less so in the field in Ukraine.",
      },
      {
        id: "l-basic-ua",
        label: "Some Ukrainian or Russian",
        reflection: "Some Ukrainian or Russian. Enough to be understood on a good day, which is how most people describe it.",
      },
      {
        id: "l-fluent-ua",
        label: "Fluent Ukrainian",
        reflection: "Fluent Ukrainian. That removes the constraint that stops most international applicants.",
      },
    ],
    freeTextLabel: "Or list them with your own honest level",
    skipNote: "Skipping keeps language-demanding pathways visible, with their requirement stated on the card.",
    skipReflection:
      "Left open. Language-demanding pathways stay in your results, with the requirement written on each card.",
  },
  {
    id: "risk",
    eyebrow: "QUESTION 05 OF 06",
    prompt: "What level of personal risk are you genuinely prepared to accept?",
    helper: "There is no correct answer here, and no answer here is treated as better than another.",
    options: [
      {
        id: "k-unknown",
        label: "I don't know yet",
        reflection:
          "Not knowing yet is an honest position and we will treat it as one. Nothing is filtered out on this answer, and nothing is assumed about you.",
      },
      {
        id: "k-none",
        label: "None. Nothing physically dangerous",
        reflection: "No physical risk. That is a boundary, and boundaries are the part of this we take literally.",
      },
      {
        id: "k-low",
        label: "Low — a country at war, away from the fighting",
        reflection: "A country at war, away from the fighting. That distinction matters and it holds most of the time, not all of it.",
      },
      {
        id: "k-moderate",
        label: "Moderate — near affected areas, under someone's security rules",
        reflection:
          "Near affected areas, under someone else's security rules. Those rules will constrain you more than you are imagining right now.",
      },
      { id: "k-high", label: "High — including armed service", reflection: "Including armed service. We will show you what that actually involves, including the parts that are rarely said out loud." },
    ],
    freeTextLabel: "Or describe where your line is",
    skipNote: "Skipping filters nothing out. You will see high-risk pathways with their risks stated plainly.",
    skipReflection: "Left open, so nothing is filtered on risk. The risks stay written on every card.",
  },
  {
    id: "blocker",
    eyebrow: "QUESTION 06 OF 06",
    prompt: "What is the single thing most holding you back right now?",
    helper: "This changes nothing in your results. It changes what we tell you about them.",
    options: [
      {
        id: "b-legal",
        label: "Legal status, citizenship, or my own country's law",
        reflection:
          "The legal question. That is the one nobody else can answer for you, and it is the right thing to be stuck on.",
      },
      { id: "b-family", label: "People who depend on me", reflection: "People who depend on you. That is not an obstacle to be argued past; it is a fact to plan around." },
      { id: "b-money", label: "Money — I cannot fund this myself", reflection: "Money. Several of these pathways are paid work and several are not, and we will not blur the two." },
      {
        id: "b-fear",
        label: "Fear, or not knowing whether I could handle it",
        reflection:
          "You said it directly. Doubt is information about your situation, not a flaw in you, and it does not need to be resolved before you look at the list.",
      },
      {
        id: "b-info",
        label: "I simply cannot tell what is real and what is not",
        reflection: "Not being able to tell what is real. That is the thing this whole product exists because of.",
      },
    ],
    freeTextLabel: "Or name it yourself",
    skipNote: "Skipping is fine. This question never affects your results.",
    skipReflection: "Left unsaid. It would not have changed your results either way.",
  },
];

export const GUIDE_QUESTION_BY_ID = new Map(GUIDE_QUESTIONS.map((q) => [q.id, q]));

export const AI_DISCLOSURE =
  "This conversation is generated by an AI model. It does not make decisions about you, and it is not stored anywhere.";

/** Sample answers used by the demo control. */
export const SAMPLE_GUIDE_ANSWERS: Record<string, string> = {
  capability: "c-engineering",
  time: "t-part",
  reloc: "r-none",
  lang: "l-en",
  risk: "k-low",
  blocker: "b-family",
};

export function answerLabel(questionId: string, value: string | undefined): string {
  if (!value || value === SKIPPED) return "Skipped";
  if (value.startsWith(FREE_PREFIX)) return value.slice(FREE_PREFIX.length);
  return GUIDE_QUESTION_BY_ID.get(questionId)?.options.find((o) => o.id === value)?.label ?? value;
}

export function scriptedReflection(questionId: string, value: string | undefined): string {
  const q = GUIDE_QUESTION_BY_ID.get(questionId);
  if (!q) return "";
  if (!value || value === SKIPPED) return q.skipReflection;
  if (value.startsWith(FREE_PREFIX)) {
    const text = value.slice(FREE_PREFIX.length).trim();
    const shortened = text.length > 90 ? `${text.slice(0, 87)}…` : text;
    return `You put it as: “${shortened}”. We will take that in your words rather than translating it into ours.`;
  }
  return q.options.find((o) => o.id === value)?.reflection ?? q.skipReflection;
}