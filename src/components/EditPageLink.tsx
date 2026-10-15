"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { canEditDocs } from "@/lib/roles";
import { docSlugFromPath } from "@/lib/slug";

export function EditPageLink() {
  const pathname = usePathname();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((session: { user?: { roles?: string[] } } | null) => {
        if (!cancelled) setCanEdit(canEditDocs(session?.user?.roles));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!canEdit) return null;

  return (
    <a
      href={`/editor?slug=${encodeURIComponent(docSlugFromPath(pathname))}`}
      className="edit-page-link"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Edit this page
    </a>
  );
}
