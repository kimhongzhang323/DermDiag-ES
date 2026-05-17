export function Hero() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 pb-14 border-b border-line mb-14 items-end">
      <div>
        <h1 className="font-serif font-light leading-none tracking-[-0.03em] m-0 mb-4 text-[clamp(40px,6vw,76px)]">
          Diagnose,<br />then <em className="italic text-accent font-normal">explain</em>.
        </h1>
        <p className="font-serif text-[20px] leading-[1.5] text-ink-2 max-w-[56ch] font-light m-0">
          A rule-based dermatology triage prototype. Tell the system what you see —
          location, morphology, history — and it returns a ranked differential with
          certainty scores and the exact rules that produced each conclusion.
        </p>
      </div>
      <aside className="card p-6">
        <h4 className="label-mono font-medium mb-3.5">How to use</h4>
        <p className="text-[13.5px] text-ink-2 m-0 mb-3.5 leading-[1.55]">
          Step through five short sections. The system uses <b>forward chaining</b> over
          a knowledge base of ~24 production rules covering 10 high-prevalence conditions.
          Every diagnosis comes paired with its rule trace.
        </p>
        <div className="mt-[18px] pt-4 border-t border-line-2 grid grid-cols-2 gap-3 text-xs">
          <div><span className="label-mono block mb-1">Method</span><b className="text-ink font-medium">Forward Chaining</b></div>
          <div><span className="label-mono block mb-1">Uncertainty</span><b className="text-ink font-medium">Certainty Factor</b></div>
          <div><span className="label-mono block mb-1">Conditions</span><b className="text-ink font-medium">10</b></div>
          <div><span className="label-mono block mb-1">Rules</span><b className="text-ink font-medium">24</b></div>
        </div>
      </aside>
    </div>
  );
}
