# Azimuth Compass

Build the foundation of a cinematic, serious web product called **AZIMUTH**.

Tagline: **"There is more than one way to defend democracy."**

## What AZIMUTH is
A trusted, experiential gateway for international supporters of Ukraine. Most people who want to help have no idea where their skills are actually useful, which organisations are legitimate, or what commitment and risk each pathway really involves. Existing sites start at a vacancy list or an application form. AZIMUTH starts earlier: it lets a person *try* a realistic, safe, synthetic task, then talks with them, then shows three transparent pathways with honest trade-offs, then hands them to the official process.

It is NOT a recruitment dashboard, NOT an ATS, NOT a CRM. There is no recruiter view, no applicant pipeline, no candidate scoring leaderboard. The user is always the person deciding, never the object being processed.

## The eight-step journey (this is the product spine — build the routing for all eight now, even if later steps are placeholders in this first pass)
1. `/` **Inspire** — landing
2. `/direction` **Choose a direction** — Serve / Build / Support / Explore
3. `/mission` **Try a mission** — one realistic, safe, synthetic task
4. `/guide` **Talk to the guide** — brief autonomy-supportive AI conversation
5. `/pathways` **See your pathways** — three explained options, never a black-box verdict
6. `/reality` **Understand reality** — commitment, risk, language, legal constraints
7. `/act` **Act** — save a plan, request a human, or go to the official application
8. `/return` **Return and reroute** — check-in, mentor, alternative pathway

Plus `/ethics` (data & ethics statement) and `/organisations` (verified organisation registry).

## THIS FIRST PASS — build exactly these things, and build them beautifully
1. The full design system and global styles
2. The app shell: routing for all 10 routes, a persistent journey state, a step indicator
3. The `/` landing page — finished, cinematic, the thing that makes a judge sit up
4. The `/direction` page — finished
5. All other routes as clean, on-brand "Coming next" placeholders with correct headings
6. A hidden demo control (described below)

---

## DESIGN SYSTEM — this matters more than anything else. Get this right.

Reference feeling: Helsing's website. Restrained, confident, expensive, serious. Awe + belonging + agency + gravity. Never militaristic kitsch, never a video game, never a charity pity-appeal.

**Colour tokens (define in `index.css` as HSL CSS variables and wire into `tailwind.config.ts` — do not hardcode hex in components):**
- `--ink` #060A11 — deepest background
- `--panel` #0D1420 — raised surface
- `--panel-2` #151E2C — cards
- `--line` #223046 — hairline borders
- `--ivory` #F2EFE8 — primary text
- `--muted` #90A0B6 — secondary text
- `--accent` #3D7BFF — a single controlled Ukrainian-blue accent. Use it sparingly: one primary action per screen.
- `--signal` #E0A458 — warm amber, reserved EXCLUSIVELY for honesty markers: risks, limitations, legal warnings, "this is hard" content. Never decorative.
- `--verified` #4FBF8B — verification badges only.

Dark by default. There is no light mode.

**Typography:** Load from Google Fonts. Display = **Archivo** (weights 600/700/800), body = **Inter** (400/500).
- Hero headline: clamp(2.75rem, 7vw, 6rem), weight 800, letter-spacing -0.03em, line-height 0.98
- Section headings: clamp(1.75rem, 3.5vw, 3rem), weight 700, tracking -0.02em
- Eyebrow labels: 0.7rem, weight 600, uppercase, letter-spacing 0.22em, colour `--muted`
- Body: 1.0625rem, line-height 1.65, max-width 62ch
Short sentences. Generous empty space. Never a wall of text.

**CRITICAL — no external image assets.** Do not use Unsplash, any CDN, any remote image URL, or any placeholder image service. Every visual must be generated in code so nothing can ever fail to load during a live demo. Build the atmosphere from:
- layered CSS radial and linear gradients (deep blue-black horizon glows)
- inline SVG topographic contour lines and terrain ridge silhouettes, drawn with paths, low opacity, layered for depth
- an SVG `feTurbulence` film-grain overlay at ~4% opacity across the whole app
- a very slow (40–60s) drifting gradient animation behind the hero
- thin hairline grid / coordinate-graticule SVG overlays at very low opacity, evoking a navigation chart

**Motion:** slow, atmospheric, cinematic. Fade-and-rise on scroll (IntersectionObserver, 600–800ms, ease-out, 20px travel). No bounce, no spring, no confetti, no parallax gimmicks. Respect `prefers-reduced-motion` and disable all motion when set.

**Forbidden visual vocabulary:** skulls, crosshairs, weapons, explosions, camo texture, flag-waving, stock "hero soldier" clichés, points, badges, streaks, XP, confetti, progress-gamification of any kind.

---

## PAGE 1 — `/` Inspire (build this to a finished, portfolio standard)

**Hero (full viewport height):**
- Background: the layered gradient + terrain-ridge SVG + graticule + grain system described above. Slow drift.
- Eyebrow: `INTERNATIONAL CONTRIBUTION TO UKRAINE'S DEFENCE`
- Headline: **There is more than one way to defend democracy.**
- Sub (max 58ch, `--muted`): "Thousands of people outside Ukraine want to help and do not know where they are actually useful. AZIMUTH lets you try the work, understand what it really costs, and find the pathway that genuinely fits you."
- Primary button: **Find your direction** → `/direction`
- Quiet secondary text link: "How this works" → smooth-scrolls to the process section
- A slow, subtle scroll-cue at the bottom.

**Section 2 — "The problem", three columns, restrained:**
- "You want to help." — "Engineers, medics, analysts, logisticians, translators, pilots, welders. The need is enormous and specific."
- "You cannot tell what is real." — "Dozens of channels, unclear legitimacy, contradictory information, and no way to know which opportunities are verified."
- "So nothing happens." — "Most people close the tab. Intent that never becomes action helps no one."

**Section 3 — "How this works", the eight steps** rendered as a vertical timeline with a hairline connector, each step numbered 01–08 with its name and one honest sentence. Use the eight step names above.

**Section 4 — the honesty panel.** Bordered in `--signal` at low opacity, `--panel` background. Heading: **What we will not do.** Four short lines:
- "We will not tell you that serving is the right choice for you. That is yours to decide."
- "We will not hide the risk, the language requirements, or the legal consequences."
- "We will not perform background checks. Verification is done by the authorised organisation, by a human."
- "We will not pass your military application to a private company. Those pathways are kept separate."

**Section 5 — closing call.** Large centred type: "Start where you are." Button → `/direction`. Below it, small `--muted` text: "Takes about six minutes. You can stop at any point, and nothing is submitted anywhere."

**Footer:** minimal. AZIMUTH wordmark, links to `/ethics` and `/organisations`, and the line "A demonstration prototype. Not affiliated with any government or armed force."

---

## PAGE 2 — `/direction` Choose a direction

Heading: **Where do you want to start?**
Sub: "This is not a commitment. It only shapes the first task you will try — and you can change it at any point."

Four large cards in a responsive grid (2×2 on desktop, stacked on mobile). Each card: an inline-SVG line icon drawn in code, a title, one line of description, and a small honest note in `--muted`. On hover: hairline border shifts to `--accent`, background lifts slightly, 300ms ease.

1. **Serve** — "Military service in Ukraine's forces." Note: "Most international units recruit light infantry. Language and eligibility constraints are real, and we will show them to you plainly."
2. **Build** — "Defence technology, engineering, and analysis." Note: "Ukraine's defence-tech cluster spans thousands of companies. Some roles are remote."
3. **Support** — "Humanitarian, medical, and civilian resilience." Note: "Often the largest need, and the pathway most people overlook."
4. **Explore** — "You are not sure yet." Note: "A completely legitimate answer. Start here and decide later."

Below the cards, a quiet full-width row: **"I am not ready to choose."** → a calm panel offering to just show how the pathways work with no personal input. This option must be as visually dignified as the other four — never greyed out, never framed as failure.

Selecting a direction stores it in journey state and routes to `/mission`.

---

## APP SHELL & STATE

- **Journey state**: a React context (`JourneyProvider`) holding `{ direction, missionResults, guideAnswers, capabilitySignals, selectedPathway, acknowledgedReality, plan, checkIn }`, persisted to `localStorage` under key `azimuth.journey.v1`, with a `reset()` action. No backend, no authentication, no login. Everything stays in the browser — this is a deliberate privacy decision and we will state it in the UI.
- **Step indicator**: a slim persistent header showing the eight steps as small numbered ticks with the current one in `--accent`. Hidden on `/`. Completed steps are clickable to go back. Never blocks forward navigation.
- **Demo control (essential for a live presentation)**: press `D` three times, or visit `?demo=1`, to open a small fixed panel in the bottom-right that lists all ten routes as jump buttons, plus "Load sample journey" (fills journey state with a realistic completed example), "Simulate 14 days later" (sets a flag that unlocks `/return`), and "Reset". Styled subtly, never visible unless triggered.
- Fully responsive. Optimise especially for 1280–1920px laptop and projector display.
- Accessible: real semantic landmarks, visible focus rings in `--accent`, keyboard-navigable cards, AA contrast throughout.

## TECH
React + TypeScript + Tailwind + shadcn/ui + react-router. Keep components small and in sensible folders (`components/atmosphere/`, `components/journey/`, `pages/`, `lib/`, `state/`). Put all copy in the components directly — no i18n layer needed. No backend in this pass.

Make the landing page genuinely striking. It is the first three seconds a hackathon judge will see.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://protect-defend-a-future.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c408b382-0c34-4eb9-9139-3d2e800f0c6d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
