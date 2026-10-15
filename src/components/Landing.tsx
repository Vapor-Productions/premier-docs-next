import Link from "next/link";

const features = [
  {
    title: "Link Riot accounts",
    body: "Players opt in with official Riot Sign-On. No passwords ever reach the bot.",
    icon: "M12 3 4 6v6c0 4.4 3.4 8.2 8 9 4.6-.8 8-4.6 8-9V6Z M9 12l2 2 4-4",
  },
  {
    title: "Manage teams",
    body: "Keep team tags and members organised inside your Discord server.",
    icon: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3 2.7-5 6-5s6 2 6 5m-1-4.6c.9-.3 1.9-.4 3-.4 3.3 0 6 2 6 5",
  },
  {
    title: "Check roster status",
    body: "See whether linked members appear on a Premier roster at a glance.",
    icon: "M9 5h10M9 12h10M9 19h10M4 5l1 1 2-2M4 12l1 1 2-2M4 19h2",
  },
];

const audiences = [
  {
    eyebrow: "Players",
    title: "Link your Riot account",
    body: "How /riot link and /riot unlink work, step by step.",
    href: "/guides/riot-account-linking",
  },
  {
    eyebrow: "Riot API reviewers",
    title: "Public account-linking flow",
    body: "Opt-in RSO flow, screenshots and reviewer notes. No Discord server access required.",
    href: "/guides/riot-account-linking",
  },
  {
    eyebrow: "Legal",
    title: "Privacy policy",
    body: "How Premier Planner collects and uses data.",
    href: "/legal/privacy-policy",
  },
  {
    eyebrow: "Legal",
    title: "Terms of service",
    body: "Rules for using Premier Planner.",
    href: "/legal/terms-of-service",
  },
];

export function Hero({ children }: { children: React.ReactNode }) {
  return (
    <section className="hero">
      <p className="hero__eyebrow">Discord bot · Premier team organisation</p>
      <div className="hero__body">{children}</div>
      <div className="hero__actions">
        <Link href="/guides/riot-account-linking" className="btn btn--primary">
          Riot account linking guide
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <Link href="/legal/privacy-policy" className="btn btn--ghost">
          Privacy policy
        </Link>
      </div>
    </section>
  );
}

export function FeatureGrid() {
  return (
    <ul className="feature-grid">
      {features.map((feature) => (
        <li key={feature.title} className="feature">
          <span className="feature__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                d={feature.icon}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function QuickLinks() {
  return (
    <ul className="quick-links">
      {audiences.map((item) => (
        <li key={item.title}>
          <Link href={item.href} className="quick-link">
            <span className="quick-link__eyebrow">{item.eyebrow}</span>
            <strong>{item.title}</strong>
            <span className="quick-link__body">{item.body}</span>
            <span className="quick-link__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
