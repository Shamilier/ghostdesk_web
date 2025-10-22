"use client";

import { useState } from "react";

type ApiKeyCardProps = {
  apiKey: string;
};

export function ApiKeyCard({ apiKey }: ApiKeyCardProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (error) {
      console.error("Failed to copy API key", error);
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const buttonLabel =
    copyState === "copied" ? "Скопировано" : copyState === "error" ? "Ошибка" : "Скопировать";

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Интеграция</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Ваш API-ключ</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Скопируйте этот ключ и вставьте его в приложение GhostDesk. Храните его в секрете — ключ открывает доступ к вашим данным.
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-accent">{apiKey}</div>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-black transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={copyState === "copied"}
        >
          {buttonLabel}
        </button>
        {copyState === "error" ? (
          <p className="text-xs text-red-300">Не удалось скопировать ключ. Попробуйте ещё раз вручную.</p>
        ) : null}
      </div>
    </div>
  );
}
