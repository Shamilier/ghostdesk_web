import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { TOKEN_COOKIE_NAME } from "@/lib/session";

const DASHBOARD_PATH = "/dashboard";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token && request.nextUrl.pathname.startsWith(DASHBOARD_PATH)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
