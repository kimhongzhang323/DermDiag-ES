// ─────────────────────────────────────────────────────────────
// DermDiag ES — Inference Engine
// Forward chaining + MYCIN-style Certainty Factor combination
// ─────────────────────────────────────────────────────────────

(function () {
  const KB = window.DERM_KB;

  // MYCIN-style CF combination for two positive CFs in [0,1]
  function combineCF(a, b) {
    if (a == null) return b;
    if (b == null) return a;
    // both positive: a + b * (1 - a)
    return a + b * (1 - a);
  }

  // Evaluate one rule against working memory (facts).
  // Returns null if rule does not fire, otherwise an object with cf + bindings.
  function evaluateRule(rule, facts) {
    const sx = facts.symptoms || {};        // set of selected symptom keys → true
    const meta = facts.meta || {};          // single-value fields

    // requires (all): every key in `requires` must be true in symptoms
    if (rule.requires) {
      for (const k of rule.requires) {
        if (!sx[k]) return null;
      }
    }

    // requiresAny: at least one key must be true
    if (rule.requiresAny) {
      const any = rule.requiresAny.some(k => sx[k]);
      if (!any) return null;
    }

    // excludes: none of the listed keys may be true
    if (rule.excludes) {
      for (const k of rule.excludes) {
        if (sx[k]) return null;
      }
    }

    // requiresMeta: each key's value must be in the allowed list
    if (rule.requiresMeta) {
      for (const [key, allowed] of Object.entries(rule.requiresMeta)) {
        const v = meta[key];
        if (v == null || !allowed.includes(v)) return null;
      }
    }

    return { cf: rule.cf, ruleId: rule.id, dx: rule.dx, label: rule.label, expr: rule.expr };
  }

  // Forward-chaining: scan rules, fire matching ones, accumulate per-diagnosis CFs.
  function runInference(facts) {
    const fired = [];
    const cfByDx = {};
    const traceByDx = {};

    for (const rule of KB.rules) {
      const result = evaluateRule(rule, facts);
      if (!result) continue;
      fired.push(result);
      cfByDx[result.dx] = combineCF(cfByDx[result.dx], result.cf);
      if (!traceByDx[result.dx]) traceByDx[result.dx] = [];
      traceByDx[result.dx].push(result);
    }

    // Build ranked diagnoses
    const diagnoses = Object.entries(cfByDx)
      .map(([dx, cf]) => ({
        dx,
        cf: Math.round(cf * 100) / 100,
        condition: KB.conditions[dx],
        firedRules: traceByDx[dx]
      }))
      .sort((a, b) => b.cf - a.cf);

    // Red flag detection (independent of rules)
    const redFlags = [];
    for (const rf of KB.redFlags) {
      if (facts.symptoms && facts.symptoms[rf.key]) {
        redFlags.push(rf);
      }
    }

    // Overall verdict
    let verdict = "low";
    if (diagnoses.length > 0) {
      const top = diagnoses[0].cf;
      if (top >= 0.85) verdict = "high";
      else if (top >= 0.6) verdict = "moderate";
      else verdict = "low";
    }

    return {
      diagnoses,
      redFlags,
      verdict,
      firedCount: fired.length,
      facts
    };
  }

  // Helper: confidence band for a single diagnosis
  function confidenceBand(cf) {
    if (cf >= 0.85) return { lvl: "high", text: "High confidence" };
    if (cf >= 0.6)  return { lvl: "med",  text: "Moderate confidence" };
    return { lvl: "low", text: "Low confidence — consult professional" };
  }

  window.DERM_ENGINE = { runInference, confidenceBand, combineCF };
})();
