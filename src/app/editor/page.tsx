import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditorClient } from "@/components/EditorClient";
import { listDocPages } from "@/lib/docs-content";

export const metadata = {
  title: "Docs editor",
};

export default async function EditorPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/editor");
  }

  const pages = await listDocPages();

  return (
    <EditorClient
      initialPages={pages.map(({ slug, title, relativePath }) => ({
        slug,
        title,
        relativePath,
      }))}
      userName={session.user.name || "editor"}
    />
  );
}
