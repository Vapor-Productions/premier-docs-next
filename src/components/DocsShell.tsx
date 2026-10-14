import Link from "next/link";
import { siteName } from "@/lib/nav";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2.5">
              {/* Both logo assets are dark-chrome brand marks from the Mintlify site */}
              <img
                src="/logo/dark.svg"
                alt={siteName}
                width={148}
                height={44}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="mailto:support@premierplanner.eu"
              className="hidden text-sm text-[var(--fg-secondary)] hover:text-[var(--primary)] sm:inline"
            >
              Support
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
