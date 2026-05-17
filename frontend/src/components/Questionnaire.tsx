"use client";

import { useCallback, useMemo } from "react";
import { Chip, Segmented } from "./Chip";
import { Stepper } from "./Stepper";
import { HISTORY_CHIPS, META_FIELDS, SECTIONS, SYMPTOM_LABELS } from "@/lib/kb";
import type { Facts } from "@/lib/types";

export function Questionnaire({
  facts, setFacts, onSubmit, submitting,
}: {
  facts: Facts;
  setFacts: (updater: (f: Facts) => Facts) => void;
  onSubmit: () => void;
  submitting?: boolean;
}) {
  const toggleSx = useCallback((k: string) => {
    setFacts(prev => {
      const next = { ...prev, symptoms: { ...prev.symptoms } };
      if (next.symptoms[k]) delete next.symptoms[k];
      else next.symptoms[k] = true;
      return next;
    });
  }, [setFacts]);

  const setMeta = useCallback((k: string, v: string) => {
    setFacts(prev => ({ ...prev, meta: { ...prev.meta, [k]: v } }));
  }, [setFacts]);

  const filled = useMemo(() => {
    const f = new Set<string>();
    if (SECTIONS[0].chips!.some(c => facts.symptoms[c])) f.add("morphology");
    if (SECTIONS[1].chips!.some(c => facts.symptoms[c])) f.add("location");
    if (SECTIONS[2].chips!.some(c => facts.symptoms[c])) f.add("pattern");
    if (Object.keys(facts.meta).length > 0 || HISTORY_CHIPS.some(c => facts.symptoms[c])) f.add("history");
    if (SECTIONS[4].chips!.some(c => facts.symptoms[c])) f.add("redflags");
    return f;
  }, [facts]);

  const totalFacts = Object.keys(facts.symptoms).length + Object.keys(facts.meta).length;
  const canDiagnose = filled.has("morphology") || filled.has("location");

  return (
    <>
      <Stepper filled={filled} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
        <div className="card overflow-hidden">
          {SECTIONS.map(sec => (
            <section key={sec.id} className="px-9 py-8 border-b border-line-2 last:border-b-0">
              <header className="flex gap-4 items-baseline mb-1.5">
                <span className="font-mono text-[11px] text-accent tracking-[0.08em]">§ {sec.idx}</span>
                <h3 className="font-serif text-[26px] font-normal tracking-[-0.01em] m-0">{sec.title}</h3>
              </header>
              <p className="text-[13.5px] text-ink-3 m-0 mb-6 max-w-[60ch]">{sec.hint}</p>

              {sec.isHistory ? (
                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-8">
                    {Object.entries(META_FIELDS).map(([k, def]) => (
                      <label key={k} className="block">
                        <span className="label-mono block mb-2.5">{def.label}</span>
                        <Segmented name={k} value={facts.meta[k]} options={def.options}
                          onChange={(v) => setMeta(k, v)} />
                      </label>
                    ))}
                  </div>
                  <label className="block mt-2">
                    <span className="label-mono block mb-2.5">Triggers &amp; exposures</span>
                    <div className="flex flex-wrap gap-2">
                      {HISTORY_CHIPS.map(c => (
                        <Chip key={c} k={c} on={!!facts.symptoms[c]} onToggle={toggleSx} />
                      ))}
                    </div>
                  </label>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sec.chips!.map(c => (
                    <Chip key={c} k={c} on={!!facts.symptoms[c]} danger={sec.danger} onToggle={toggleSx} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-[92px] grid gap-4">
          <div className="card p-[22px]">
            <h4 className="label-mono font-medium mb-3.5">Session summary</h4>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[42px] leading-none tracking-[-0.02em]">{totalFacts}</span>
              <span className="label-mono">Facts in working memory</span>
            </div>
            <div className="h-1 bg-line-2 rounded-full overflow-hidden mt-2 mb-1">
              <div className="h-full bg-accent transition-[width] duration-200"
                style={{ width: `${Math.min(100, (filled.size / 5) * 100)}%` }} />
            </div>
            <div className="font-mono text-[11px] text-ink-3 tracking-[0.06em]">
              {filled.size} of 5 sections answered
            </div>
          </div>

          <div className="card p-[22px]">
            <h4 className="label-mono font-medium mb-3.5">Selected facts</h4>
            {totalFacts === 0 ? (
              <p className="text-[13px] text-ink-3 italic m-0">No selections yet. Tap chips to add facts.</p>
            ) : (
              <ul className="list-none p-0 m-0 grid gap-1.5 max-h-72 overflow-y-auto">
                {Object.keys(facts.symptoms).map(k => (
                  <li key={k} className="text-[12.5px] text-ink-2 px-2.5 py-1.5 bg-bg rounded font-mono tracking-[0.03em] flex justify-between gap-2">
                    <span>{SYMPTOM_LABELS[k] ?? k}</span>
                    <span className="text-[10px] text-accent uppercase tracking-[0.08em]">SX</span>
                  </li>
                ))}
                {Object.entries(facts.meta).map(([k, v]) => (
                  <li key={k} className="text-[12.5px] text-ink-2 px-2.5 py-1.5 bg-bg rounded font-mono tracking-[0.03em] flex justify-between gap-2">
                    <span>{META_FIELDS[k]?.label ?? k}: {v}</span>
                    <span className="text-[10px] text-accent uppercase tracking-[0.08em]">META</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="btn w-full" onClick={onSubmit} disabled={!canDiagnose || submitting}
            title={canDiagnose ? "Run forward-chaining inference" : "Add at least one symptom"}>
            {submitting ? "Running…" : "Run diagnosis"}
            <span className="font-mono text-xs">→</span>
          </button>

          <div className="font-mono text-[10px] text-ink-3 tracking-[0.08em] text-center">
            Educational prototype · Not for clinical use
          </div>
        </aside>
      </div>
    </>
  );
}
