import { CalendarDays, Globe2, Link as LinkIcon, Shield } from "lucide-react";

import { ProfileForm } from "@/components/settings/profile-form";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();
  const timezoneLabel = user.timezone ?? "Не выбран";
  const createdAt = new Date(user.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/5 bg-surface/80 p-8 shadow-subtle">
        <h1 className="text-2xl font-semibold text-white">Настройки аккаунта</h1>
        <p className="mt-2 text-sm text-white/60">
          Обновляйте личные данные, управляйте рабочим пространством и интеграциями GhostDesk.
        </p>
        <div className="mt-6 grid gap-4 text-sm text-white/70 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/40">Email</p>
            <p className="mt-2 text-white">{user.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/40">Часовой пояс</p>
            <p className="mt-2 text-white">{timezoneLabel}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/40">С GhostDesk с</p>
            <p className="mt-2 text-white">{createdAt}</p>
          </div>
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Профиль</h2>
          <ProfileForm user={{ name: user.name, email: user.email, timezone: user.timezone }} />
        </div>
        <div className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Shield className="h-4 w-4 text-accent" /> Безопасность
          </h2>
          <p className="text-sm text-white/70">
            Двухфакторная аутентификация появится позже. Сейчас можно сбросить пароль через email.
          </p>
          <Button variant="ghost" size="sm" className="self-start text-xs text-white/80">
            Настроить восстановление
          </Button>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 rounded-3xl border border-white/5 bg-white/5 p-6 text-sm text-white/70">
          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <Globe2 className="h-4 w-4 text-accent" /> Интеграции
          </h3>
          <p>Подключите Slack, Notion и календарь, чтобы расшаривать инсайты автоматически.</p>
          <Button variant="ghost" size="sm" className="self-start text-xs text-white/80">
            Управлять интеграциями
          </Button>
        </div>
        <div className="space-y-3 rounded-3xl border border-white/5 bg-white/5 p-6 text-sm text-white/70">
          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <LinkIcon className="h-4 w-4 text-accent" /> API и webhooks
          </h3>
          <p>Генерируйте ключи для экспорта резюме встреч во внутренние CRM и хранилища.</p>
          <Button variant="ghost" size="sm" className="self-start text-xs text-white/80">
            Создать API-ключ
          </Button>
        </div>
        <div className="space-y-3 rounded-3xl border border-white/5 bg-white/5 p-6 text-sm text-white/70">
          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <CalendarDays className="h-4 w-4 text-accent" /> История подписки
          </h3>
          <p>Платёжный биллинг будет подключен на следующем этапе. Сейчас тариф — тестовый.</p>
          <Button variant="ghost" size="sm" className="self-start text-xs text-white/80">
            Управлять тарифом
          </Button>
        </div>
      </section>
    </div>
  );
}
