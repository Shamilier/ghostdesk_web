"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const timezones = [
  { value: "Europe/Moscow", label: "UTC+3 (Москва)" },
  { value: "Europe/Berlin", label: "UTC+1 (Берлин)" },
  { value: "Europe/London", label: "UTC (Лондон)" },
  { value: "Asia/Almaty", label: "UTC+6 (Алматы)" },
];

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    timezone: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [timezone, setTimezone] = useState(user.timezone ?? timezones[0].value);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setIsLoading(true);

    const response = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, timezone }),
    });

    if (!response.ok) {
      setStatus("error");
      setIsLoading(false);
      return;
    }

    setStatus("success");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-white/70">
      <div className="grid gap-1">
        <span>Email</span>
        <Input value={user.email} disabled className="bg-white/10 text-white/70" />
      </div>
      <div className="grid gap-1">
        <label htmlFor="name">Имя</label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="timezone">Часовой пояс</label>
        <select
          id="timezone"
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {timezones.map((item) => (
            <option key={item.value} value={item.value} className="bg-surface text-black">
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {status === "success" ? (
        <p className="text-xs text-emerald-300">Профиль обновлён</p>
      ) : null}
      {status === "error" ? (
        <p className="text-xs text-red-300">Не удалось сохранить изменения. Попробуйте ещё раз.</p>
      ) : null}
      <Button type="submit" variant="primary" size="sm" className="px-4" disabled={isLoading}>
        {isLoading ? "Сохраняем..." : "Сохранить"}
      </Button>
    </form>
  );
}
