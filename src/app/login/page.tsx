import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import {
  authentikConfigured,
  credentialsFallbackEnabled,
} from "@/lib/roles";

export const metadata = {
  title: "Editor login",
};

function errorMessage(code?: string) {
  switch (code) {
    case "AccessDenied":
      return "Your Authentik account is signed in, but it has no docs role (admin / editor / viewer). Ask an admin to add you to the right group.";
    case "Configuration":
      return "Auth is not configured yet. Set Authentik OIDC env vars (or enable the credentials fallback).";
    case "CredentialsSignin":
      return "Invalid username or password.";
    case "OAuthAccountNotLinked":
      return "Could not link this Authentik account.";
    default:
      return code ? "Sign-in failed. Try again." : null;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  // No redirect for signed-in users here: the middleware already sends users who
  // can open the editor to /editor. Redirecting any session from this page looped
  // with the middleware sending users without a docs role back to /login.
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    const roles = session.user.roles ?? [];

    async function signOutAction() {
      "use server";
      await signOut({ redirectTo: "/login" });
    }

    return (
      <div className="auth-shell">
        <div className="auth-card">
          <p className="auth-eyebrow">Premier Planner Docs</p>
          <h1>No editor access</h1>
          <p className="auth-lead">
            Signed in as{" "}
            <strong>{session.user.name || session.user.email || "unknown user"}</strong>
            {session.user.email && session.user.name ? ` (${session.user.email})` : null}.
          </p>
          <p className="auth-error" role="alert">
            {errorMessage("AccessDenied")} Docs roles on this session:{" "}
            {roles.length > 0 ? roles.join(", ") : "none"}.
          </p>
          <form action={signOutAction}>
            <button type="submit" className="auth-primary">
              Sign out
            </button>
          </form>
          <p className="auth-footer">
            <Link href="/">← Back to docs</Link>
          </p>
        </div>
      </div>
    );
  }

  const oidcReady = authentikConfigured();
  const localReady = credentialsFallbackEnabled();
  const callbackUrl = params.callbackUrl || "/editor";
  const message = errorMessage(params.error);

  async function authentikAction() {
    "use server";
    await signIn("authentik", { redirectTo: callbackUrl });
  }

  async function credentialsAction(formData: FormData) {
    "use server";
    const username = String(formData.get("username") ?? "");
    const secret = String(formData.get("secret") ?? "");
    const next = String(formData.get("callbackUrl") || "/editor");

    try {
      await signIn("credentials", {
        username,
        secret,
        redirectTo: next,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(
          `/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(next)}`,
        );
      }
      throw error;
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">Premier Planner Docs</p>
        <h1>Editor login</h1>
        <p className="auth-lead">
          Sign in with Authentik SSO. Public docs stay available without an
          account.
        </p>

        {message ? (
          <p className="auth-error" role="alert">
            {message}
          </p>
        ) : null}

        {!oidcReady && !localReady ? (
          <p className="auth-error" role="alert">
            No login providers are enabled. Set{" "}
            <code>AUTHENTIK_ISSUER</code>, <code>AUTHENTIK_CLIENT_ID</code>,{" "}
            <code>AUTHENTIK_CLIENT_SECRET</code> (and <code>AUTH_SECRET</code>),
            or set <code>AUTH_CREDENTIALS_ENABLED=true</code> for local
            fallback.
          </p>
        ) : null}

        {oidcReady ? (
          <form action={authentikAction}>
            <button type="submit" className="auth-primary">
              Sign in with Authentik
            </button>
          </form>
        ) : null}

        {localReady ? (
          <form action={credentialsAction} className="auth-local">
            {oidcReady ? (
              <p className="auth-divider">or local fallback</p>
            ) : null}
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <label>
              Username
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Password
              <input
                name="secret"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit">Sign in locally</button>
          </form>
        ) : null}

        <p className="auth-footer">
          <Link href="/">← Back to docs</Link>
        </p>
      </div>
    </div>
  );
}
