import type { Pathway } from "./types";

/**
 * Seed pathway records.
 *
 * Everything written here is deliberately unflattering where the truth is
 * unflattering. No statistics, headcounts, salaries, acceptance rates or
 * programme details are invented: organisational descriptions stay general,
 * and every record ends at an official destination the person reaches
 * themselves.
 */
export const PATHWAYS: Pathway[] = [
  // ── MILITARY ──────────────────────────────────────────────────────────────
  {
    id: "legion-light-infantry",
    title: "Light infantry, international unit",
    category: "military",
    organisationId: "international-legion",
    organisationName: "International Legion of Defence of Ukraine",
    verificationStatus: "verified",
    location: "Ukraine, unit-assigned",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 12, max: 36 },
    hoursPerWeek: { min: 60, max: 100 },
    languageRequirement: {
      level: "english",
      label: "English is workable inside international units; Ukrainian is not required to enlist.",
    },
    riskBand: "high",
    eligibilityNotes: [
      "Entry, medical screening and any background checking are performed by the official recruitment structure, by people, not by this site.",
      "You must arrive with your own valid passport and make your own way to an official recruitment point.",
      "Prior military experience is weighed heavily. It is not a formality.",
    ],
    honestRisks: [
      "This is combat service. Death, permanent injury and psychological injury are real and not rare.",
      "Serving in a foreign armed force carries legal consequences in some countries of citizenship — including loss of citizenship or prosecution. You must check your own country's law yourself, before you travel.",
      "You may be assigned to a unit, a task and a location you did not choose.",
    ],
    honestLimitations: [
      "International units recruit primarily light infantry. That is the role most people are actually offered.",
      "Contracts are long, and leaving early is not a personal decision once signed.",
      "Most specialist and technical military roles require Ukrainian, because the orders, the paperwork and the radio traffic are in Ukrainian.",
    ],
    ordinaryDayDescription:
      "Most days are waiting, kit maintenance, digging, moving position, standing watch in the cold, repeating drills you already know, and paperwork you did not expect. The intense hours are a small fraction of the month.",
    whatItIsNot:
      "It is not a fast route to a technical or advisory role because you have technical skills at home. Skilled foreign applicants are routinely placed in infantry roles.",
    officialNextStepLabel: "Read the official International Legion recruitment information",
    officialNextStepUrl: "https://ildu.com.ua/",
    requiredSignals: ["speed", "adaptation", "calibration"],
  },
  {
    id: "official-recruitment-intake",
    title: "Official foreign recruitment intake",
    category: "military",
    organisationId: "mod-recruitment-centre",
    organisationName: "Ministry of Defence recruitment structure",
    verificationStatus: "verified",
    location: "Ukraine, recruitment centres",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 12, max: 36 },
    hoursPerWeek: { min: 60, max: 100 },
    languageRequirement: {
      level: "english",
      label: "Intake conversations can be held in English; service life is conducted in Ukrainian.",
    },
    riskBand: "high",
    eligibilityNotes: [
      "This is the intake conversation, not a placement. The organisation decides, a human decides, and they may decline.",
      "Bring documents. Expect to repeat your history several times to several people.",
    ],
    honestRisks: [
      "Signing a contract is a legal act with consequences in Ukraine and potentially in your own country.",
      "You may travel, be assessed, and be turned away. That happens and it is not framed here as failure.",
      "Once in service, the risk profile is the risk profile of war.",
    ],
    honestLimitations: [
      "Nothing on this page reserves you a place, a role, a unit or a date.",
      "Waiting is normal. Weeks between steps is normal.",
      "Roles are allocated to the needs of the force, not to your preference.",
    ],
    ordinaryDayDescription:
      "Queues, forms, medical checks, a translated interview, and long gaps with no news. It feels administrative because it is administrative.",
    whatItIsNot:
      "It is not an application portal with a status bar. It is a door you physically walk through, and people on the other side make the decision.",
    officialNextStepLabel: "Open the official recruitment information",
    officialNextStepUrl: "https://recruiting.mod.gov.ua/",
    requiredSignals: ["calibration", "adaptation"],
  },
  {
    id: "combat-medic-service",
    title: "Combat medical service",
    category: "military",
    organisationId: "international-legion",
    organisationName: "International Legion of Defence of Ukraine",
    verificationStatus: "verified",
    location: "Ukraine, unit-assigned",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 12, max: 36 },
    hoursPerWeek: { min: 60, max: 100 },
    languageRequirement: {
      level: "basic-ukrainian",
      label: "English within international units; basic Ukrainian is needed to work with Ukrainian casualties and crews.",
    },
    riskBand: "high",
    eligibilityNotes: [
      "Civilian clinical qualifications are not automatically recognised. Verification is done by the organisation, by people.",
      "Documented practice history matters more than the seniority of your title.",
    ],
    honestRisks: [
      "Medics are exposed to the same fire as the people they treat, while working with their hands occupied.",
      "The moral weight of triage under fire is a known and lasting injury, not a rare one.",
      "The same foreign-service legal consequences apply as for any military role.",
    ],
    honestLimitations: [
      "You may not be used as a medic. You may be used as infantry who can also treat.",
      "Equipment is what the unit has, not what your hospital had.",
      "Language failure at the wrong moment has consequences, which is why Ukrainian keeps being asked for.",
    ],
    ordinaryDayDescription:
      "Restocking bags, checking expiry dates, teaching the same tourniquet drill again, cold, waiting, and then a short period where everything you know is used at once.",
    whatItIsNot:
      "It is not hospital medicine relocated. It is austere care with what you carry, under time you do not control.",
    officialNextStepLabel: "Read the official medical recruitment information",
    officialNextStepUrl: "https://ildu.com.ua/",
    requiredSignals: ["calibration", "speed", "adaptation"],
  },
  {
    id: "uav-crew-service",
    title: "Unmanned systems crew, military service",
    category: "military",
    organisationId: "mod-recruitment-centre",
    organisationName: "Ministry of Defence recruitment structure",
    verificationStatus: "verified",
    location: "Ukraine, unit-assigned",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 12, max: 36 },
    hoursPerWeek: { min: 60, max: 100 },
    languageRequirement: {
      level: "fluent-ukrainian",
      label: "Ukrainian is normally required: tasking, coordination and reporting are in Ukrainian.",
    },
    riskBand: "high",
    eligibilityNotes: [
      "Selection is made inside the force, usually from people already serving.",
      "Hobby or commercial drone experience is not treated as equivalent training.",
    ],
    honestRisks: [
      "Crews are a priority target. Positions are located and struck.",
      "The work is watched, recorded and reviewed, including the parts that go wrong.",
      "Foreign-service legal consequences in your country of citizenship apply here as anywhere else in this category.",
    ],
    honestLimitations: [
      "This is one of the roles most often assumed to be available to skilled foreigners and least often actually offered to them.",
      "Without Ukrainian, most units cannot use you in this role at all.",
      "Being good with software at home does not shorten the path.",
    ],
    ordinaryDayDescription:
      "Charging batteries, soldering, repairing airframes, carrying equipment, waiting for weather, filling in logs, and short bursts of concentrated work.",
    whatItIsNot:
      "It is not a screen-based job at a safe distance, and it is not a technical career pivot.",
    officialNextStepLabel: "Open the official recruitment information",
    officialNextStepUrl: "https://recruiting.mod.gov.ua/",
    requiredSignals: ["visual", "calibration", "speed"],
  },

  // ── DEFENCE TECH ──────────────────────────────────────────────────────────
  {
    id: "defence-tech-engineering",
    title: "Engineering role, defence-technology cluster",
    category: "defence-tech",
    organisationId: "brave1",
    organisationName: "Brave1 defence-technology cluster",
    verificationStatus: "listed",
    location: "Ukraine, mainly Kyiv and Lviv",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 6, max: 24 },
    hoursPerWeek: { min: 35, max: 50 },
    languageRequirement: {
      level: "english",
      label: "English is common in engineering teams; Ukrainian helps considerably outside them.",
    },
    riskBand: "moderate",
    eligibilityNotes: [
      "Hiring is done by individual companies through their own processes, not by the cluster and not by this site.",
      "Right-to-work and export-control questions are yours to resolve before applying.",
    ],
    honestRisks: [
      "You would be living in a country under regular long-range attack, including the cities named above.",
      "Working in defence technology can affect future employment, travel and security clearances elsewhere.",
      "Companies close, pivot or lose funding, and roles disappear with them.",
    ],
    honestLimitations: [
      "This is a private-sector job market. It is not service, and it should not be described as service.",
      "Nothing about this pathway is connected to military enlistment, and no information from this category is passed to that one.",
      "Seniority abroad does not transfer automatically; teams hire for what you can build next week.",
    ],
    ordinaryDayDescription:
      "Standups, procurement delays, testing the same subsystem repeatedly, waiting on a component, writing documentation, and occasional power cuts that stop everything.",
    whatItIsNot:
      "It is not a way to reach the front. Companies are explicitly civilian employers.",
    officialNextStepLabel: "Open the cluster's official jobs portal",
    officialNextStepUrl: "https://brave1.gov.ua/",
    requiredSignals: ["tradeoff", "adaptation", "calibration"],
  },
  {
    id: "defence-tech-manufacturing",
    title: "Production and assembly, unmanned systems manufacturer",
    category: "defence-tech",
    organisationId: "brave1",
    organisationName: "Brave1 defence-technology cluster",
    verificationStatus: "listed",
    location: "Ukraine, production sites",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 6, max: 24 },
    hoursPerWeek: { min: 40, max: 55 },
    languageRequirement: {
      level: "basic-ukrainian",
      label: "Basic Ukrainian is normally needed on the production floor.",
    },
    riskBand: "moderate",
    eligibilityNotes: [
      "Production sites apply their own site-access rules and their own vetting, performed by them.",
      "Manual dexterity and shift reliability matter more than qualifications.",
    ],
    honestRisks: [
      "Production facilities are targets, and site locations are treated as sensitive for that reason.",
      "Shift work, solvents, and repetitive strain are ordinary parts of the job.",
    ],
    honestLimitations: [
      "The work is repetitive by design. Consistency is the skill being bought.",
      "It is unlikely to be intellectually interesting, and it is honest to say so.",
    ],
    ordinaryDayDescription:
      "The same assembly step, hundreds of times, with quality checks between. Standing, counting, labelling, and a queue for the one working test rig.",
    whatItIsNot:
      "It is not product design, and moving from the floor into engineering is not a promised route.",
    officialNextStepLabel: "Open the cluster's official jobs portal",
    officialNextStepUrl: "https://brave1.gov.ua/",
    requiredSignals: ["visual", "adaptation"],
  },
  {
    id: "defence-tech-remote-firmware",
    title: "Remote embedded and firmware contribution",
    category: "defence-tech",
    organisationId: "brave1",
    organisationName: "Brave1 defence-technology cluster",
    verificationStatus: "listed",
    location: "Remote, working to Ukrainian time zones",
    relocationRequired: false,
    acceptsRemote: true,
    commitmentMonths: { min: 3, max: 12 },
    hoursPerWeek: { min: 8, max: 30 },
    languageRequirement: {
      level: "english",
      label: "English is sufficient for most remote engineering work.",
    },
    riskBand: "none",
    eligibilityNotes: [
      "Export-control and dual-use rules apply to you personally in your own country. Check them before you write any code.",
      "Companies decide what a remote contributor may and may not see.",
    ],
    honestRisks: [
      "Your involvement in defence work may be visible later and may affect other employment.",
      "You will rarely be told what happened to what you built.",
    ],
    honestLimitations: [
      "Remote contributors get the bounded, unglamorous parts of the system, because trust is built slowly and access is restricted for good reasons.",
      "Time-zone gaps mean answers to your questions arrive the next day.",
    ],
    ordinaryDayDescription:
      "Reading someone else's schematics, reproducing a bug on hardware you do not have, and writing careful notes for a team that is asleep.",
    whatItIsNot:
      "It is not front-line involvement, and describing it that way to yourself will make it feel emptier than it is.",
    officialNextStepLabel: "Open the cluster's official jobs portal",
    officialNextStepUrl: "https://brave1.gov.ua/",
    requiredSignals: ["tradeoff", "calibration"],
  },
  {
    id: "imagery-analysis",
    title: "Geospatial and imagery analysis",
    category: "defence-tech",
    organisationId: "brave1",
    organisationName: "Brave1 defence-technology cluster",
    verificationStatus: "listed",
    location: "Ukraine or remote, depending on the employer",
    relocationRequired: false,
    acceptsRemote: true,
    commitmentMonths: { min: 6, max: 18 },
    hoursPerWeek: { min: 15, max: 40 },
    languageRequirement: {
      level: "english",
      label: "English is normally sufficient; Ukrainian widens what you can be shown.",
    },
    riskBand: "low",
    eligibilityNotes: [
      "Access to imagery is governed by the employer's licences and by law, not by enthusiasm.",
      "Sustained attention is assessed by the employer through their own trial tasks.",
    ],
    honestRisks: [
      "You will look at destruction for hours, and that has a cumulative effect people underestimate.",
      "A confident wrong reading has consequences for other people's decisions.",
    ],
    honestLimitations: [
      "Most frames contain nothing. The work is mostly negative results.",
      "You will not be told the outcome of your assessments.",
    ],
    ordinaryDayDescription:
      "Comparing two nearly identical images for an hour, writing a one-line note, and starting the next pair. Cloud cover ruins a whole session regularly.",
    whatItIsNot:
      "It is not real-time targeting, and it is not the version of this work shown in films.",
    officialNextStepLabel: "Open the cluster's official jobs portal",
    officialNextStepUrl: "https://brave1.gov.ua/",
    requiredSignals: ["visual", "calibration", "scepticism"],
  },

  // ── HUMANITARIAN ──────────────────────────────────────────────────────────
  {
    id: "emergency-medical-team",
    title: "Emergency medical team member",
    category: "humanitarian",
    organisationId: "msf",
    organisationName: "Médecins Sans Frontières",
    verificationStatus: "verified",
    location: "Ukraine, project-assigned",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 6, max: 12 },
    hoursPerWeek: { min: 45, max: 60 },
    languageRequirement: {
      level: "english-plus-local",
      label: "English for the organisation; interpreters are used with patients, and Ukrainian or Russian helps daily.",
    },
    riskBand: "moderate",
    eligibilityNotes: [
      "Recruitment, clinical verification and security briefing are done by the organisation, by people, on their own timeline.",
      "Prior humanitarian field experience is often expected before a first Ukraine placement.",
    ],
    honestRisks: [
      "Projects operate near areas subject to strike. Security rules will restrict your movement and you must accept that.",
      "Exposure to civilian injury, including children, is routine.",
    ],
    honestLimitations: [
      "You do not choose your location, and placements change at short notice.",
      "The organisation's neutrality rules will constrain what you may say publicly, including online.",
    ],
    ordinaryDayDescription:
      "Handover meetings, stock counts, driving, waiting for security clearance to move, clinical work in short concentrated blocks, and reports at the end of a long day.",
    whatItIsNot:
      "It is not independent volunteering. You work inside a strict organisational structure.",
    officialNextStepLabel: "Open the organisation's official recruitment pages",
    officialNextStepUrl: "https://www.msf.org/work-with-us",
    requiredSignals: ["calibration", "adaptation", "speed"],
  },
  {
    id: "evacuation-logistics",
    title: "Civilian evacuation and aid logistics",
    category: "humanitarian",
    organisationId: "red-cross",
    organisationName: "Red Cross movement",
    verificationStatus: "verified",
    location: "Ukraine, regional hubs",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 3, max: 12 },
    hoursPerWeek: { min: 40, max: 55 },
    languageRequirement: {
      level: "english-plus-local",
      label: "English inside the organisation; Ukrainian or Russian is close to essential in the field.",
    },
    riskBand: "moderate",
    eligibilityNotes: [
      "Placements are made by the national society and the movement's own structures.",
      "A clean driving record and heavy-vehicle experience often matter more than a degree.",
    ],
    honestRisks: [
      "Road movement near affected areas carries mine, debris and strike risk.",
      "You will meet people on the worst day of their life and be unable to fix it.",
    ],
    honestLimitations: [
      "Most of the job is manifests, fuel, and coordination calls, not evacuation itself.",
      "Capacity is always smaller than need, and you will make the choice about who waits.",
    ],
    ordinaryDayDescription:
      "Loading, re-loading, waiting at a checkpoint, updating a spreadsheet, arguing politely about a permit, and driving in the dark.",
    whatItIsNot:
      "It is not a rescue role with a uniform and a siren. It is freight, paperwork and patience.",
    officialNextStepLabel: "Open the movement's official volunteer information",
    officialNextStepUrl: "https://www.icrc.org/en/where-we-work/europe-central-asia/ukraine",
    requiredSignals: ["tradeoff", "adaptation"],
  },
  {
    id: "mine-risk-education",
    title: "Explosive-ordnance risk education",
    category: "humanitarian",
    organisationId: "halo",
    organisationName: "Mine-action organisations operating in Ukraine",
    verificationStatus: "verified",
    location: "Ukraine, affected regions",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 6, max: 24 },
    hoursPerWeek: { min: 40, max: 50 },
    languageRequirement: {
      level: "fluent-ukrainian",
      label: "Teaching is delivered in Ukrainian, so fluency is usually required for the education role itself.",
    },
    riskBand: "moderate",
    eligibilityNotes: [
      "Clearance work itself requires accredited training delivered by the organisation.",
      "Most international staff are hired into management, logistics or training, not clearance.",
    ],
    honestRisks: [
      "You work in and around contaminated areas, under strict procedure, and procedure is what keeps you alive.",
      "Accidents in this sector are rare but final.",
    ],
    honestLimitations: [
      "It is slow. A single field can take a season.",
      "Local staff are hired first, correctly, and that limits international openings.",
    ],
    ordinaryDayDescription:
      "The same safety talk delivered to a fourth school group, equipment checks, dusty driving, and a lot of forms recording exactly what was said and where.",
    whatItIsNot:
      "It is not bomb disposal as popularly imagined, and enthusiasm is a disqualifier, not a qualification.",
    officialNextStepLabel: "Open an accredited mine-action organisation's careers page",
    officialNextStepUrl: "https://www.halotrust.org/careers/",
    requiredSignals: ["visual", "calibration"],
  },
  {
    id: "shelter-and-heating",
    title: "Shelter, heating and civilian resilience crew",
    category: "humanitarian",
    organisationId: "prytula",
    organisationName: "Established Ukrainian civilian-support foundations",
    verificationStatus: "listed",
    location: "Ukraine, regional",
    relocationRequired: true,
    acceptsRemote: false,
    commitmentMonths: { min: 1, max: 6 },
    hoursPerWeek: { min: 30, max: 50 },
    languageRequirement: {
      level: "basic-ukrainian",
      label: "Basic Ukrainian, or a reliable interpreter you bring yourself.",
    },
    riskBand: "low",
    eligibilityNotes: [
      "Foundations set their own intake rules and change them with the season.",
      "Practical trades — electrical, plumbing, carpentry — are what is genuinely short.",
    ],
    honestRisks: [
      "Winter work in unheated buildings, in a country under periodic long-range attack.",
      "Ad-hoc organisations can be disorganised in ways that waste your time.",
    ],
    honestLimitations: [
      "Funding is seasonal, so the work can stop without notice.",
      "You may spend your first week doing nothing useful while someone works out where to put you.",
    ],
    ordinaryDayDescription:
      "Carrying generators up stairs, sealing windows, waiting for a delivery that arrives at nine at night, and drinking tea with people who want to talk.",
    whatItIsNot:
      "It is not a structured programme with a curriculum. It is unglamorous practical labour.",
    officialNextStepLabel: "Open an established foundation's official volunteer page",
    officialNextStepUrl: "https://prytulafoundation.org/en",
    requiredSignals: ["adaptation", "tradeoff"],
  },

  // ── REMOTE ────────────────────────────────────────────────────────────────
  {
    id: "remote-osint-verification",
    title: "Open-source verification volunteer",
    category: "remote",
    organisationId: "osint-community",
    organisationName: "Open-source investigation community and training providers",
    verificationStatus: "unverified",
    location: "Remote, anywhere",
    relocationRequired: false,
    acceptsRemote: true,
    commitmentMonths: { min: 1, max: 12 },
    hoursPerWeek: { min: 2, max: 15 },
    languageRequirement: {
      level: "english",
      label: "English is enough to start; Ukrainian or Russian widens what you can check.",
    },
    riskBand: "none",
    eligibilityNotes: [
      "This category is largely self-organised. Nobody is checking credentials, which cuts both ways.",
      "Publishing unverified material can cause real harm, so most credible groups start you on review, not publication.",
    ],
    honestRisks: [
      "Sustained exposure to graphic material has a documented psychological cost.",
      "Getting something wrong in public can harm people and follow you.",
    ],
    honestLimitations: [
      "Much of the work is refuting things rather than finding things.",
      "Groups form and dissolve quickly, and continuity is poor.",
    ],
    ordinaryDayDescription:
      "Cross-checking a timestamp for forty minutes, finding the same photo from two years ago, and writing a short note saying so.",
    whatItIsNot:
      "It is not intelligence work, and no institution is waiting for your report.",
    officialNextStepLabel: "Read a reputable open-source verification training resource",
    officialNextStepUrl: "https://www.bellingcat.com/resources/",
    requiredSignals: ["scepticism", "calibration", "visual"],
  },
  {
    id: "remote-translation",
    title: "Translation and localisation support",
    category: "remote",
    organisationId: "clear-global",
    organisationName: "Humanitarian language organisations",
    verificationStatus: "listed",
    location: "Remote, anywhere",
    relocationRequired: false,
    acceptsRemote: true,
    commitmentMonths: { min: 1, max: 12 },
    hoursPerWeek: { min: 2, max: 20 },
    languageRequirement: {
      level: "english-plus-local",
      label: "You need a genuine second language. Ukrainian, Russian, Polish and German are the ones most asked for.",
    },
    riskBand: "none",
    eligibilityNotes: [
      "Organisations test translation quality themselves before assigning anything sensitive.",
      "Legal and medical translation requires domain competence, not just fluency.",
    ],
    honestRisks: [
      "A translation error in a medical or legal document harms someone directly.",
      "Some source material is distressing to read closely, which translation requires.",
    ],
    honestLimitations: [
      "Volume is irregular. You may get nothing for two weeks then a deadline overnight.",
      "The work is invisible, and correctly so.",
    ],
    ordinaryDayDescription:
      "Two hours on a leaflet about water safety, arguing with yourself about one word, then formatting it into a template.",
    whatItIsNot:
      "It is not interpreting at the front, and it is not a route to a field role.",
    officialNextStepLabel: "Open a humanitarian language organisation's volunteer page",
    officialNextStepUrl: "https://clearglobal.org/",
    requiredSignals: ["scepticism", "calibration"],
  },
  {
    id: "remote-fundraising-ops",
    title: "Fundraising and back-office operations",
    category: "remote",
    organisationId: "prytula",
    organisationName: "Established Ukrainian civilian-support foundations",
    verificationStatus: "listed",
    location: "Remote, anywhere",
    relocationRequired: false,
    acceptsRemote: true,
    commitmentMonths: { min: 1, max: 12 },
    hoursPerWeek: { min: 2, max: 20 },
    languageRequirement: {
      level: "english",
      label: "English is sufficient for most diaspora-facing fundraising and administration.",
    },
    riskBand: "none",
    eligibilityNotes: [
      "Handling donations means handling other people's money, and organisations vet accordingly.",
      "Accounting, grant-writing and CRM skills are wanted more than enthusiasm.",
    ],
    honestRisks: [
      "Fundraising fatigue is real, and a campaign that fails feels personal.",
      "Associating publicly with fundraising attracts hostile attention online.",
    ],
    honestLimitations: [
      "You are far from the outcome and will rarely see what your work bought.",
      "Spreadsheets, receipts and reconciliation are the bulk of it.",
    ],
    ordinaryDayDescription:
      "Chasing a missing receipt, updating a donor list, rewriting the same paragraph for a grant form, and a late call with three time zones.",
    whatItIsNot:
      "It is not a lesser contribution, and it is also not proximity to the work it funds.",
    officialNextStepLabel: "Open an established foundation's official contact page",
    officialNextStepUrl: "https://prytulafoundation.org/en",
    requiredSignals: ["tradeoff", "adaptation"],
  },
  {
    id: "remote-software-volunteer",
    title: "Civic software and data volunteering",
    category: "remote",
    organisationId: "volunteer-platforms",
    organisationName: "Ukrainian volunteer coordination platforms",
    verificationStatus: "unverified",
    location: "Remote, anywhere",
    relocationRequired: false,
    acceptsRemote: true,
    commitmentMonths: { min: 1, max: 6 },
    hoursPerWeek: { min: 2, max: 15 },
    languageRequirement: {
      level: "english",
      label: "English works for most teams; interface work needs a Ukrainian speaker to review it.",
    },
    riskBand: "none",
    eligibilityNotes: [
      "Platforms list requests from many organisations and do not vouch for all of them equally.",
      "Check who owns the data before you touch it.",
    ],
    honestRisks: [
      "Handling personal data of displaced people badly can expose them. This is the main risk here and it is not theoretical.",
      "Abandoned volunteer projects leave organisations worse off than before.",
    ],
    honestLimitations: [
      "Most requests are small, dull and maintenance-shaped.",
      "Coordination overhead often exceeds the work itself.",
    ],
    ordinaryDayDescription:
      "Fixing a broken export, writing documentation nobody asked for, and waiting three days for access to a spreadsheet.",
    whatItIsNot:
      "It is not a startup, and shipping something new is usually less useful than maintaining something old.",
    officialNextStepLabel: "Open a Ukrainian volunteer coordination platform",
    officialNextStepUrl: "https://volunteer.country/",
    requiredSignals: ["tradeoff", "scepticism"],
  },
];

export const PATHWAY_BY_ID = new Map(PATHWAYS.map((p) => [p.id, p]));