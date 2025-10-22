"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { TOKEN_COOKIE_NAME } from "@/lib/session";

type RegisterFormState = {
  ok: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  values: {
    name: string;
    email: string;
  };
};

const registerSchema = z.object({
  name: z.string().min(1, { message: "Имя обязательно" }).max(100),
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(8, { message: "Минимальная длина пароля — 8 символов" }),
});

const INITIAL_REGISTER_STATE: RegisterFormState = {
  ok: false,
  error: null,
  fieldErrors: {},
  values: {
    name: "",
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

function mapErrors(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { error: "Не удалось зарегистрироваться", fieldErrors: {} as Record<string, string[]> };
  }

  const data = payload as {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  const errorMessage = data.error ?? data.message ?? "Не удалось зарегистрироваться";
  const fieldErrors = data.errors ?? {};

  return { error: errorMessage, fieldErrors };
}

export const registerAction = (async (
  _prevState: RegisterFormState,
  formData: FormData,
) => {
  const fields = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = registerSchema.safeParse(fields);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      ok: false,
      error: "Проверьте введённые данные",
      fieldErrors,
      values: {
        name: fields.name,
        email: fields.email,
      },
    };
  }

  const apiUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
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
      const { error, fieldErrors } = mapErrors(errorPayload);
      return {
        ok: false,
        error,
        fieldErrors,
        values: {
          name: parsed.data.name,
          email: parsed.data.email,
        },
      };
    }

    const payload = await response.json().catch(() => null);
    const token = extractToken(payload);

    if (token) {
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
          name: "",
          email: "",
        },
      };
    }

    redirect("/login");
    return {
      ok: true,
      error: null,
      fieldErrors: {},
      values: {
        name: "",
        email: "",
      },
    };
  } catch (error) {
    console.error("registerAction failed", error);
    return {
      ok: false,
      error: "Не удалось подключиться к сервису авторизации",
      fieldErrors: {},
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
      },
    };
  }

  return INITIAL_REGISTER_STATE;
}) satisfies (
  (prevState: RegisterFormState, formData: FormData) => Promise<RegisterFormState>
);

export { INITIAL_REGISTER_STATE };
export type { RegisterFormState };
