"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import type { CaseRow } from "@/lib/types";

export default function CasesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<CaseRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    api.listCases().then(setRows).catch(e => setErr((e as Error).message));
  }, [router]);

  async function onDelete(id: string) {
    if (!confirm("Delete this case?")) return;
    try { await api.deleteCase(id); setRows(prev => prev?.filter(r => r.id !== id) ?? null); }
    catch (e) { alert((e as Error).message); }
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-line gap-4 flex-wrap">
        <div>
          <div className="label-mono mb-2">§ Case history</div>
          <h1 className="font-serif font-light text-[clamp(34px,5vw,52px)] leading-none tracking-[-0.025em] m-0">
            Your saved cases.
          </h1>
        </div>
        <Link href="/" className="btn">New case <span className="font-mono text-xs">→</span></Link>
      </div>

      {err && <p className="text-warn">{err}</p>}
      {!rows ? <p className="text-ink-3 font-mono text-xs">Loading…</p>
        : rows.length === 0 ? (
          <div className="card p-14 text-center">
            <h3 className="font-serif text-2xl font-normal m-0 mb-2">No cases yet.</h3>
            <p className="text-ink-2 mb-5">Run a diagnosis and save it to build your case history.</p>
            <Link href="/" className="btn">Start a new case</Link>
          </div>
        ) : (
          <ul className="grid gap-3 list-none p-0 m-0">
            {rows.map(c => (
              <li key={c.id} className="card p-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
                <Link href={`/cases/${c.id}`} className="block">
                  <div className="font-serif text-xl text-ink mb-1">{c.title ?? "Untitled case"}</div>
                  <div className="font-mono text-[11px] text-ink-3 tracking-[0.06em] uppercase">
                    {new Date(c.createdAt).toLocaleString()}
                    {c.topDx && <> · {c.topDx.replace(/_/g, " ")}</>}
                    {c.topCf != null && <> · cf={c.topCf}</>}
                    {" · "}{c.verdict}
                  </div>
                </Link>
                <button onClick={() => onDelete(c.id)}
                  className="text-ink-3 hover:text-warn text-xs font-mono uppercase tracking-[0.08em] justify-self-end">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
