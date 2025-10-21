"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Не удалось войти" }));
        setError(data.error ?? "Не удалось войти");
        return;
      }

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70" htmlFor="password">
          Пароль
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? "Входим..." : "Войти"}
      </button>
      <p className="text-center text-sm text-white/60">
        Нет аккаунта?{" "}
        <Link href="/auth/register" className="text-accent hover:text-white">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
