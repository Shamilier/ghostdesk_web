export function getApiBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();

  if (!raw) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("NEXT_PUBLIC_API_URL is not set");
    }

    return "";
  }

  return raw.replace(/\/+$/, "");
}
