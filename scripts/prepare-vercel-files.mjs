import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const skip = new Set([
  "node_modules",
  ".next",
  ".git",
  ".deploy-tmp",
  ".vercel-upload-manifest.json",
  "AGENTS.md",
  "package-lock.json",
]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(".");
const payload = [];
for (const full of files) {
  const rel = full.split(path.sep).join("/");
  const buf = fs.readFileSync(full);
  const sha = crypto.createHash("sha1").update(buf).digest("hex");
  const binary = /\.(png|jpg|jpeg|webp|ico|woff2?)$/i.test(rel);
  payload.push({
    file: rel,
    size: buf.length,
    sha,
    encoding: binary ? "base64" : "utf-8",
    data: binary ? buf.toString("base64") : buf.toString("utf8"),
  });
}

fs.mkdirSync(".deploy-tmp", { recursive: true });
for (const p of payload) {
  const safe = p.file.replace(/[\/\\]/g, "__");
  fs.writeFileSync(path.join(".deploy-tmp", `${safe}.json`), JSON.stringify(p));
}
fs.writeFileSync(
  ".deploy-tmp/_index.json",
  JSON.stringify(
    payload.map(({ file, size, sha, encoding }) => ({
      file,
      size,
      sha,
      encoding,
    })),
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    {
      count: payload.length,
      total: payload.reduce((a, b) => a + b.size, 0),
      files: payload.map((p) => p.file),
    },
    null,
    2,
  ),
);
