import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";

import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "ghostdesk_session";
const SESSION_LIFETIME_DAYS = 30;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
};

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = addDays(new Date(), SESSION_LIFETIME_DAYS);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function deleteSession(token: string) {
  await prisma.session.delete({ where: { token } }).catch(() => {
    // Сессия могла быть удалена ранее
  });
}

export function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session) {
    clearSessionCookie();
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token: sessionToken } }).catch(() => undefined);
    clearSessionCookie();
    return null;
  }

  const { user } = session;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    apiKey: user.apiKey,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
