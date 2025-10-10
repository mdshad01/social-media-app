import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the JWT cookie (this is what your backend uses)
  const token = request.cookies.get("jwt")?.value;

  // If logged in and trying to access auth pages, redirect to home
  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in and trying to access auth pages, allow access
  if (pathname.startsWith("/auth") && !token) {
    return NextResponse.next();
  }

  // Protect home and profile routes (redirect to login if no token)
  if ((pathname === "/" || pathname.startsWith("/profile")) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path*", "/auth/:path*"],
};
