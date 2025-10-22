"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/env";
import { TOKEN_COOKIE_NAME } from "@/lib/session";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

type RegisterFormState = {
  error: string | null;
  fieldErrors: Partial<Record<keyof RegisterFormValues, string[]>>;
  values: RegisterFormValues;
};

const EMPTY_VALUES: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
};

type BuildStateArgs = Partial<Omit<RegisterFormState, "values">> & {
  values?: Partial<RegisterFormValues>;
};

function buildState(partial: BuildStateArgs = {}): RegisterFormState {
  return {
    error: partial.error ?? null,
    fieldErrors: partial.fieldErrors ?? {},
    values: {
      ...EMPTY_VALUES,
      ...(partial.values ?? {}),
    },
  };
}

const registerSchema = z.object({
  name: z.string().min(1, { message: "Имя обязательно" }).max(100),
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(8, { message: "Минимальная длина пароля — 8 символов" }),
});

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
    return {
      error: "Не удалось зарегистрироваться",
      fieldErrors: {} as RegisterFormState["fieldErrors"],
    };
  }

  const data = payload as {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  const errorMessage = data.error ?? data.message ?? "Не удалось зарегистрироваться";
  const fieldErrors = (data.errors ?? {}) as RegisterFormState["fieldErrors"];

  return { error: errorMessage, fieldErrors };
}

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const fields: RegisterFormValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = registerSchema.safeParse(fields);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return buildState({
      error: "Проверьте введённые данные",
      fieldErrors: fieldErrors as RegisterFormState["fieldErrors"],
      values: {
        name: fields.name,
        email: fields.email,
      },
    });
  }

  const apiUrl = getApiBaseUrl();

  if (!apiUrl) {
    return buildState({
      error: "Сервис недоступен: не настроен API URL",
      fieldErrors: {},
      values: {
        name: fields.name,
        email: fields.email,
      },
    });
  }

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
      return buildState({
        error,
        fieldErrors,
        values: {
          name: parsed.data.name,
          email: parsed.data.email,
        },
      });
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
    }

    redirect("/login");
  } catch (error) {
    console.error("registerAction failed", error);
    return buildState({
      error: "Не удалось подключиться к сервису авторизации",
      fieldErrors: {},
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
      },
    });
  }

  return buildState({});
}

export type { RegisterFormState };
