import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditorClient } from "@/components/EditorClient";
import { listDocPages } from "@/lib/docs-content";
import { canEditDocs, canReadEditor } from "@/lib/roles";

export const metadata = {
  title: "Docs editor",
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/editor");
  }
  if (!canReadEditor(session.user.roles)) {
    redirect("/login?error=AccessDenied");
  }

  const pages = await listDocPages();
  const { slug } = await searchParams;
  const initialSlug = pages.some((page) => page.slug === slug) ? slug : undefined;

  return (
    <EditorClient
      initialSlug={initialSlug}
      initialPages={pages.map(({ slug, title, relativePath }) => ({
        slug,
        title,
        relativePath,
      }))}
      userName={session.user.name || session.user.email || "editor"}
      roles={session.user.roles}
      canSave={canEditDocs(session.user.roles)}
    />
  );
}
