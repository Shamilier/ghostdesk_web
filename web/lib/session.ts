import { cookies } from "next/headers";

export const TOKEN_COOKIE_NAME = "token";

export function getSession() {
  return cookies().get(TOKEN_COOKIE_NAME)?.value ?? null;
}
