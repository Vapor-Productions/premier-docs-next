"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLockup } from "./BrandMark";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="icon-btn docs-menu-btn"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-docs-nav"
        aria-label="Open navigation"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className={open ? "drawer-backdrop is-open" : "drawer-backdrop"}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-docs-nav"
        className={open ? "drawer is-open" : "drawer"}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        inert={!open}
      >
        <div className="drawer__head">
          <BrandLockup />
          <button
            ref={closeRef}
            type="button"
            className="icon-btn"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <Sidebar onNavigate={() => setOpen(false)} />
      </div>
    </>
  );
}
