export const DOC_ROLES = ["admin", "editor", "viewer"] as const;

export type DocRole = (typeof DOC_ROLES)[number];

const ROLE_RANK: Record<DocRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
};

function splitList(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

function asStringList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch {
      // comma / space separated fallback
    }
    return value
      .split(/[,\s]+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

/** Read group/role claim names from a profile or token payload. */
export function extractClaimValues(
  source: Record<string, unknown> | null | undefined,
): string[] {
  if (!source) return [];

  const claimNames = splitList(
    process.env.AUTHENTIK_ROLE_CLAIM || "groups,roles",
  );
  const values: string[] = [];

  for (const name of claimNames) {
    values.push(...asStringList(source[name]));
  }

  // Authentik sometimes nests groups under `ak_groups` or `https://…/groups`
  for (const [key, value] of Object.entries(source)) {
    if (/groups?$/i.test(key) || /roles?$/i.test(key)) {
      values.push(...asStringList(value));
    }
  }

  return [...new Set(values.map((v) => v.toLowerCase()))];
}

function groupMap(role: DocRole): string[] {
  const envKey =
    role === "admin"
      ? "AUTHENTIK_ADMIN_GROUPS"
      : role === "editor"
        ? "AUTHENTIK_EDITOR_GROUPS"
        : "AUTHENTIK_VIEWER_GROUPS";

  const defaults =
    role === "admin"
      ? ["docs-admin", "premier-docs-admin"]
      : role === "editor"
        ? ["docs-editor", "premier-docs-editor"]
        : ["docs-viewer", "premier-docs-viewer"];

  const configured = splitList(process.env[envKey]);
  return configured.length > 0 ? configured : defaults;
}

/** Map Authentik groups/claims → docs roles. */
export function mapRolesFromClaims(
  source: Record<string, unknown> | null | undefined,
): DocRole[] {
  const claims = extractClaimValues(source);
  if (claims.length === 0) return [];

  const roles = new Set<DocRole>();

  for (const role of DOC_ROLES) {
    const groups = groupMap(role);
    if (claims.some((claim) => groups.includes(claim))) {
      roles.add(role);
    }
  }

  // Also accept exact role names in the claim list
  for (const role of DOC_ROLES) {
    if (claims.includes(role)) roles.add(role);
  }

  return [...roles].sort((a, b) => ROLE_RANK[b] - ROLE_RANK[a]);
}

export function hasRole(
  roles: readonly string[] | null | undefined,
  required: DocRole,
) {
  const list = (roles ?? []).filter((role): role is DocRole =>
    DOC_ROLES.includes(role as DocRole),
  );
  if (list.includes("admin")) return true;
  if (required === "viewer") {
    return list.some((role) => ROLE_RANK[role] >= ROLE_RANK.viewer);
  }
  if (required === "editor") {
    return list.some((role) => ROLE_RANK[role] >= ROLE_RANK.editor);
  }
  return list.includes("admin");
}

export function canReadEditor(roles: readonly string[] | null | undefined) {
  return hasRole(roles, "viewer");
}

export function canEditDocs(roles: readonly string[] | null | undefined) {
  return hasRole(roles, "editor");
}

export function credentialsFallbackEnabled() {
  return process.env.AUTH_CREDENTIALS_ENABLED === "true";
}

export function authentikConfigured() {
  return Boolean(
    process.env.AUTHENTIK_ISSUER &&
      process.env.AUTHENTIK_CLIENT_ID &&
      process.env.AUTHENTIK_CLIENT_SECRET,
  );
}
