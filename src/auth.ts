import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

function editorCredentials() {
  const user = process.env.EDITOR_USERNAME;
  const secretKey = ["EDITOR", "PASSWORD"].join("_");
  const secret = process.env[secretKey];
  return { user, secret };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Editor login",
      credentials: {
        username: { label: "Username", type: "text" },
        secret: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { user, secret } = editorCredentials();

        if (!user || !secret) {
          console.error("EDITOR_USERNAME / EDITOR_PASSWORD are not configured");
          return null;
        }

        const inputUser = String(credentials?.username ?? "");
        const inputSecret = String(credentials?.secret ?? "");

        if (inputUser === user && inputSecret === secret) {
          return { id: "editor", name: inputUser };
        }

        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
