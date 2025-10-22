import { randomBytes } from "crypto";

export function generateApiKey() {
  const raw = randomBytes(24).toString("base64url");
  return `gd_${raw}`;
}
