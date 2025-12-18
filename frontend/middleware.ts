import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt")?.value;

  // ✅ Public routes that don't need authentication
  const publicRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // ✅ If user has token and tries to access auth pages, redirect to home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ If user doesn't have token and tries to access protected pages, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ✅ Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/settings/:path*",
    "/activity/:path*",
    "/auth/:path*",
  ],
};
