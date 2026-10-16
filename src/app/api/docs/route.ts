import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  docRepoPath,
  docTitle,
  listDocPages,
  readDocPage,
  writeDocPage,
} from "@/lib/docs-content";
import {
  commitGitHubFile,
  GitHubConflictError,
  githubContentEnabled,
  readGitHubFile,
} from "@/lib/github-content";
import { canEditDocs, canReadEditor } from "@/lib/roles";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !canReadEditor(session.user.roles)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    try {
      if (githubContentEnabled()) {
        const repoPath = docRepoPath(slug);
        if (!repoPath) throw new Error("Invalid slug");
        const { content, sha } = await readGitHubFile(repoPath);
        return NextResponse.json({ slug, title: docTitle(slug, content), content, sha });
      }
      const page = await readDocPage(slug);
      return NextResponse.json(page);
    } catch {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const pages = await listDocPages();
  return NextResponse.json({
    pages: pages.map(({ slug, title, relativePath }) => ({
      slug,
      title,
      relativePath,
    })),
    roles: session.user.roles,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || !canReadEditor(session.user.roles)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canEditDocs(session.user.roles)) {
    return NextResponse.json(
      { error: "Forbidden: viewer role cannot save" },
      { status: 403 },
    );
  }

  let body: { slug?: string; content?: string; sha?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  const content = body.content;

  if (!slug || typeof content !== "string") {
    return NextResponse.json(
      { error: "slug and content are required" },
      { status: 400 },
    );
  }

  try {
    if (githubContentEnabled()) {
      const repoPath = docRepoPath(slug);
      if (!repoPath) throw new Error("Invalid slug");
      // The sha the editor loaded makes GitHub reject the commit if the file
      // changed since; without one, base the edit on the current file.
      const sha = body.sha || (await readGitHubFile(repoPath)).sha;
      const user = session.user.name || session.user.email || "unknown";
      const committed = await commitGitHubFile(
        repoPath,
        content,
        sha,
        `docs: edit ${slug} via editor (${user})`,
      );
      return NextResponse.json({ ok: true, slug, ...committed });
    }
    const saved = await writeDocPage(slug, content);
    return NextResponse.json({ ok: true, ...saved });
  } catch (error) {
    if (error instanceof GitHubConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
