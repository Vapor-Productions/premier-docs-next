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
    <nav className="docs-nav" aria-label="Documentation">
      {navigation.map((group) => (
        <div key={group.title}>
          <p className="docs-nav__group-title">{group.title}</p>
          <ul className="docs-nav__list">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={
                      active ? "docs-nav__link is-active" : "docs-nav__link"
                    }
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
