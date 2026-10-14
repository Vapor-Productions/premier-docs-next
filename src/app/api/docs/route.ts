import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listDocPages, readDocPage, writeDocPage } from "@/lib/docs-content";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    try {
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
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { slug?: string; content?: string };
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
    const saved = await writeDocPage(slug, content);
    return NextResponse.json({ ok: true, ...saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
