import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "src", "app", "(docs)");

export type DocPage = {
  slug: string;
  title: string;
  filePath: string;
  relativePath: string;
};

function titleFromSlug(slug: string) {
  if (slug === "home") return "Premier Planner";
  return slug
    .split("/")
    .pop()!
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function titleFromSource(source: string, fallback: string) {
  const h1 = source.match(/^#\s+(.+)$/m);
  if (h1?.[1]) return h1[1].trim();
  const meta = source.match(/title:\s*["']([^"']+)["']/);
  if (meta?.[1]) return meta[1].trim();
  return fallback;
}

async function walkMdx(dir: string, base = ""): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const rel = path.posix.join(base, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMdx(abs, rel)));
    } else if (entry.name === "page.mdx") {
      files.push(rel);
    }
  }

  return files;
}

export async function listDocPages(): Promise<DocPage[]> {
  const files = await walkMdx(CONTENT_ROOT);
  const pages: DocPage[] = [];

  for (const relativePath of files) {
    const filePath = path.join(CONTENT_ROOT, relativePath);
    const source = await fs.readFile(/* turbopackIgnore: true */ filePath, "utf8");
    const dir = path.posix.dirname(relativePath);
    const slug = dir === "." ? "home" : dir;
    pages.push({
      slug,
      title: titleFromSource(source, titleFromSlug(slug)),
      filePath,
      relativePath,
    });
  }

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function resolveDocPath(slug: string): string | null {
  if (!slug || slug.includes("..") || slug.includes("\\")) return null;
  if (slug === "home") {
    return path.join(CONTENT_ROOT, "page.mdx");
  }
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  if (!/^[a-z0-9/-]+$/i.test(normalized)) return null;
  return path.join(CONTENT_ROOT, ...normalized.split("/"), "page.mdx");
}

export async function readDocPage(slug: string) {
  const filePath = resolveDocPath(slug);
  if (!filePath) throw new Error("Invalid slug");
  const source = await fs.readFile(/* turbopackIgnore: true */ filePath, "utf8");
  return {
    slug,
    title: titleFromSource(source, titleFromSlug(slug)),
    content: source,
    filePath,
  };
}

export async function writeDocPage(slug: string, content: string) {
  const filePath = resolveDocPath(slug);
  if (!filePath) throw new Error("Invalid slug");
  await fs.access(filePath);
  await fs.writeFile(filePath, content, "utf8");
  return { slug, filePath };
}
