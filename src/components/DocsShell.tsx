import Link from "next/link";
import { navigation, supportEmail } from "@/lib/nav";
import { BrandLockup } from "./BrandMark";
import { MobileNav } from "./MobileNav";
import { SearchDialog } from "./SearchDialog";
import { Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { ThemeToggle } from "./ThemeToggle";

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <header className="docs-header">
        <div className="docs-header__inner">
          <div className="docs-header__left">
            <MobileNav />
            <Link href="/" className="docs-brand" aria-label="Premier Planner Docs home">
              <BrandLockup />
            </Link>
          </div>
          <div className="docs-header__right">
            <SearchDialog />
            <a className="docs-support" href={`mailto:${supportEmail}`}>
              Support
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="docs-body">
        <aside className="docs-sidebar">
          <div className="docs-sidebar__inner">
            <Sidebar />
          </div>
        </aside>
        <main id="content" className="docs-main" tabIndex={-1}>
          <article className="docs-article">{children}</article>
        </main>
        <aside className="docs-toc">
          <div className="docs-toc__inner">
            <TableOfContents />
          </div>
        </aside>
      </div>

      <footer className="docs-footer">
        <div className="docs-footer__inner">
          <div className="docs-footer__brand">
            <BrandLockup />
            <p>
              Team organisation for Premier communities on Discord.
            </p>
          </div>
          {navigation.map((group) => (
            <div key={group.title} className="docs-footer__col">
              <p className="docs-footer__title">{group.title}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="docs-footer__col">
            <p className="docs-footer__title">Contact</p>
            <ul>
              <li>
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="docs-footer__legal">
          © {new Date().getFullYear()} Premier Planner. Not endorsed by or
          affiliated with Riot Games.
        </p>
      </footer>
    </div>
  );
}
