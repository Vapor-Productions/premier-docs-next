import type { DefaultSession } from "next-auth";
import type { DocRole } from "@/lib/roles";

declare module "next-auth" {
  interface Session {
    user: {
      roles: DocRole[];
    } & DefaultSession["user"];
  }

  interface User {
    roles?: DocRole[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: DocRole[];
  }
}
