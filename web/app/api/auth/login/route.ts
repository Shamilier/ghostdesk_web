import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-key";

const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(1, { message: "Пароль обязателен" }),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!existingUser) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  const isValid = await verifyPassword(password, existingUser.passwordHash);

  if (!isValid) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  let user = existingUser;

  if (!user.apiKey) {
    const apiKey = generateApiKey();
    user = await prisma.user.update({
      where: { id: user.id },
      data: { apiKey },
    });
  }

  const session = await createSession(user.id);
  setSessionCookie(session.token, session.expiresAt);

  return NextResponse.json({ success: true });
}
