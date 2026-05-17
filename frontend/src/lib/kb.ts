export const SYMPTOM_LABELS: Record<string, string> = {
  itch: "Itching", redness: "Redness / erythema", scaling: "Scaling",
  dry_skin: "Dry skin / dryness", vesicles: "Vesicles / small blisters",
  papules: "Papules (small bumps)", pustules: "Pustules (pus-filled bumps)",
  plaques: "Thick raised plaques", burrows: "Burrows (thin lines)",
  wheals: "Wheals / hives", hyperpigmentation: "Hyperpigmentation (brown patches)",
  ring_shape: "Ring-shaped / circular rash", greasy_scale: "Greasy / yellow scale",
  comedones: "Blackheads / whiteheads", telangiectasia: "Visible small blood vessels",
  face: "Face", central_face: "Central face (cheeks, nose)", scalp: "Scalp",
  flexures: "Flexures (inner elbows, behind knees)",
  extensors: "Extensors (outer elbows, knees)", trunk: "Trunk / back",
  hands: "Hands / finger webs", feet: "Feet", genitals: "Genital area",
  nasolabial_folds: "Nasolabial folds / eyebrows",
  upper_lip_cheeks: "Upper lip / cheeks (symmetric)",
  body_wide: "Widespread / multiple areas",
  nocturnal_itch: "Worse at night", symmetric: "Symmetric distribution",
  well_demarcated: "Well-defined borders", central_clearing: "Central clearing",
  silvery_scale: "Silvery scale",
  sun_exposure: "Sun exposure / pregnancy / hormones",
  heat_sweat: "Worse with heat / sweat",
  recent_contact: "Recent contact with new substance",
  household_contact: "Household contact also itchy",
  transient_lesions: "Lesions come & go in hours",
  rf_bleeding: "Lesion bleeds easily",
  rf_irregular_mole: "Irregular / changing mole",
  rf_rapid_growth: "Rapidly growing lesion",
  rf_systemic: "Fever / weight loss / fatigue",
  rf_widespread_infection: "Widespread skin infection",
  rf_ulceration: "Non-healing ulcer (>1 month)",
};

export type Section = {
  id: "morphology" | "location" | "pattern" | "history" | "redflags";
  idx: string;
  title: string;
  hint: string;
  chips?: string[];
  isHistory?: boolean;
  danger?: boolean;
};

export const SECTIONS: Section[] = [
  { id: "morphology", idx: "01", title: "Chief symptoms",
    hint: "What does the skin look or feel like? Select every symptom that applies.",
    chips: ["itch","redness","scaling","dry_skin","vesicles","papules","pustules","plaques","burrows","wheals","hyperpigmentation","ring_shape","greasy_scale","comedones","telangiectasia"] },
  { id: "location", idx: "02", title: "Where is it located?",
    hint: "Select every body region affected. Be as specific as possible.",
    chips: ["face","central_face","scalp","flexures","extensors","trunk","hands","feet","genitals","nasolabial_folds","upper_lip_cheeks","body_wide"] },
  { id: "pattern", idx: "03", title: "Pattern & features",
    hint: "Distinctive features that help narrow the differential.",
    chips: ["symmetric","well_demarcated","central_clearing","silvery_scale","nocturnal_itch","transient_lesions"] },
  { id: "history", idx: "04", title: "History & triggers",
    hint: "Context — onset, environment, family background.", isHistory: true },
  { id: "redflags", idx: "05", title: "Red-flag symptoms",
    hint: "If any of these are present, urgent referral is recommended regardless of other findings.",
    chips: ["rf_bleeding","rf_irregular_mole","rf_rapid_growth","rf_systemic","rf_widespread_infection","rf_ulceration"], danger: true },
];

export const META_FIELDS: Record<string, { label: string; options: [string, string][] }> = {
  duration: { label: "Duration", options: [["acute","Acute (<2 weeks)"],["subacute","Subacute (2–6 weeks)"],["chronic","Chronic (>6 weeks)"]] },
  itch_severity: { label: "Itch severity", options: [["none","None"],["mild","Mild"],["severe","Severe"]] },
  age_group: { label: "Age group", options: [["child","Child"],["teen","Teen"],["young_adult","Young adult"],["adult","Adult"],["older_adult","Older adult"]] },
  family_history_atopy: { label: "Family history of atopy / eczema / asthma", options: [["yes","Yes"],["no","No"],["unknown","Unknown"]] },
};

export const HISTORY_CHIPS = ["sun_exposure","heat_sweat","recent_contact","household_contact"];

export function confidenceBand(cf: number) {
  if (cf >= 0.85) return { lvl: "high" as const, text: "High confidence" };
  if (cf >= 0.6) return { lvl: "med" as const, text: "Moderate confidence" };
  return { lvl: "low" as const, text: "Low confidence — consult professional" };
}
