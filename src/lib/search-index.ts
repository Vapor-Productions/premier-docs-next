import { readDocPage } from "./docs-content";
import { navigation } from "./nav";
import { docSlugFromPath, slugify } from "./slug";

export type SearchEntry = {
  kind: "page" | "section";
  title: string;
  href: string;
  description: string;
  group: string;
};

/** Plain heading text, matching what the rendered MDX heading contains. */
function headingText(markdown: string) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .trim();
}

export async function getSearchIndex(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];

  for (const group of navigation) {
    for (const item of group.items) {
      entries.push({
        kind: "page",
        title: item.title,
        href: item.href,
        description: item.description,
        group: group.title,
      });

      const { content } = await readDocPage(docSlugFromPath(item.href));
      for (const match of content.matchAll(/^#{2,3}\s+(.+)$/gm)) {
        const title = headingText(match[1]);
        entries.push({
          kind: "section",
          title,
          href: `${item.href}#${slugify(title)}`,
          description: item.title,
          group: group.title,
        });
      }
    }
  }

  return entries;
}
