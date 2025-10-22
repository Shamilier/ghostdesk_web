import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** merge tailwind + clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Функция для окрашивания бейджей по тегу */
export function getTagColor(tag: string) {
  const key = tag.toLowerCase();

  const map: Record<string, string> = {
    success: "bg-green-600/20 text-green-300 ring-1 ring-inset ring-green-500/30",
    error:   "bg-red-600/20 text-red-300 ring-1 ring-inset ring-red-500/30",
    warning: "bg-yellow-600/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30",
    info:    "bg-blue-600/20 text-blue-300 ring-1 ring-inset ring-blue-500/30",
    gray:    "bg-gray-700 text-gray-200 ring-1 ring-inset ring-gray-500/30",
  };

  return map[key] ?? map.gray;
}
