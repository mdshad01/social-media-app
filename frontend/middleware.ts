import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt")?.value;

  // ✅ Public routes that don't need authentication
  const publicRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // ✅ Verification route (needs auth but not verification)
  const isVerifyRoute = pathname.startsWith("/auth/verify");

  // ✅ No token - redirect to login (except public routes and verify)
  if (!token && !isPublicRoute && !isVerifyRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ✅ Has token and trying to access public routes (except verify) - redirect to home
  if (token && isPublicRoute && !isVerifyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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
