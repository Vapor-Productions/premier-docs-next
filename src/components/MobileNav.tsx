"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="docs-menu-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-docs-nav"
      >
        Menu
      </button>
      {open ? (
        <div id="mobile-docs-nav" className="docs-mobile-drawer">
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
