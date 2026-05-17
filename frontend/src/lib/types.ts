export type Facts = {
  symptoms: Record<string, boolean>;
  meta: Record<string, string>;
};

export type Condition = {
  key: string;
  name: string;
  latin: string;
  description: string;
  recommendations: string[];
  triage: string;
};

export type FiredRule = {
  ruleId: string;
  dx: string;
  cf: number;
  label: string;
  expr: string;
};

export type Diagnosis = {
  dx: string;
  cf: number;
  condition: Condition;
  firedRules: FiredRule[];
};

export type RedFlag = { id: string; key: string; text: string };

export type InferenceResult = {
  diagnoses: Diagnosis[];
  redFlags: RedFlag[];
  verdict: "high" | "moderate" | "low";
  firedCount: number;
  facts: Facts;
};

export type CaseRow = {
  id: string;
  title: string | null;
  verdict: string;
  topDx: string | null;
  topCf: number | null;
  createdAt: string;
};

export type CaseDetail = CaseRow & { facts: Facts; result: InferenceResult };

export type User = { id: string; email: string; displayName?: string | null };
