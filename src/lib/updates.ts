/**
 * Thin dated one-liners for the homepage strip and /updates.
 * Keep this short — not a newsroom. Daily China sourcing news lives at /news.
 */

export type SiteUpdate = {
  date: string;
  iso: string;
  title: string;
  href: string;
};

export const updatesIntro = {
  eyebrow: "Updates",
  title: "Notes from the desk",
  description:
    "Short dated pointers into Knowledge, case studies, and comparison pages — not a news feed.",
} as const;

export const siteUpdates: SiteUpdate[] = [
  {
    date: "14 Sep 2026",
    iso: "2026-09-14",
    title: "Amazon FBA private label — OEM, packaging, QC, and freight from China",
    href: "/amazon-fba",
  },
  {
    date: "14 Sep 2026",
    iso: "2026-09-14",
    title: "How to source from China — factory to delivery, plus inspection guide",
    href: "/knowledge/how-to-source-from-china",
  },
  {
    date: "12 Sep 2026",
    iso: "2026-09-12",
    title: "Sourcing agent vs Alibaba — when a desk beats a marketplace",
    href: "/compare/sourcing-agent-vs-alibaba",
  },
  {
    date: "8 Sep 2026",
    iso: "2026-09-08",
    title: "Visit China factories: what the three days actually include",
    href: "/knowledge/factory-visit-xiamen-hosted-sourcing-trip",
  },
  {
    date: "28 Aug 2026",
    iso: "2026-08-28",
    title: "China 3PL vs DIY freight — operator warehouse or you stitch the lane",
    href: "/compare/china-3pl-vs-diy-freight",
  },
  {
    date: "14 Aug 2026",
    iso: "2026-08-14",
    title: "Example engagement: China hub and Dubai 3PL on one desk",
    href: "/case-studies/xiamen-dubai-3pl",
  },
  {
    date: "30 Jul 2026",
    iso: "2026-07-30",
    title: "Factory visit vs remote QC only — when to get on the floor",
    href: "/compare/factory-visit-vs-remote-qc",
  },
];

export const homepageUpdates = siteUpdates.slice(0, 3);
