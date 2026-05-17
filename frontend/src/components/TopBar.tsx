"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

export function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    api.me().then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-bg/90 backdrop-blur-md border-b border-line">
      <div className="max-w-content mx-auto px-8 py-3.5 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 font-serif text-[19px] font-medium tracking-tight">
          <span className="w-7 h-7 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
            style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.78 0.07 165), oklch(0.45 0.07 165) 60%, oklch(0.32 0.05 165))" }} />
          <span>DermDiag<span className="text-ink-3 font-light"> · ES</span></span>
        </Link>
        <div className="font-mono text-[11px] text-ink-3 tracking-[0.06em] uppercase flex gap-5 items-center">
          {ready && user ? (
            <>
              <Link href="/cases" className="hover:text-ink">Cases</Link>
              <span className="text-ink">{user.email}</span>
              <button onClick={() => { setToken(null); location.href = "/"; }}
                className="hover:text-ink">Sign out</button>
            </>
          ) : ready ? (
            <>
              <Link href="/login" className="hover:text-ink">Sign in</Link>
              <Link href="/register"
                className="bg-accent-soft text-accent-2 rounded-full px-2.5 py-1 text-[10px] tracking-[0.08em] hover:bg-accent hover:text-white">
                Create account
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
