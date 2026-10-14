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
# set AUTH_SECRET + Authentik OIDC vars (or AUTH_CREDENTIALS_ENABLED=true)
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

## Docs editor (Authentik OIDC)

- Public docs: no login required
- Editor: `/editor` → `/login` when signed out
- Primary auth: **Authentik OIDC** via Auth.js (`next-auth` Authentik provider)
- Optional break-glass: credentials provider when `AUTH_CREDENTIALS_ENABLED=true`

### Role model

| Role | Authentik groups (default) | Capabilities |
| --- | --- | --- |
| `admin` | `docs-admin`, `premier-docs-admin` | Full editor access (same save rights as editor for now) |
| `editor` | `docs-editor`, `premier-docs-editor` | List / read / edit / save MDX |
| `viewer` | `docs-viewer`, `premier-docs-viewer` | List / read / preview only (save → 403) |

Roles are stored on the session as `session.user.roles` and enforced in `/api/docs` + the editor UI.

Override group names with `AUTHENTIK_ADMIN_GROUPS`, `AUTHENTIK_EDITOR_GROUPS`, `AUTHENTIK_VIEWER_GROUPS`.

### Env vars

See `.env.example`. Required for OIDC:

- `AUTH_SECRET`
- `AUTH_URL` (e.g. `https://docs.premierplanner.eu`)
- `AUTHENTIK_ISSUER` (e.g. `https://auth.zvapor.xyz/application/o/premier-docs/`)
- `AUTHENTIK_CLIENT_ID`
- `AUTHENTIK_CLIENT_SECRET`

### Authentik console setup

SSO host already in use: **https://auth.zvapor.xyz**

1. **Applications → Create** with Provider type **OAuth2/OpenID Provider**.
2. Suggested slug / name: `premier-docs` (issuer becomes `https://auth.zvapor.xyz/application/o/premier-docs/`).
3. **Client type:** Confidential.
4. **Redirect URIs** (strict):
   - `https://docs.premierplanner.eu/api/auth/callback/authentik`
   - `https://premier-docs.vercel.app/api/auth/callback/authentik`
   - `http://localhost:3000/api/auth/callback/authentik` (and/or `:3460` for local)
5. **Scopes:** `openid`, `email`, `profile`, and a **groups** scope (Authentik scope mapping that includes group names — e.g. “OpenID ’groups’”).
6. Copy **Client ID**, **Client Secret**, and the provider **OpenID Configuration Issuer** into Vercel / `.env.local`.
7. Create groups (or reuse) `docs-admin`, `docs-editor`, `docs-viewer` and assign users. Bind the application so those groups can access it (policy / group binding).

Login URL: [https://docs.premierplanner.eu/login](https://docs.premierplanner.eu/login)

Note: filesystem saves persist in local/dev. On Vercel the deploy filesystem is ephemeral — use the editor locally (or a later Git-backed save) for durable production edits.

## Deploy (Vercel)

Live production:

- App: [https://premier-docs.vercel.app](https://premier-docs.vercel.app)
- Custom domain: [https://docs.premierplanner.eu](https://docs.premierplanner.eu)
- GitHub: [Vapor-Productions/premier-docs-next](https://github.com/Vapor-Productions/premier-docs-next)
- Vercel project: `premier-docs`

Set Authentik env vars in the Vercel project, then push to `main`.

### Domain / DNS

Cloudflare zone `premierplanner.eu`:

- `docs` → `CNAME cname.vercel-dns.com` (proxied)
- `_vercel` TXT verification for Vercel

Riot Verify URL:

```text
https://docs.premierplanner.eu/guides/riot-account-linking/riot.txt
```
