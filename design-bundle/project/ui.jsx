/* ──────────────────────────────────────────────────────────────
   DermDiag ES — UI (React + Babel)
   Questionnaire → Forward chaining inference → Results with rule trace
   ────────────────────────────────────────────────────────────── */

const { useState, useMemo, useCallback, useEffect } = React;
const KB = window.DERM_KB;
const ENGINE = window.DERM_ENGINE;

// ─── Sections of the questionnaire ──────────────────────────────
const SECTIONS = [
  {
    id: "morphology",
    idx: "01",
    title: "Chief symptoms",
    hint: "What does the skin look or feel like? Select every symptom that applies.",
    chips: [
      "itch", "redness", "scaling", "dry_skin", "vesicles", "papules", "pustules",
      "plaques", "burrows", "wheals", "hyperpigmentation", "ring_shape",
      "greasy_scale", "comedones", "telangiectasia"
    ]
  },
  {
    id: "location",
    idx: "02",
    title: "Where is it located?",
    hint: "Select every body region affected. Be as specific as possible.",
    chips: [
      "face", "central_face", "scalp", "flexures", "extensors", "trunk",
      "hands", "feet", "genitals", "nasolabial_folds", "upper_lip_cheeks", "body_wide"
    ]
  },
  {
    id: "pattern",
    idx: "03",
    title: "Pattern & features",
    hint: "Distinctive features that help narrow the differential.",
    chips: [
      "symmetric", "well_demarcated", "central_clearing", "silvery_scale",
      "nocturnal_itch", "transient_lesions"
    ]
  },
  {
    id: "history",
    idx: "04",
    title: "History & triggers",
    hint: "Context — onset, environment, family background.",
    isHistory: true
  },
  {
    id: "redflags",
    idx: "05",
    title: "Red-flag symptoms",
    hint: "If any of these are present, urgent referral is recommended regardless of other findings.",
    chips: [
      "rf_bleeding", "rf_irregular_mole", "rf_rapid_growth",
      "rf_systemic", "rf_widespread_infection", "rf_ulceration"
    ],
    danger: true
  }
];

const META_FIELDS = {
  duration: {
    label: "Duration",
    options: [
      ["acute", "Acute (<2 weeks)"],
      ["subacute", "Subacute (2–6 weeks)"],
      ["chronic", "Chronic (>6 weeks)"]
    ]
  },
  itch_severity: {
    label: "Itch severity",
    options: [
      ["none", "None"],
      ["mild", "Mild"],
      ["severe", "Severe"]
    ]
  },
  age_group: {
    label: "Age group",
    options: [
      ["child", "Child"],
      ["teen", "Teen"],
      ["young_adult", "Young adult"],
      ["adult", "Adult"],
      ["older_adult", "Older adult"]
    ]
  },
  family_history_atopy: {
    label: "Family history of atopy / eczema / asthma",
    options: [
      ["yes", "Yes"],
      ["no", "No"],
      ["unknown", "Unknown"]
    ]
  }
};

const HISTORY_CHIPS = ["sun_exposure", "heat_sweat", "recent_contact", "household_contact"];

// ─── Chip component ─────────────────────────────────────────────
function Chip({ k, on, onToggle, danger }) {
  return (
    <button
      type="button"
      className={`chip ${on ? "on" : ""} ${danger ? "warn" : ""}`}
      onClick={() => onToggle(k)}
    >
      <span className="dot" />
      {KB.symptomLabels[k] || k}
    </button>
  );
}

// ─── Segmented (radio) ──────────────────────────────────────────
function Segmented({ name, value, options, onChange }) {
  return (
    <div className="segmented">
      {options.map(([v, label]) => (
        <label key={v}>
          <input
            type="radio"
            name={name}
            checked={value === v}
            onChange={() => onChange(v)}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

// ─── Hero ───────────────────────────────────────────────────────
function Hero({ onStart, hasAnswers }) {
  return (
    <div className="hero">
      <div>
        <h1>Diagnose,<br/>then <em>explain</em>.</h1>
        <p className="lede">
          A rule-based dermatology triage prototype. Tell the system what you see —
          location, morphology, history — and it returns a ranked differential with
          certainty scores and the exact rules that produced each conclusion.
        </p>
      </div>
      <aside className="hero-aside">
        <h4>How to use</h4>
        <p>
          Step through five short sections. The system uses <b>forward chaining</b> over
          a knowledge base of ~24 production rules covering 10 high-prevalence conditions.
          Every diagnosis comes paired with its rule trace.
        </p>
        <div className="meta">
          <div><span className="lbl">Method</span><b>Forward Chaining</b></div>
          <div><span className="lbl">Uncertainty</span><b>Certainty Factor</b></div>
          <div><span className="lbl">Conditions</span><b>10</b></div>
          <div><span className="lbl">Rules</span><b>24</b></div>
        </div>
      </aside>
    </div>
  );
}

// ─── Stepper ────────────────────────────────────────────────────
function Stepper({ filledSections }) {
  const labels = [
    ["Chief symptoms", "morphology"],
    ["Location", "location"],
    ["Pattern", "pattern"],
    ["History", "history"],
    ["Red flags", "redflags"],
  ];
  return (
    <div className="stepper">
      {labels.map(([l, id], i) => {
        const done = filledSections.has(id);
        return (
          <div key={id} className={`step ${done ? "done" : ""}`}>
            <span className="num">{`0${i + 1}`.slice(-2)}</span>
            {l}
          </div>
        );
      })}
    </div>
  );
}

// ─── Questionnaire ──────────────────────────────────────────────
function Questionnaire({ facts, setFacts, onSubmit }) {
  const toggleSx = useCallback((k) => {
    setFacts(prev => {
      const next = { ...prev, symptoms: { ...prev.symptoms } };
      if (next.symptoms[k]) delete next.symptoms[k];
      else next.symptoms[k] = true;
      return next;
    });
  }, [setFacts]);

  const setMeta = useCallback((k, v) => {
    setFacts(prev => ({ ...prev, meta: { ...prev.meta, [k]: v } }));
  }, [setFacts]);

  const filledSections = useMemo(() => {
    const filled = new Set();
    if (SECTIONS[0].chips.some(c => facts.symptoms[c])) filled.add("morphology");
    if (SECTIONS[1].chips.some(c => facts.symptoms[c])) filled.add("location");
    if (SECTIONS[2].chips.some(c => facts.symptoms[c])) filled.add("pattern");
    if (Object.keys(facts.meta).length > 0 || HISTORY_CHIPS.some(c => facts.symptoms[c])) filled.add("history");
    if (SECTIONS[4].chips.some(c => facts.symptoms[c])) filled.add("redflags");
    return filled;
  }, [facts]);

  const totalSymptoms = useMemo(() =>
    Object.keys(facts.symptoms).length + Object.keys(facts.meta).length,
    [facts]
  );

  const canDiagnose = filledSections.has("morphology") || filledSections.has("location");

  return (
    <>
      <Stepper filledSections={filledSections} />
      <div className="quiz-grid">
        <div className="quiz">
          {SECTIONS.map(sec => (
            <section key={sec.id} className="q-section">
              <header>
                <span className="idx">§ {sec.idx}</span>
                <h3>{sec.title}</h3>
              </header>
              <p className="hint">{sec.hint}</p>

              {sec.isHistory ? (
                <div className="row">
                  <div className="row two">
                    {Object.entries(META_FIELDS).map(([k, def]) => (
                      <label key={k} className="field">
                        <span className="lbl">{def.label}</span>
                        <Segmented
                          name={k}
                          value={facts.meta[k]}
                          options={def.options}
                          onChange={(v) => setMeta(k, v)}
                        />
                      </label>
                    ))}
                  </div>
                  <label className="field" style={{ marginTop: 14 }}>
                    <span className="lbl">Triggers &amp; exposures</span>
                    <div className="chips">
                      {HISTORY_CHIPS.map(c => (
                        <Chip key={c} k={c} on={!!facts.symptoms[c]} onToggle={toggleSx} />
                      ))}
                    </div>
                  </label>
                </div>
              ) : (
                <div className="chips">
                  {sec.chips.map(c => (
                    <Chip
                      key={c}
                      k={c}
                      on={!!facts.symptoms[c]}
                      onToggle={toggleSx}
                      danger={sec.danger}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Side panel */}
        <aside className="side">
          <div className="side-card">
            <h4>Session summary</h4>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="serif" style={{ fontSize: 42, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {totalSymptoms}
              </span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Facts in working memory
              </span>
            </div>
            <div className="meter">
              <div style={{ width: `${Math.min(100, (filledSections.size / 5) * 100)}%` }} />
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
              {filledSections.size} of 5 sections answered
            </div>
          </div>

          <div className="side-card">
            <h4>Selected facts</h4>
            {totalSymptoms === 0 ? (
              <p className="selected-empty">No selections yet. Tap chips to add facts.</p>
            ) : (
              <ul className="selected-list">
                {Object.keys(facts.symptoms).map(k => (
                  <li key={k}>
                    <span>{KB.symptomLabels[k] || k}</span>
                    <span className="cat">SX</span>
                  </li>
                ))}
                {Object.entries(facts.meta).map(([k, v]) => (
                  <li key={k}>
                    <span>{(META_FIELDS[k]?.label || k)}: {v}</span>
                    <span className="cat">META</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="btn full"
            onClick={onSubmit}
            disabled={!canDiagnose}
            title={canDiagnose ? "Run forward-chaining inference" : "Add at least one symptom"}
          >
            Run diagnosis
            <span className="arrow">→</span>
          </button>

          <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textAlign: "center" }}>
            Educational prototype · Not for clinical use
          </div>
        </aside>
      </div>
    </>
  );
}

// ─── Gauge ──────────────────────────────────────────────────────
function ConfidenceGauge({ cf }) {
  const band = ENGINE.confidenceBand(cf);
  const pct = Math.round(cf * 100);
  return (
    <div className="gauge">
      <div className="cf-num">{pct}<em>%</em></div>
      <div className="cf-lbl">Certainty Factor</div>
      <div className="bar"><div style={{ width: `${pct}%` }} /></div>
      <div className={`lvl ${band.lvl}`}>{band.text}</div>
    </div>
  );
}

// ─── Why box (rule trace) ───────────────────────────────────────
function WhyBox({ firedRules }) {
  return (
    <div className="why">
      <h5>Why? · Rule trace</h5>
      {firedRules.map(r => (
        <div className="rule" key={r.ruleId}>
          <span className="rid">{r.ruleId}</span>
          {" — "}
          <span className="com">{r.label}</span>
          <br/>
          <span className="kw">IF</span> {r.expr}
          {"  "}
          <span className="kw">THEN</span> dx={r.dx.replace(/_/g, " ")}, <span className="cf">cf={r.cf}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Single diagnosis card ──────────────────────────────────────
function DiagnosisCard({ d, rank, isPrimary }) {
  return (
    <div className={`dx ${isPrimary ? "primary" : ""}`}>
      <div>
        <div className="dx-rank">Rank · {String(rank).padStart(2, "0")} {isPrimary && "·  Primary diagnosis"}</div>
        <h3>
          {d.condition.name}
          <em>({d.condition.latin})</em>
        </h3>
        <p className="desc">{d.condition.description}</p>

        <div className="reco">
          <h5>Recommended action</h5>
          <ul>
            {d.condition.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      </div>
      <div>
        <ConfidenceGauge cf={d.cf} />
        <WhyBox firedRules={d.firedRules} />
      </div>
    </div>
  );
}

// ─── Results screen ─────────────────────────────────────────────
function Results({ result, onBack, onReset }) {
  const { diagnoses, redFlags, verdict } = result;
  const verdictText = {
    high: "High-confidence triage available.",
    moderate: "Moderate-confidence triage — recommend professional confirmation.",
    low: "Insufficient certainty — recommend professional consultation."
  }[verdict] || "No matching rules fired.";

  return (
    <div className="fade-in">
      <div className="res-head">
        <div>
          <div className="sub">§ Output · Forward-chaining inference</div>
          <h2>Differential diagnosis.</h2>
          <p className="mono" style={{ fontSize: 12.5, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 8 }}>
            {result.firedCount} rules fired · {diagnoses.length} candidate {diagnoses.length === 1 ? "diagnosis" : "diagnoses"} · {verdictText}
          </p>
        </div>
        <div className="res-actions">
          <button className="btn ghost" onClick={onBack}>
            <span className="arrow">←</span>
            Adjust answers
          </button>
          <button className="btn ghost" onClick={onReset}>
            Start over
          </button>
        </div>
      </div>

      {redFlags.length > 0 && (
        <div className="alert">
          <div className="ico">!</div>
          <div>
            <h4>Red-flag findings detected — seek professional care promptly</h4>
            <p>The following findings override routine triage and warrant urgent dermatology assessment:</p>
            <ul>
              {redFlags.map(rf => <li key={rf.id}>{rf.text}</li>)}
            </ul>
          </div>
        </div>
      )}

      {diagnoses.length === 0 ? (
        <div className="empty-res">
          <h3>No rules fired.</h3>
          <p>
            The combination of facts you provided didn't match any production rules with sufficient
            confidence. Add more specific symptom details or consult a clinician.
          </p>
          <button className="btn" onClick={onBack}>
            <span className="arrow">←</span>
            Refine answers
          </button>
        </div>
      ) : (
        <div className="dx-grid">
          {diagnoses.map((d, i) => (
            <DiagnosisCard key={d.dx} d={d} rank={i + 1} isPrimary={i === 0} />
          ))}
        </div>
      )}

      <div className="disclaimer">
        <b>Disclaimer.</b> DermDiag ES is an educational prototype built for the WIA2001
        Knowledge Representation &amp; Reasoning course (Group OCC 10). It is <b>not</b> a
        substitute for evaluation by a qualified dermatologist. Outputs are provided to
        support learning, triage decisions, and patient education only. Always confirm any
        suggested diagnosis with a professional.
      </div>
    </div>
  );
}

// ─── App root ───────────────────────────────────────────────────
function App() {
  const [facts, setFacts] = useState({ symptoms: {}, meta: {} });
  const [result, setResult] = useState(null);

  const onSubmit = useCallback(() => {
    const r = ENGINE.runInference(facts);
    setResult(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [facts]);

  const onBack = useCallback(() => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onReset = useCallback(() => {
    setFacts({ symptoms: {}, meta: {} });
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="wrap">
      {!result && <Hero hasAnswers={Object.keys(facts.symptoms).length > 0} />}
      {!result
        ? <Questionnaire facts={facts} setFacts={setFacts} onSubmit={onSubmit} />
        : <Results result={result} onBack={onBack} onReset={onReset} />
      }
      <footer>
        <span>DERMDIAG · ES PROTOTYPE · v0.1</span>
        <span>WIA2001 · GROUP OCC 10 · SEM 2 · 2025/2026</span>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
