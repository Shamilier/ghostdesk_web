"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { TOKEN_COOKIE_NAME } from "@/lib/session";

type LoginFormState = {
  ok: boolean;
  error: string | null;
  fieldErrors: Partial<Record<"email" | "password", string[]>>;
  values: {
    email: string;
  };
};

const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(1, { message: "Пароль обязателен" }),
});

const INITIAL_LOGIN_STATE: LoginFormState = {
  ok: false,
  error: null,
  fieldErrors: {},
  values: {
    email: "",
  },
};

function getApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return url.replace(/\/$/, "");
}

function extractToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as {
    token?: string;
    accessToken?: string;
    access_token?: string;
    data?: { token?: string; accessToken?: string; access_token?: string };
  };

  return (
    data.token ??
    data.accessToken ??
    data.access_token ??
    data.data?.token ??
    data.data?.accessToken ??
    data.data?.access_token ??
    null
  );
}

function mapErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const data = payload as { error?: string; message?: string; messages?: string[] };

  if (data.error && typeof data.error === "string") {
    return data.error;
  }

  if (data.message && typeof data.message === "string") {
    return data.message;
  }

  if (Array.isArray(data.messages) && data.messages.length > 0) {
    return String(data.messages[0]);
  }

  return fallback;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const fields = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(fields);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      ok: false,
      error: "Проверьте введённые данные",
      fieldErrors,
      values: {
        email: fields.email,
      },
    };
  }

  const apiUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      return {
        ok: false,
        error: mapErrorMessage(errorPayload, "Не удалось войти"),
        fieldErrors: {},
        values: {
          email: parsed.data.email,
        },
      };
    }

    const payload = await response.json().catch(() => null);
    const token = extractToken(payload);

    if (!token) {
      return {
        ok: false,
        error: "Сервис авторизации не вернул токен",
        fieldErrors: {},
        values: {
          email: parsed.data.email,
        },
      };
    }

    cookies().set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    redirect("/dashboard");
    return {
      ok: true,
      error: null,
      fieldErrors: {},
      values: {
        email: "",
      },
    };
  } catch (error) {
    console.error("loginAction failed", error);
    return {
      ok: false,
      error: "Не удалось подключиться к сервису авторизации",
      fieldErrors: {},
      values: {
        email: parsed.data.email,
      },
    };
  }

  return INITIAL_LOGIN_STATE;
}

export { INITIAL_LOGIN_STATE };
export type { LoginFormState };
