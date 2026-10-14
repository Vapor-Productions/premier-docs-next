"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--fg-secondary)]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-docs-nav"
      >
        Menu
      </button>
      {open ? (
        <div
          id="mobile-docs-nav"
          className="absolute left-0 right-0 top-14 z-40 border-b border-[var(--border)] bg-[var(--bg)] px-4 py-4 shadow-lg"
        >
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
