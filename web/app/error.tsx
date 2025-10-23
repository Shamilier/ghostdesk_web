"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App rendering failed", error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Что-то пошло не так</h1>
          <p className="text-sm text-white/70">
            Мы уже разбираемся с проблемой. Попробуйте обновить страницу или вернуться чуть позже.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-accent/80"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
