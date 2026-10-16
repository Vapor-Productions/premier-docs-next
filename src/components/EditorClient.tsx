"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DocRole } from "@/lib/roles";

type DocListItem = {
  slug: string;
  title: string;
  relativePath: string;
};

export function EditorClient({
  initialSlug,
  initialPages,
  userName,
  roles,
  canSave,
}: {
  initialSlug?: string;
  initialPages: DocListItem[];
  userName: string;
  roles: DocRole[];
  canSave: boolean;
}) {
  const [pages, setPages] = useState(initialPages);
  const [slug, setSlug] = useState(initialSlug ?? initialPages[0]?.slug ?? "");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sha, setSha] = useState<string | undefined>();
  const [commitUrl, setCommitUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">(
    canSave ? "edit" : "preview",
  );

  const current = useMemo(
    () => pages.find((page) => page.slug === slug),
    [pages, slug],
  );

  const loadPage = useCallback(async (nextSlug: string) => {
    if (!nextSlug) return;
    setLoading(true);
    setStatus(null);
    setCommitUrl(null);
    try {
      const res = await fetch(`/api/docs?slug=${encodeURIComponent(nextSlug)}`);
      if (!res.ok) throw new Error("Failed to load page");
      const data = (await res.json()) as {
        content: string;
        title: string;
        slug: string;
        sha?: string;
      };
      setSlug(data.slug);
      setContent(data.content);
      setTitle(data.title);
      setSha(data.sha);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) void loadPage(slug);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!canSave) {
      setStatus("Viewer role cannot save changes.");
      return;
    }
    setSaving(true);
    setStatus(null);
    setCommitUrl(null);
    try {
      const res = await fetch("/api/docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content, sha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (data.commitUrl) {
        setSha(data.sha);
        setCommitUrl(data.commitUrl);
        setStatus("Committed to GitHub. The site redeploys in about a minute.");
      } else {
        setStatus("Saved to content source.");
      }
      const listRes = await fetch("/api/docs");
      if (listRes.ok) {
        const listData = (await listRes.json()) as { pages: DocListItem[] };
        setPages(listData.pages);
      }
      const h1 = content.match(/^#\s+(.+)$/m);
      if (h1?.[1]) setTitle(h1[1].trim());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const previewHref =
    slug === "home" ? "/" : `/${slug.replace(/^\/+|\/+$/g, "")}`;

  return (
    <div className="editor-shell">
      <header className="editor-header">
        <div className="editor-header__brand">
          <span>Docs editor</span>
          <small>
            {userName} · {roles.join(", ") || "no roles"}
          </small>
        </div>
        <div className="editor-header__actions">
          <Link href={previewHref} target="_blank" className="editor-btn ghost">
            Open live page
          </Link>
          <Link href="/" className="editor-btn ghost">
            Public docs
          </Link>
          <form action="/editor/signout" method="POST">
            <button type="submit" className="editor-btn ghost">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="editor-body">
        <aside className="editor-sidebar">
          <p className="editor-sidebar__label">Pages</p>
          <ul>
            {pages.map((page) => (
              <li key={page.slug}>
                <button
                  type="button"
                  className={
                    page.slug === slug
                      ? "editor-page-link is-active"
                      : "editor-page-link"
                  }
                  onClick={() => void loadPage(page.slug)}
                >
                  <strong>{page.title}</strong>
                  <span>{page.slug === "home" ? "/" : `/${page.slug}`}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="editor-main">
          <div className="editor-toolbar">
            <div>
              <h1>{title || current?.title || "Untitled"}</h1>
              <p className="editor-path">
                {current?.relativePath ?? "src/app/(docs)/…/page.mdx"}
              </p>
            </div>
            <div className="editor-toolbar__right">
              <div className="editor-tabs">
                {canSave ? (
                  <button
                    type="button"
                    className={mode === "edit" ? "is-active" : undefined}
                    onClick={() => setMode("edit")}
                  >
                    Edit
                  </button>
                ) : null}
                <button
                  type="button"
                  className={mode === "preview" ? "is-active" : undefined}
                  onClick={() => setMode("preview")}
                >
                  Preview
                </button>
              </div>
              {canSave ? (
                <button
                  type="button"
                  className="editor-btn primary"
                  onClick={() => void save()}
                  disabled={saving || loading || !slug}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              ) : (
                <span className="editor-btn ghost" aria-disabled="true">
                  View only
                </span>
              )}
            </div>
          </div>

          {status ? (
            <p className="editor-status">
              {status}
              {commitUrl ? (
                <>
                  {" "}
                  <a href={commitUrl} target="_blank" rel="noreferrer">
                    View commit
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
          {!canSave ? (
            <p className="editor-status">
              Signed in as viewer — you can browse source but not save.
            </p>
          ) : null}

          {loading ? (
            <p className="editor-status">Loading…</p>
          ) : mode === "edit" && canSave ? (
            <textarea
              className="editor-textarea"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              spellCheck={false}
              aria-label="MDX source"
            />
          ) : (
            <div className="editor-preview">
              <pre>{content}</pre>
              <p className="editor-preview__hint">
                Source preview. Open the live page for rendered MDX output.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
