/**
 * Mock auth. There is no backend: "logging in" sets a cookie holding only a
 * display name. Emails and codes are never stored or sent anywhere. It's a
 * cookie rather than localStorage so the server can render the right view on
 * first paint.
 */

export const SESSION_COOKIE = "mock-session";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const FALLBACK_NAME = "Demo User";
const MAX_NAME_LENGTH = 30;

export interface SessionUser {
  name: string;
}

export function parseSession(value: string | undefined): SessionUser | null {
  if (!value) return null;
  try {
    const name = decodeURIComponent(value).trim();
    return name ? { name } : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (name: string) =>
  `${SESSION_COOKIE}=${encodeURIComponent(name)}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;

export const clearedSessionCookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;

/** "ada.lovelace@example.com" becomes "Ada.lovelace". */
export function displayNameFromEmail(email: string): string {
  const localPart = email.trim().split("@")[0].slice(0, MAX_NAME_LENGTH);
  if (!localPart) return FALLBACK_NAME;
  return localPart[0].toUpperCase() + localPart.slice(1);
}

/** Masks an address the way the real code screen does: "a*****e@e**e.com". */
export function maskEmail(email: string): string {
  const [local, domain] = email.trim().split("@");
  const maskPart = (part: string, stars: number) =>
    part.length <= 2 ? part : `${part[0]}${"*".repeat(stars)}${part[part.length - 1]}`;
  if (!domain) return maskPart(local, 5);
  const [host, ...rest] = domain.split(".");
  return `${maskPart(local, 5)}@${maskPart(host, 2)}${rest.length ? `.${rest.join(".")}` : ""}`;
}

/** Only same-site paths, so a crafted ?next= can't send anyone elsewhere. */
export function safeNextPath(next: string | undefined | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return "/";
  }
  return next;
}

export function loginHref(returnTo: string, mode?: "signup"): string {
  const params = new URLSearchParams({ next: returnTo });
  if (mode) params.set("mode", mode);
  return `/login?${params.toString()}`;
}
