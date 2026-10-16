/**
 * Reads and commits docs pages through the GitHub Contents API, so the editor
 * works on Vercel, where the deployed filesystem is read-only and is replaced
 * on every deploy. Used only when GITHUB_CONTENT_TOKEN is set.
 */

const API = "https://api.github.com";

export class GitHubConflictError extends Error {}

export function githubContentEnabled() {
  return Boolean(process.env.GITHUB_CONTENT_TOKEN);
}

function config() {
  return {
    token: process.env.GITHUB_CONTENT_TOKEN ?? "",
    repo: process.env.GITHUB_CONTENT_REPO || "Vapor-Productions/premier-docs-next",
    branch: process.env.GITHUB_CONTENT_BRANCH || "main",
  };
}

function contentsUrl(repoPath: string) {
  const { repo } = config();
  return `${API}/repos/${repo}/contents/${repoPath.split("/").map(encodeURIComponent).join("/")}`;
}

function headers() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config().token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function readGitHubFile(repoPath: string) {
  const { branch } = config();
  const res = await fetch(`${contentsUrl(repoPath)}?ref=${encodeURIComponent(branch)}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const data = (await res.json()) as { content: string; sha: string };
  return {
    content: Buffer.from(data.content, "base64").toString("utf8"),
    sha: data.sha,
  };
}

/** Commits `content` to `repoPath`. `sha` is the blob the edit was based on. */
export async function commitGitHubFile(
  repoPath: string,
  content: string,
  sha: string,
  message: string,
) {
  const { branch } = config();
  const res = await fetch(contentsUrl(repoPath), {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      sha,
      branch,
    }),
  });
  if (res.status === 409) {
    throw new GitHubConflictError(
      "This page changed on GitHub after you opened it. Copy your edits, reload the page and apply them again.",
    );
  }
  if (!res.ok) throw new Error(`GitHub commit failed (${res.status})`);
  const data = (await res.json()) as {
    content: { sha: string };
    commit: { html_url: string };
  };
  return { sha: data.content.sha, commitUrl: data.commit.html_url };
}
