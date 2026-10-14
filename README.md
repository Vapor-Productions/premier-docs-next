# Premier Planner Docs (Next.js)

Mintlify-style documentation site for Premier Planner, built with **Next.js 16 App Router + MDX**.

Replaces Mintlify hosting so Riot can verify a plain-text product URL.

## Riot URL verification

Exact file served from `public/`:

`public/guides/riot-account-linking/riot.txt`

Public URL (after cutover):

`https://docs.premierplanner.eu/guides/riot-account-linking/riot.txt`

Body must be exactly:

```text
af78cfac-a9b4-4f5d-98dc-1f7acc85c942
```

(36 characters, no trailing newline)

## Local development

```bash
cd "C:/Files-With-Importance/Discord-Projecten/Bot Documentation/premplan-docs-next"
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
| `/` | `src/app/page.mdx` |
| `/guides/riot-account-linking` | `src/app/guides/riot-account-linking/page.mdx` |
| `/guides/riot-account-linking/riot.txt` | `public/guides/riot-account-linking/riot.txt` |
| `/legal/privacy-policy` | `src/app/legal/privacy-policy/page.mdx` |
| `/legal/terms-of-service` | `src/app/legal/terms-of-service/page.mdx` |

Legacy Mintlify sources remain in sibling folder `../premplan-docs`.

## Deploy (Vercel)

Live production:

- App: [https://premier-docs.vercel.app](https://premier-docs.vercel.app)
- Custom domain: [https://docs.premierplanner.eu](https://docs.premierplanner.eu)
- GitHub: [Vapor-Productions/premier-docs-next](https://github.com/Vapor-Productions/premier-docs-next)
- Vercel project: `premier-docs`

Redeploy after push to `main`, or:

```bash
npx vercel login
npx vercel --prod
```

### Domain / DNS (already cut over)

Cloudflare zone `premierplanner.eu`:

- `docs` → `CNAME cname.vercel-dns.com` (proxied)
- `_vercel` TXT verification for Vercel

Mintlify is no longer the origin for `docs.premierplanner.eu`. You can disconnect the Mintlify custom domain in the Mintlify dashboard when convenient.

Riot Verify URL (use this):

```text
https://docs.premierplanner.eu/guides/riot-account-linking/riot.txt
```

```bash
curl -sS -D- https://docs.premierplanner.eu/guides/riot-account-linking/riot.txt
```

Expect `200` and the exact UUID body.

## Branding

- Primary: `#FF4655`
- Dark background: `#0F1923`
- Gold accents from existing logo assets in `public/logo/`
