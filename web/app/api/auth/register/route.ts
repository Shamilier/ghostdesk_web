import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, setSessionCookie } from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(8, { message: "Минимальная длина пароля — 8 символов" }),
  name: z.string().min(1, { message: "Имя обязательно" }).max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existingUser) {
    return NextResponse.json(
      { error: "Пользователь с таким email уже существует" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
    },
  });

  const session = await createSession(user.id);
  setSessionCookie(session.token, session.expiresAt);

  return NextResponse.json({ success: true });
}
