import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, clearSessionCookie, deleteSession } from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  clearSessionCookie();

  return NextResponse.json({ success: true });
}
