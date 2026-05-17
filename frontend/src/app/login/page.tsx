"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      const r = await api.login(email, password);
      setToken(r.token);
      router.push("/cases");
    } catch (ex) { setErr((ex as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-md mx-auto card p-10">
      <div className="label-mono mb-3">§ Sign in</div>
      <h1 className="font-serif text-4xl font-light tracking-tight m-0 mb-7">Welcome back.</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {err && <p className="text-warn text-sm m-0">{err}</p>}
        <button className="btn mt-2" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <span className="font-mono text-xs">→</span></button>
      </form>
      <p className="text-sm text-ink-3 mt-6">
        No account? <Link href="/register" className="text-accent-2 underline">Create one</Link>.
      </p>
    </div>
  );
}

function Field({ label, type, value, onChange }: {
  label: string; type: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="label-mono block mb-2">{label}</span>
      <input type={type} required value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-3 bg-bg border border-line rounded text-ink focus:outline-none focus:border-ink" />
    </label>
  );
}
