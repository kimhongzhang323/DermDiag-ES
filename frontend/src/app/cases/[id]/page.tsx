"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, getToken } from "@/lib/api";
import { Results } from "@/components/Results";
import type { CaseDetail } from "@/lib/types";

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<CaseDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    api.getCase(id).then(setData).catch(e => setErr((e as Error).message));
  }, [id, router]);

  if (err) return <p className="text-warn">{err}</p>;
  if (!data) return <p className="text-ink-3 font-mono text-xs">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex gap-4 items-baseline flex-wrap">
        <Link href="/cases" className="font-mono text-[11px] text-ink-3 hover:text-ink tracking-[0.08em] uppercase">
          ← All cases
        </Link>
        <span className="label-mono">Saved {new Date(data.createdAt).toLocaleString()}</span>
      </div>
      <Results
        result={data.result}
        facts={data.facts}
        onBack={() => router.push("/cases")}
        onReset={() => router.push("/")}
        canSave={false}
      />
    </div>
  );
}
