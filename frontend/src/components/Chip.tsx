"use client";

import { SYMPTOM_LABELS } from "@/lib/kb";

export function Chip({ k, on, danger, onToggle }: {
  k: string; on: boolean; danger?: boolean; onToggle: (k: string) => void;
}) {
  return (
    <button type="button" onClick={() => onToggle(k)}
      className={`chip ${on ? "chip-on" : ""} ${danger && on ? "chip-warn-on" : ""}`}>
      <span className="chip-dot" />
      {SYMPTOM_LABELS[k] ?? k}
    </button>
  );
}

export function Segmented({ name, value, options, onChange }: {
  name: string; value: string | undefined;
  options: [string, string][]; onChange: (v: string) => void;
}) {
  return (
    <div className="segmented">
      {options.map(([v, label]) => (
        <label key={v}>
          <input type="radio" name={name} checked={value === v} onChange={() => onChange(v)} />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}
