export type NavItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const siteName = "Premier Planner Docs";

export const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [{ title: "Premier Planner", href: "/" }],
  },
  {
    title: "Guides",
    items: [
      {
        title: "Riot account linking",
        href: "/guides/riot-account-linking",
      },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Privacy policy", href: "/legal/privacy-policy" },
      { title: "Terms of service", href: "/legal/terms-of-service" },
    ],
  },
];
