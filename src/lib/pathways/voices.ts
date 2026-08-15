import type { PathwayCategory } from "./types";

/**
 * Composite, clearly-labelled illustrations. Not testimonials, not quotes from
 * real people, not evidence. Each category carries one positive and one
 * difficult account, because only showing the first would be dishonest.
 */
export type Voice = { tone: "steady" | "difficult"; text: string };

export const VOICE_NOTICE =
  "Composite illustrations written for this prototype. These are not real people, not testimonials, and not evidence of anything.";

export const VOICES: Record<PathwayCategory, Voice[]> = {
  military: [
    {
      tone: "steady",
      text: "The part nobody warned me about was how ordinary most of it is. Maintenance, waiting, paperwork, waiting again. I found I was useful because I was reliable, not because I was brave.",
    },
    {
      tone: "difficult",
      text: "I signed a contract I could not leave when my mother got ill. That was my own decision and I would make it differently. Read the contract length as if it is the only number on the page.",
    },
  ],
  "defence-tech": [
    {
      tone: "steady",
      text: "It is engineering. Requirements change weekly, the hardware is imperfect, and the deadline is real. I stopped expecting a mission and started shipping small things that worked.",
    },
    {
      tone: "difficult",
      text: "I expected to be at the centre of something. I spent four months on test rigs. The work mattered and it also bored me, and both of those were true at the same time.",
    },
  ],
  humanitarian: [
    {
      tone: "steady",
      text: "Most days are logistics. Lists, vehicles, cold storage, arguing politely with a customs form. The days that are not logistics are the ones you carry home.",
    },
    {
      tone: "difficult",
      text: "I arrived thinking I would help and found I was another person to feed and house. The organisations that turned me away were right to. I came back later with a skill they had asked for.",
    },
  ],
  remote: [
    {
      tone: "steady",
      text: "Two evenings a week, consistently, for a year. Unglamorous and genuinely useful. Consistency turned out to be the whole contribution.",
    },
    {
      tone: "difficult",
      text: "I burned out in six weeks because I treated it as an emergency I personally had to solve. Nobody asked me to do that. Slower would have been worth more.",
    },
  ],
};