import type { PathwayCategory, VerificationStatus } from "./types";

export type Organisation = {
  id: string;
  name: string;
  category: PathwayCategory;
  verificationStatus: VerificationStatus;
  /** General, non-specific. No headcounts, no statistics, no programme detail. */
  description: string;
  officialUrl: string;
};

/** What each badge actually means — and, more importantly, what it does not. */
export const VERIFICATION_MEANING: Record<
  VerificationStatus,
  { label: string; means: string; doesNotMean: string }
> = {
  verified: {
    label: "Verified",
    means:
      "The organisation is an official body or an internationally established organisation, and the destination link is its own published channel.",
    doesNotMean:
      "It does not mean this prototype has audited the organisation, endorsed it, or checked anything about a specific role, team or location.",
  },
  listed: {
    label: "Listed",
    means:
      "The organisation is publicly known and operating, and the link points to a channel it publishes itself.",
    doesNotMean:
      "It does not mean any independent check has been made of its governance, finances, safeguarding or working conditions.",
  },
  unverified: {
    label: "Unverified",
    means:
      "This is a category or community rather than a single accountable organisation, and there is no single body standing behind it.",
    doesNotMean:
      "It does not mean it is illegitimate. It means nobody has checked, and you should assume that yourself.",
  },
};

export const ORGANISATIONS: Organisation[] = [
  {
    id: "international-legion",
    name: "International Legion of Defence of Ukraine",
    category: "military",
    verificationStatus: "verified",
    description:
      "The official formation through which foreign nationals enter service. Entry, screening and assignment are decided by its own recruitment structure.",
    officialUrl: "https://ildu.com.ua/",
  },
  {
    id: "mod-recruitment-centre",
    name: "Ministry of Defence recruitment structure",
    category: "military",
    verificationStatus: "verified",
    description:
      "The state recruitment channel. It publishes its own intake information and conducts every stage of the process itself.",
    officialUrl: "https://recruiting.mod.gov.ua/",
  },
  {
    id: "brave1",
    name: "Brave1 defence-technology cluster",
    category: "defence-tech",
    verificationStatus: "listed",
    description:
      "A government-backed coordination cluster for defence technology, with its own jobs portal. Individual companies hire on their own terms.",
    officialUrl: "https://brave1.gov.ua/",
  },
  {
    id: "msf",
    name: "Médecins Sans Frontières",
    category: "humanitarian",
    verificationStatus: "verified",
    description:
      "An international medical humanitarian organisation with its own recruitment, security and neutrality rules.",
    officialUrl: "https://www.msf.org/work-with-us",
  },
  {
    id: "red-cross",
    name: "Red Cross movement",
    category: "humanitarian",
    verificationStatus: "verified",
    description:
      "The international movement and its national societies, working under mandated neutrality. Placements are made by their own structures.",
    officialUrl: "https://www.icrc.org/en/where-we-work/europe-central-asia/ukraine",
  },
  {
    id: "halo",
    name: "Mine-action organisations operating in Ukraine",
    category: "humanitarian",
    verificationStatus: "verified",
    description:
      "Accredited humanitarian mine-action organisations. All operational training is delivered by them, to their own standards.",
    officialUrl: "https://www.halotrust.org/careers/",
  },
  {
    id: "prytula",
    name: "Established Ukrainian civilian-support foundations",
    category: "humanitarian",
    verificationStatus: "listed",
    description:
      "Publicly known Ukrainian foundations supporting civilians and civilian infrastructure. Each sets its own intake rules.",
    officialUrl: "https://prytulafoundation.org/en",
  },
  {
    id: "clear-global",
    name: "Humanitarian language organisations",
    category: "remote",
    verificationStatus: "listed",
    description:
      "Organisations coordinating translation and language support for humanitarian responses, with their own quality processes.",
    officialUrl: "https://clearglobal.org/",
  },
  {
    id: "osint-community",
    name: "Open-source investigation community and training providers",
    category: "remote",
    verificationStatus: "unverified",
    description:
      "A loose community rather than an organisation. Reputable training resources exist; the groups themselves come and go.",
    officialUrl: "https://www.bellingcat.com/resources/",
  },
  {
    id: "volunteer-platforms",
    name: "Ukrainian volunteer coordination platforms",
    category: "remote",
    verificationStatus: "unverified",
    description:
      "Platforms that publish volunteering requests from many organisations at once. They aggregate; they do not vouch.",
    officialUrl: "https://volunteer.country/",
  },
];

export const ORGANISATION_BY_ID = new Map(ORGANISATIONS.map((o) => [o.id, o]));