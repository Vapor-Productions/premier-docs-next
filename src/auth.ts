import NextAuth from "next-auth";
import Authentik from "next-auth/providers/authentik";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { authConfig } from "./auth.config";
import {
  authentikConfigured,
  credentialsFallbackEnabled,
  type DocRole,
} from "@/lib/roles";

function editorCredentials() {
  const user = process.env.EDITOR_USERNAME;
  const secretKey = ["EDITOR", "PASSWORD"].join("_");
  const secret = process.env[secretKey];
  return { user, secret };
}

function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  if (authentikConfigured()) {
    providers.push(
      Authentik({
        clientId: process.env.AUTHENTIK_CLIENT_ID!,
        clientSecret: process.env.AUTHENTIK_CLIENT_SECRET!,
        issuer: process.env.AUTHENTIK_ISSUER!,
        authorization: {
          params: {
            scope: "openid email profile groups",
          },
        },
      }),
    );
  }

  if (credentialsFallbackEnabled()) {
    providers.push(
      Credentials({
        id: "credentials",
        name: "Local fallback",
        credentials: {
          username: { label: "Username", type: "text" },
          secret: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const { user, secret } = editorCredentials();
          if (!user || !secret) return null;

          const inputUser = String(credentials?.username ?? "");
          const inputSecret = String(credentials?.secret ?? "");

          if (inputUser === user && inputSecret === secret) {
            return {
              id: "local-admin",
              name: inputUser,
              roles: ["admin"] satisfies DocRole[],
            };
          }

          return null;
        },
      }),
    );
  }

  return providers;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: buildProviders(),
  secret: process.env.AUTH_SECRET,
});
