import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Универсальный маппер цвета бейджа.
 *  Принимает как строку (статусы), так и число (индексы в списках).
 */
export function getTagColor(tag: string | number | null | undefined) {
  // Палитра на случай числовых индексов
  const palette = [
    "bg-blue-600/20 text-blue-300 ring-1 ring-inset ring-blue-500/30",
    "bg-green-600/20 text-green-300 ring-1 ring-inset ring-green-500/30",
    "bg-yellow-600/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30",
    "bg-red-600/20 text-red-300 ring-1 ring-inset ring-red-500/30",
    "bg-gray-700 text-gray-200 ring-1 ring-inset ring-gray-500/30",
  ];

  if (typeof tag === "number") {
    const i = Math.abs(tag) % palette.length;
    return palette[i];
  }

  const key = (tag ?? "").toString().toLowerCase();
  const map: Record<string, string> = {
    success: palette[1],
    ok:      palette[1],
    done:    palette[1],

    error:   palette[3],
    danger:  palette[3],
    failed:  palette[3],

    warning: palette[2],
    pending: palette[2],

    info:    palette[0],
    blue:    palette[0],

    gray:    palette[4],
    default: palette[4],
  };

  return map[key] ?? map.default;
}
