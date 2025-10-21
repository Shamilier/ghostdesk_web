import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Регистрация — GhostDesk",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">GhostDesk</p>
          <h1 className="text-2xl font-semibold text-white">Аккаунт уже активен</h1>
          <p className="text-sm text-white/60">{user.email}</p>
        </div>
        <div className="flex flex-col gap-3">
          <LogoutButton />
          <Link href="/auth/login" className="text-sm text-white/60 underline-offset-4 hover:underline">
            Войти другим пользователем
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
        <h1 className="mt-3 text-2xl font-semibold text-white">Создайте аккаунт GhostDesk</h1>
        <p className="mt-2 text-sm text-white/60">
          Сохраняйте записи, расшифровки и инсайты. Управляйте доступом в команде и делитесь главами.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
