"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/search-index";

export function SearchDialog({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.filter((entry) => entry.kind === "page");
    return entries
      .filter((entry) =>
        `${entry.title} ${entry.description} ${entry.group}`
          .toLowerCase()
          .includes(q),
      )
      .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "page" ? -1 : 1))
      .slice(0, 12);
  }, [entries, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery("");
      setIndex(0);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[index]) {
      event.preventDefault();
      go(results[index].href);
    }
  }

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle
            cx="11"
            cy="11"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m16 16 4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="search-trigger__label">Search docs</span>
        <kbd className="search-trigger__kbd">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-label="Search docs"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="search-dialog__panel">
          <div className="search-dialog__field">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle
                cx="11"
                cy="11"
                r="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIndex(0);
              }}
              onKeyDown={onInputKey}
              placeholder="Search pages and sections…"
              aria-label="Search pages"
              aria-controls="search-results"
              aria-activedescendant={
                results[index] ? `search-result-${index}` : undefined
              }
            />
            <kbd>Esc</kbd>
          </div>
          <ul id="search-results" className="search-dialog__results" role="listbox">
            {results.length === 0 ? (
              <li className="search-dialog__empty">No pages match “{query}”.</li>
            ) : (
              results.map((item, i) => (
                <li
                  key={`${item.kind}-${item.href}`}
                  id={`search-result-${i}`}
                  role="option"
                  aria-selected={i === index}
                  className={i === index ? "is-active" : undefined}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(item.href)}
                >
                  <span className="search-dialog__group">
                    {item.kind === "section"
                      ? `${item.group} › ${item.description}`
                      : item.group}
                  </span>
                  <strong>
                    {item.kind === "section" ? <span aria-hidden="true"># </span> : null}
                    {item.title}
                  </strong>
                  {item.kind === "page" ? <span>{item.description}</span> : null}
                </li>
              ))
            )}
          </ul>
        </div>
      </dialog>
    </>
  );
}
