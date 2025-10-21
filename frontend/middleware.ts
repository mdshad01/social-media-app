import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // ✅ Temporarily disable all protection
  return NextResponse.next();

  /* Comment out all this:
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt")?.value;
  
  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (pathname.startsWith("/auth") && !token) {
    return NextResponse.next();
  }
  
  if ((pathname === "/" || pathname.startsWith("/profile")) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  return NextResponse.next();
  */
}

// export const config = {
//   matcher: ["/", "/profile/:path*", "/auth/:path*"],
// };
