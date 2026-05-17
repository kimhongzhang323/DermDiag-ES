"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      if (password.length < 8) throw new Error("Password must be at least 8 characters");
      const r = await api.register(email, password, displayName || undefined);
      setToken(r.token);
      router.push("/cases");
    } catch (ex) { setErr((ex as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-md mx-auto card p-10">
      <div className="label-mono mb-3">§ Create account</div>
      <h1 className="font-serif text-4xl font-light tracking-tight m-0 mb-7">Start a case history.</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Display name (optional)" type="text" value={displayName} onChange={setDisplayName} required={false} />
        <Field label="Password (min 8 chars)" type="password" value={password} onChange={setPassword} />
        {err && <p className="text-warn text-sm m-0">{err}</p>}
        <button className="btn mt-2" disabled={busy}>{busy ? "Creating…" : "Create account"} <span className="font-mono text-xs">→</span></button>
      </form>
      <p className="text-sm text-ink-3 mt-6">
        Already registered? <Link href="/login" className="text-accent-2 underline">Sign in</Link>.
      </p>
    </div>
  );
}

function Field({ label, type, value, onChange, required = true }: {
  label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="label-mono block mb-2">{label}</span>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-3 bg-bg border border-line rounded text-ink focus:outline-none focus:border-ink" />
    </label>
  );
}
