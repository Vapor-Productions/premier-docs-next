import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);

  const needsAuth =
    pathname.startsWith("/editor") || pathname.startsWith("/api/docs");

  if (needsAuth && !isLoggedIn) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/editor", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/editor/:path*", "/api/docs/:path*", "/login"],
};
