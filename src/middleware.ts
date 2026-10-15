import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { canReadEditor } from "@/lib/roles";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const roles = req.auth?.user?.roles ?? [];
  const isLoggedIn = Boolean(req.auth?.user);
  const needsAuth =
    pathname.startsWith("/editor") || pathname.startsWith("/api/docs");

  if (needsAuth) {
    if (!isLoggedIn) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(login);
    }

    if (!canReadEditor(roles)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(login);
    }
  }

  if (pathname === "/login" && isLoggedIn && canReadEditor(roles)) {
    return NextResponse.redirect(new URL("/editor", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/editor/:path*", "/api/docs/:path*", "/login"],
};
