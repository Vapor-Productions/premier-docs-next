# Premier Planner Docs (Next.js)

Mintlify-style documentation site for Premier Planner, built with **Next.js 16 App Router + MDX**.

Replaces Mintlify hosting so Riot can verify a plain-text product URL.

## Riot URL verification

Exact file served from `public/`:

`public/guides/riot-account-linking/riot.txt`

Public URL:

`https://docs.premierplanner.eu/guides/riot-account-linking/riot.txt`

Body must be exactly:

```text
af78cfac-a9b4-4f5d-98dc-1f7acc85c942
```

(36 characters, no trailing newline)

## Local development

```bash
cd "C:/Files-With-Importance/Discord-Projecten/Bot Documentation/premplan-docs-next"
cp .env.example .env.local
# set AUTH_SECRET, EDITOR_USERNAME, EDITOR_PASSWORD
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Verify Riot file:

```bash
curl -sS http://localhost:3000/guides/riot-account-linking/riot.txt
```

## Content map

| URL | Source |
| --- | --- |
| `/` | `src/app/(docs)/page.mdx` |
| `/guides/riot-account-linking` | `src/app/(docs)/guides/riot-account-linking/page.mdx` |
| `/guides/riot-account-linking/riot.txt` | `public/guides/riot-account-linking/riot.txt` |
| `/legal/privacy-policy` | `src/app/(docs)/legal/privacy-policy/page.mdx` |
| `/legal/terms-of-service` | `src/app/(docs)/legal/terms-of-service/page.mdx` |

## Docs editor (auth-gated)

- Public docs: no login required
- Editor: `/editor` (redirects to `/login` when signed out)
- Auth: Auth.js (NextAuth v5) credentials provider
- Env vars: `AUTH_SECRET`, `EDITOR_USERNAME`, `EDITOR_PASSWORD` (see `.env.example`)

Sign in at `/login` with the configured editor username/password. The editor lists MDX pages under `src/app/(docs)/`, edits source, previews text, and saves back to disk via `/api/docs`.

Note: filesystem saves persist in local/dev. On Vercel the deploy filesystem is ephemeral — use the editor locally (or a later Git-backed save) for durable production edits.

## Deploy (Vercel)

Live production:

- App: [https://premier-docs.vercel.app](https://premier-docs.vercel.app)
- Custom domain: [https://docs.premierplanner.eu](https://docs.premierplanner.eu)
- GitHub: [Vapor-Productions/premier-docs-next](https://github.com/Vapor-Productions/premier-docs-next)
- Vercel project: `premier-docs`

Set the auth env vars in the Vercel project, then push to `main` (or `npx vercel --prod`).

### Domain / DNS

Cloudflare zone `premierplanner.eu`:

- `docs` → `CNAME cname.vercel-dns.com` (proxied)
- `_vercel` TXT verification for Vercel

Riot Verify URL:

```text
https://docs.premierplanner.eu/guides/riot-account-linking/riot.txt
```
