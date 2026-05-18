import { createHash } from "node:crypto";

export { SESSION_COOKIE } from "@/server/auth/constants";

export function createSessionToken(passcode: string) {
  return createHash("sha256").update(passcode).digest("hex");
}
