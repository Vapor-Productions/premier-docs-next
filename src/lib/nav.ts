export type NavItem = {
  title: string;
  href: string;
  description: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const siteName = "Premier Planner Docs";

export const supportEmail = "support@premierplanner.eu";

export const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Premier Planner",
        href: "/",
        description: "What the bot does and where to start",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "Riot account linking",
        href: "/guides/riot-account-linking",
        description: "Opt-in Riot Sign-On flow, screenshots and reviewer notes",
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        title: "Privacy policy",
        href: "/legal/privacy-policy",
        description: "How Premier Planner collects and uses data",
      },
      {
        title: "Terms of service",
        href: "/legal/terms-of-service",
        description: "Rules for using Premier Planner",
      },
    ],
  },
];
