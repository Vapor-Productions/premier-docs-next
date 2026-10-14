import Link from "next/link";
import { siteName } from "@/lib/nav";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <header className="docs-header">
        <div className="docs-header__inner">
          <div className="docs-header__left">
            <MobileNav />
            <Link href="/" className="docs-brand">
              <img
                src="/logo/dark.svg"
                alt={siteName}
                width={148}
                height={44}
              />
            </Link>
          </div>
          <div className="docs-header__right">
            <div className="docs-search" aria-hidden="true">
              <span>Search docs…</span>
              <kbd>⌘K</kbd>
            </div>
            <a
              className="docs-support"
              href="mailto:support@premierplanner.eu"
            >
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
        <main className="docs-main">
          <div className="docs-main__inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
