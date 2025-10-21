import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-gradient-to-br from-background via-background to-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(119,102,255,0.25),_transparent_60%)]" />
      <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
          {children}
        </div>
      </div>
      <footer className="px-6 pb-6 text-center text-xs text-white/50">
        GhostDesk © {new Date().getFullYear()} · Второй мозг для записей
      </footer>
    </div>
  );
}
