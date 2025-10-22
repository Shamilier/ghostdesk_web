import Link from "next/link";
import { redirect } from "next/navigation";


import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Вход — GhostDesk",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
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
