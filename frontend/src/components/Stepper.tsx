export function Stepper({ filled }: { filled: Set<string> }) {
  const labels: [string, string][] = [
    ["Chief symptoms", "morphology"], ["Location", "location"],
    ["Pattern", "pattern"], ["History", "history"], ["Red flags", "redflags"],
  ];
  return (
    <div className="flex flex-col md:flex-row gap-0 mb-10 border-t border-ink">
      {labels.map(([l, id], i) => {
        const done = filled.has(id);
        return (
          <div key={id}
            className={`flex-1 px-4 py-3.5 md:border-r border-b md:border-b-0 border-line font-mono text-[11px] tracking-[0.08em] uppercase relative ${done ? "text-ink" : "text-ink-3"}`}>
            <span className={`mr-2 ${done ? "text-accent" : "text-ink-3"}`}>
              {`0${i + 1}`.slice(-2)}{done ? " ✓" : ""}
            </span>
            {l}
          </div>
        );
      })}
    </div>
  );
}
