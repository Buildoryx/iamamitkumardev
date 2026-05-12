"use client";

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/csrf-constants";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

export async function getCsrfToken(): Promise<string> {
  const existing = readCookie(CSRF_COOKIE_NAME);
  if (existing) return existing;

  const response = await fetch("/api/csrf", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("Unable to initialize request protection.");
  }

  const data = (await response.json().catch(() => null)) as {
    csrfToken?: string;
  } | null;
  const token =
    data?.csrfToken ||
    response.headers.get(CSRF_HEADER_NAME) ||
    readCookie(CSRF_COOKIE_NAME);

  if (!token) {
    throw new Error("Missing request protection token.");
  }

  return token;
}

export async function csrfFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const method = (init.method || "GET").toUpperCase();
  if (SAFE_METHODS.has(method)) {
    return fetch(input, init);
  }

  const headers = new Headers(init.headers);
  if (!headers.has(CSRF_HEADER_NAME)) {
    headers.set(CSRF_HEADER_NAME, await getCsrfToken());
  }

  return fetch(input, {
    ...init,
    credentials: init.credentials || "same-origin",
    headers,
  });
}
