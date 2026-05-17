import type { CaseDetail, CaseRow, Facts, InferenceResult, User } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const TOKEN_KEY = "dermdiag.token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) window.localStorage.setItem(TOKEN_KEY, t);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const tok = getToken();
  if (tok) headers.set("Authorization", `Bearer ${tok}`);
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  diagnose: (facts: Facts) =>
    req<InferenceResult>("/api/diagnose", { method: "POST", body: JSON.stringify(facts) }),
  register: (email: string, password: string, displayName?: string) =>
    req<{ token: string; user: User }>("/api/auth/register", {
      method: "POST", body: JSON.stringify({ email, password, displayName }),
    }),
  login: (email: string, password: string) =>
    req<{ token: string; user: User }>("/api/auth/login", {
      method: "POST", body: JSON.stringify({ email, password }),
    }),
  me: () => req<User>("/api/me"),
  listCases: () => req<CaseRow[]>("/api/cases"),
  getCase: (id: string) => req<CaseDetail>(`/api/cases/${id}`),
  createCase: (title: string, facts: Facts) =>
    req<CaseDetail>("/api/cases", { method: "POST", body: JSON.stringify({ title, facts }) }),
  deleteCase: (id: string) => req<void>(`/api/cases/${id}`, { method: "DELETE" }),
};
