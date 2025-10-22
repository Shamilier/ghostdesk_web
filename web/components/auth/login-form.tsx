"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAction, type LoginFormState } from "@/app/(auth)/login/actions";
import { FormSubmitButton } from "@/components/auth/form-submit-button";
import { Input } from "@/components/ui/input";

const INITIAL_LOGIN_STATE: LoginFormState = {
  error: null,
  fieldErrors: {},
  values: {
    email: "",
  },
};

export function LoginForm() {
  const [state, formAction] = useFormState<LoginFormState, FormData>(loginAction, INITIAL_LOGIN_STATE);
  const emailErrors = state.fieldErrors?.email ?? [];

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-white/70" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          defaultValue={state.values?.email ?? ""}
        />
        {emailErrors.length ? (
          <p className="text-sm text-red-300">{emailErrors.join(". ")}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70" htmlFor="password">
          Пароль
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        {state.fieldErrors?.password ? (
          <p className="text-sm text-red-300">{state.fieldErrors.password.join(". ")}</p>
        ) : null}
      </div>
      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <FormSubmitButton idleLabel="Войти" pendingLabel="Входим..." />
      <p className="text-center text-sm text-white/60">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-accent hover:text-white">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
