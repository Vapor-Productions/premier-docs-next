"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6 text-sm" aria-label="Documentation">
      {navigation.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={[
                      "block rounded-md px-2 py-1.5 transition-colors",
                      active
                        ? "bg-[var(--nav-active-bg)] font-medium text-[var(--primary)]"
                        : "text-[var(--fg-secondary)] hover:bg-[var(--nav-hover)] hover:text-[var(--fg)]",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
