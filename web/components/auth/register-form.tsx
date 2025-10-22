"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";

type FieldErrors = Record<string, string[]>;

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Не удалось зарегистрироваться" }));
        if (data.errors) {
          setFieldErrors(data.errors as FieldErrors);
          setError("Проверьте введённые данные");
        } else {
          setError(data.error ?? "Не удалось зарегистрироваться");
        }
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-white/70" htmlFor="name">
          Имя
        </label>
        <Input
          id="name"
          placeholder="Алексей Петров"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {fieldErrors.name ? (
          <p className="text-sm text-red-300">{fieldErrors.name.join(". ")}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {fieldErrors.email ? (
          <p className="text-sm text-red-300">{fieldErrors.email.join(". ")}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70" htmlFor="password">
          Пароль
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Минимум 8 символов"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {fieldErrors.password ? (
          <p className="text-sm text-red-300">{fieldErrors.password.join(". ")}</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? "Создаём аккаунт..." : "Создать аккаунт"}
      </button>
      <p className="text-center text-sm text-white/60">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-accent hover:text-white">
          Войти
        </Link>
      </p>
    </form>
  );
}
