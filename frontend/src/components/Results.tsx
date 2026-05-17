"use client";

import { useState } from "react";
import { confidenceBand } from "@/lib/kb";
import type { Diagnosis, FiredRule, InferenceResult } from "@/lib/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

function Gauge({ cf }: { cf: number }) {
  const pct = Math.round(cf * 100);
  const band = confidenceBand(cf);
  const lvlColor = band.lvl === "high" ? "text-good" : band.lvl === "med" ? "text-[oklch(0.6_0.08_60)]" : "text-warn";
  return (
    <div className="bg-bg rounded-md p-[18px] border border-line-2">
      <div className="font-serif text-[52px] leading-none font-normal tracking-[-0.02em] text-ink">
        {pct}<em className="not-italic text-[22px] text-ink-3 ml-0.5">%</em>
      </div>
      <div className="label-mono mt-2">Certainty Factor</div>
      <div className="h-1.5 bg-line-2 rounded-full overflow-hidden my-3">
        <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
      <div className={`text-xs ${lvlColor}`}>{band.text}</div>
    </div>
  );
}

function WhyBox({ rules }: { rules: FiredRule[] }) {
  return (
    <div className="mt-4 bg-ink text-[#ece6db] rounded-md px-6 py-[22px] font-mono text-[12.5px] leading-[1.7]">
      <h5 className="m-0 mb-3 text-[10px] tracking-[0.1em] uppercase font-medium text-[oklch(0.78_0.07_165)]">
        Why? · Rule trace
      </h5>
      {rules.map((r, i) => (
        <div key={r.ruleId} className={i < rules.length - 1 ? "mb-3.5 pb-3.5 border-b border-dashed border-[#3a3733]" : ""}>
          <span className="text-[oklch(0.78_0.07_165)]">{r.ruleId}</span>
          {" — "}
          <span className="text-[#8a847a] italic">{r.label}</span>
          <br />
          <span className="text-[oklch(0.78_0.07_165)] font-medium">IF</span> {r.expr}
          {"  "}
          <span className="text-[oklch(0.78_0.07_165)] font-medium">THEN</span> dx={r.dx.replace(/_/g, " ")},{" "}
          <span className="text-[oklch(0.85_0.10_70)]">cf={r.cf}</span>
        </div>
      ))}
    </div>
  );
}

function DxCard({ d, rank, primary }: { d: Diagnosis; rank: number; primary: boolean }) {
  return (
    <div className={`card p-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start ${
      primary ? "!border-accent shadow-[0_0_0_4px_var(--tw-shadow-color)] shadow-accent-soft" : ""
    }`}>
      <div>
        <div className={`font-mono text-[11px] tracking-[0.08em] mb-1.5 ${primary ? "text-accent" : "text-ink-3"}`}>
          Rank · {String(rank).padStart(2, "0")}{primary && " ·  Primary diagnosis"}
        </div>
        <h3 className="font-serif text-[30px] font-normal tracking-[-0.02em] m-0 mb-1 text-ink">
          {d.condition.name}
          <em className="italic text-ink-3 font-light text-[18px] ml-2">({d.condition.latin})</em>
        </h3>
        <p className="text-[14.5px] text-ink-2 leading-[1.55] my-3 max-w-[60ch]">{d.condition.description}</p>
        <div className="mt-[18px] pt-[18px] border-t border-dashed border-line-2">
          <h5 className="label-mono font-medium m-0 mb-2.5">Recommended action</h5>
          <ul className="m-0 pl-[18px] text-sm text-ink-2">
            {d.condition.recommendations.map((r, i) => <li key={i} className="my-1">{r}</li>)}
          </ul>
        </div>
      </div>
      <div>
        <Gauge cf={d.cf} />
        <WhyBox rules={d.firedRules} />
      </div>
    </div>
  );
}

export function Results({
  result, facts, onBack, onReset, canSave,
}: {
  result: InferenceResult;
  facts: import("@/lib/types").Facts;
  onBack: () => void;
  onReset: () => void;
  canSave: boolean;
}) {
  const { diagnoses, redFlags, verdict, firedCount } = result;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const verdictText = {
    high: "High-confidence triage available.",
    moderate: "Moderate-confidence triage — recommend professional confirmation.",
    low: "Insufficient certainty — recommend professional consultation.",
  }[verdict] ?? "No matching rules fired.";

  async function handleSave() {
    setSaving(true);
    try {
      const title = diagnoses[0]?.condition.name ?? "Case " + new Date().toLocaleDateString();
      const saved = await api.createCase(title, facts);
      setSaved(true);
      router.push(`/cases/${saved.id}`);
    } catch (e) {
      alert((e as Error).message);
    } finally { setSaving(false); }
  }

  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-end mb-8 pb-6 border-b border-line">
        <div>
          <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3 mb-3">
            § Output · Forward-chaining inference
          </div>
          <h2 className="font-serif font-light text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.025em] m-0">
            Differential diagnosis.
          </h2>
          <p className="font-mono text-[12.5px] text-ink-3 tracking-[0.04em] mt-2">
            {firedCount} rules fired · {diagnoses.length} candidate {diagnoses.length === 1 ? "diagnosis" : "diagnoses"} · {verdictText}
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {canSave && !saved && (
            <button className="btn" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save case"}
            </button>
          )}
          <button className="btn btn-ghost" onClick={onBack}>
            <span className="font-mono text-xs">←</span> Adjust answers
          </button>
          <button className="btn btn-ghost" onClick={onReset}>Start over</button>
        </div>
      </div>

      {redFlags.length > 0 && (
        <div className="mb-8 border border-warn bg-warn-soft p-6 rounded-md grid grid-cols-[32px_1fr] gap-4">
          <div className="w-7 h-7 bg-warn text-white rounded-full flex items-center justify-center font-serif font-medium text-base">!</div>
          <div>
            <h4 className="m-0 mb-1.5 font-serif text-[19px] font-medium text-ink">
              Red-flag findings detected — seek professional care promptly
            </h4>
            <p className="m-0 text-sm text-ink-2">
              The following findings override routine triage and warrant urgent dermatology assessment:
            </p>
            <ul className="mt-2 pl-5 text-[13.5px] text-ink-2">
              {redFlags.map(rf => <li key={rf.id}>{rf.text}</li>)}
            </ul>
          </div>
        </div>
      )}

      {diagnoses.length === 0 ? (
        <div className="card p-14 text-center">
          <h3 className="font-serif text-[26px] font-normal m-0 mb-2.5">No rules fired.</h3>
          <p className="text-ink-2 max-w-[56ch] mx-auto mb-5">
            The combination of facts you provided didn&apos;t match any production rules with sufficient
            confidence. Add more specific symptom details or consult a clinician.
          </p>
          <button className="btn" onClick={onBack}>
            <span className="font-mono text-xs">←</span> Refine answers
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {diagnoses.map((d, i) => (
            <DxCard key={d.dx} d={d} rank={i + 1} primary={i === 0} />
          ))}
        </div>
      )}

      <div className="mt-16 px-6 py-[22px] bg-bg-2 border-l-[3px] border-ink text-[13px] text-ink-2 leading-[1.6] max-w-[90ch]">
        <b className="text-ink">Disclaimer.</b> DermDiag ES is an educational prototype built for the WIA2001
        Knowledge Representation &amp; Reasoning course (Group OCC 10). It is <b className="text-ink">not</b> a
        substitute for evaluation by a qualified dermatologist. Outputs are provided to support learning,
        triage decisions, and patient education only. Always confirm any suggested diagnosis with a professional.
      </div>
    </div>
  );
}
