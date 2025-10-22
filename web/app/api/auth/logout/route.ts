import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { TOKEN_COOKIE_NAME } from "@/lib/session";

export async function POST() {
  const cookieStore = cookies();

  cookieStore.set(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
