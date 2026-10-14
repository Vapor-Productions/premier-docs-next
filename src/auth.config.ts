import type { NextAuthConfig } from "next-auth";
import {
  canReadEditor,
  credentialsFallbackEnabled,
  mapRolesFromClaims,
  type DocRole,
} from "@/lib/roles";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  trustHost: true,
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const roles = auth?.user?.roles ?? [];
      const loggedIn = Boolean(auth?.user);

      if (pathname.startsWith("/editor") || pathname.startsWith("/api/docs")) {
        return loggedIn && canReadEditor(roles);
      }

      return true;
    },
    async signIn({ account, profile, user }) {
      if (account?.provider === "authentik") {
        const roles = mapRolesFromClaims(
          (profile ?? {}) as Record<string, unknown>,
        );
        if (roles.length === 0) return "/login?error=AccessDenied";
        user.roles = roles;
        return true;
      }

      if (account?.provider === "credentials") {
        if (!credentialsFallbackEnabled()) return false;
        user.roles = ["admin"] satisfies DocRole[];
        return true;
      }

      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "authentik" && profile) {
        token.roles = mapRolesFromClaims(
          profile as Record<string, unknown>,
        );
      }

      if (account?.provider === "credentials" || user?.roles) {
        token.roles = user?.roles ?? (["admin"] satisfies DocRole[]);
      }

      if (!token.roles) {
        token.roles = [];
      }

      return token;
    },
    async session({ session, token }) {
      session.user.roles = (token.roles as DocRole[]) ?? [];
      return session;
    },
  },
} satisfies NextAuthConfig;
