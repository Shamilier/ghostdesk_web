import Link from "next/link";
import { useFormState } from "react-dom";

import { registerAction, INITIAL_REGISTER_STATE, type RegisterFormState } from "@/app/(auth)/register/actions";
import { FormSubmitButton } from "@/components/auth/form-submit-button";
import { Input } from "@/components/ui/input";

type FieldName = "name" | "email" | "password";

type ErrorRecord = Record<FieldName, string[]>;

function getFieldErrors(fieldErrors: Record<string, string[]>, field: FieldName) {
  const value = fieldErrors[field];
  return Array.isArray(value) ? value : [];
}

export function RegisterForm() {
  const [state, formAction] = useFormState<RegisterFormState, FormData>(registerAction, INITIAL_REGISTER_STATE);
  const fieldErrors = state.fieldErrors as ErrorRecord;

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-white/70" htmlFor="name">
          Имя
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Алексей Петров"
          required
          defaultValue={state.values.name}
        />
        {getFieldErrors(fieldErrors, "name").length ? (
          <p className="text-sm text-red-300">{getFieldErrors(fieldErrors, "name").join(". ")}</p>
        ) : null}
      </div>
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
          defaultValue={state.values.email}
        />
        {getFieldErrors(fieldErrors, "email").length ? (
          <p className="text-sm text-red-300">{getFieldErrors(fieldErrors, "email").join(". ")}</p>
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
          placeholder="Минимум 8 символов"
          autoComplete="new-password"
          required
        />
        {getFieldErrors(fieldErrors, "password").length ? (
          <p className="text-sm text-red-300">{getFieldErrors(fieldErrors, "password").join(". ")}</p>
        ) : null}
      </div>
      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <FormSubmitButton idleLabel="Создать аккаунт" pendingLabel="Создаём аккаунт..." />
      <p className="text-center text-sm text-white/60">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-accent hover:text-white">
          Войти
        </Link>
      </p>
    </form>
  );
}
