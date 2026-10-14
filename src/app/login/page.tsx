import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signIn } from "@/auth";

export const metadata = {
  title: "Editor login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  if (session?.user) {
    redirect(params.callbackUrl || "/editor");
  }

  async function loginAction(formData: FormData) {
    "use server";
    const username = String(formData.get("username") ?? "");
    const secret = String(formData.get("secret") ?? "");
    const callbackUrl = String(formData.get("callbackUrl") || "/editor");

    try {
      await signIn("credentials", {
        username,
        secret,
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(
          `/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
      }
      throw error;
    }
  }

  return (
    <div className="auth-shell">
      <form action={loginAction} className="auth-card">
        <p className="auth-eyebrow">Premier Planner Docs</p>
        <h1>Editor login</h1>
        <p className="auth-lead">
          Sign in to edit documentation pages. Public docs stay available
          without an account.
        </p>
        {params.error ? (
          <p className="auth-error" role="alert">
            Invalid username or password.
          </p>
        ) : null}
        <input
          type="hidden"
          name="callbackUrl"
          value={params.callbackUrl || "/editor"}
        />
        <label>
          Username
          <input name="username" type="text" autoComplete="username" required />
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
        <button type="submit">Sign in</button>
        <p className="auth-footer">
          <Link href="/">← Back to docs</Link>
        </p>
      </form>
    </div>
  );
}
