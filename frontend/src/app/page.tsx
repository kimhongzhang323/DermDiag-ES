"use client";

import { useCallback, useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Questionnaire } from "@/components/Questionnaire";
import { Results } from "@/components/Results";
import { api, getToken } from "@/lib/api";
import type { Facts, InferenceResult } from "@/lib/types";

export default function HomePage() {
  const [facts, setFacts] = useState<Facts>({ symptoms: {}, meta: {} });
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [running, setRunning] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => { setAuthed(!!getToken()); }, []);

  const onSubmit = useCallback(async () => {
    setRunning(true);
    try {
      const r = await api.diagnose(facts);
      setResult(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) { alert((e as Error).message); }
    finally { setRunning(false); }
  }, [facts]);

  const onBack = useCallback(() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const onReset = useCallback(() => {
    setFacts({ symptoms: {}, meta: {} });
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {!result && <Hero />}
      {!result ? (
        <Questionnaire facts={facts} setFacts={(u) => setFacts(u(facts))} onSubmit={onSubmit} submitting={running} />
      ) : (
        <Results result={result} facts={facts} onBack={onBack} onReset={onReset} canSave={authed} />
      )}
    </>
  );
}
