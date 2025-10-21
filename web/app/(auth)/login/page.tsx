import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Вход — GhostDesk",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">GhostDesk</p>
          <h1 className="text-2xl font-semibold text-white">Вы уже вошли</h1>
          <p className="text-sm text-white/60">{user.email}</p>
        </div>
        <div className="flex flex-col gap-3">
          <LogoutButton />
          <Link href="/auth/register" className="text-sm text-white/60 underline-offset-4 hover:underline">
            Создать другой аккаунт
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-xs uppercase tracking-[0.2em] text-white/50">
          GhostDesk
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-white">Добро пожаловать назад</h1>
        <p className="mt-2 text-sm text-white/60">
          Войдите, чтобы вернуться к историям встреч, тегам и поиску по всем инсайтам.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
