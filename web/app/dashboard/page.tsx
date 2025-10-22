import { redirect } from "next/navigation";

import { ApiKeyCard } from "@/components/dashboard/api-key-card";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Личный кабинет — GhostDesk",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const createdAt = new Date(user.createdAt);
  const formattedCreatedAt = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(createdAt);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(119,102,255,0.2),_transparent_60%)]" />
      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:px-8 lg:px-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">GhostDesk</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Личный кабинет</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Управляйте своим доступом, API-ключами и интеграциями. Здесь вы найдёте всё необходимое для подключения GhostDesk к
            вашим рабочим процессам.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <ApiKeyCard apiKey={user.apiKey} />
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Профиль</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Состояние аккаунта</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Мы подготовили быстрый обзор вашего аккаунта. Проверьте, что данные актуальны — именно они используются при
                формировании отчётов и экспорта.
              </p>
            </div>
            <dl className="mt-6 space-y-3 text-sm text-white/80">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <dt className="text-white/60">Имя</dt>
                <dd className="font-medium text-white">{user.name}</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <dt className="text-white/60">Email</dt>
                <dd className="font-medium text-white">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <dt className="text-white/60">С нами с</dt>
                <dd className="font-medium text-white">{formattedCreatedAt}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Следующие шаги</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Подключите GhostDesk к любимому приложению заметок или CRM, указав API-ключ.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Настройте сохранение записей встреч, чтобы никакой инсайт не потерялся.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Следите за журналом активности — раздел появится здесь, чтобы вы могли отслеживать запросы к API.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Скоро в кабинете</h2>
            <p className="mt-4 text-sm text-white/70">
              Мы работаем над тем, чтобы кабинет помогал управлять всей экосистемой GhostDesk:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                История запросов: прозрачный лог обращений к API для контроля безопасности.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Управление командами: приглашайте коллег и контролируйте права доступа.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Настройки интеграций: подключайте Slack, Notion и другие сервисы без кода.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
