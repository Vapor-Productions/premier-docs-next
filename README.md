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

```bash
npx vercel login
npx vercel --prod
```

Or connect this directory to a Vercel project in the dashboard (Framework: Next.js).

### Custom domain cutover for `docs.premierplanner.eu`

Today DNS points at Mintlify (`CNAME docs → cname.mintlify.builders`, proxied on Cloudflare zone `premierplanner.eu`).

1. Deploy this app to Vercel and confirm a preview URL works, including `/guides/riot-account-linking/riot.txt`.
2. In Vercel → Project → Domains → add `docs.premierplanner.eu`.
3. In Cloudflare DNS for `premierplanner.eu`, change the `docs` record from Mintlify to the target Vercel shows (often `cname.vercel-dns.com`), keep **Proxied** or follow Vercel’s DNS instructions.
4. Wait for TLS + propagation, then:

```bash
curl -sS -D- https://docs.premierplanner.eu/guides/riot-account-linking/riot.txt
```

Expect `200` and the exact UUID body.

5. In the Riot developer portal, click **Verify URL**.
6. Disconnect the Mintlify custom domain so it no longer competes for `docs.premierplanner.eu`.

## Branding

- Primary: `#FF4655`
- Dark background: `#0F1923`
- Gold accents from existing logo assets in `public/logo/`
