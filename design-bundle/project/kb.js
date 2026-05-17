// ─────────────────────────────────────────────────────────────
// DermDiag ES — Knowledge Base
// 10 high-prevalence skin conditions
// Production rules in IF-THEN form, annotated with Certainty Factors
// ─────────────────────────────────────────────────────────────

window.DERM_KB = {
  // ─── Condition metadata ────────────────────────────────────
  conditions: {
    atopic_dermatitis: {
      name: "Atopic Dermatitis",
      latin: "Eczema",
      description: "A chronic, relapsing inflammatory skin condition characterised by intense itch and dry, inflamed skin — typically on the flexures (inner elbows, behind knees, neck). Strongly associated with personal or family history of atopy.",
      recommendations: [
        "Daily emollient / fragrance-free moisturiser, applied liberally after bathing.",
        "Lukewarm (not hot) showers; avoid harsh soaps and known triggers.",
        "Short courses of low-potency topical corticosteroid for active flares.",
        "Consult a dermatologist if symptoms persist >2 weeks or affect sleep / daily function."
      ],
      triage: "self_care_with_followup"
    },
    psoriasis: {
      name: "Psoriasis",
      latin: "Psoriasis vulgaris",
      description: "A chronic autoimmune condition presenting as well-demarcated, erythematous plaques covered with thick silvery scale — typically on extensor surfaces (elbows, knees), scalp, and lower back.",
      recommendations: [
        "Daily emollient + keratolytic (e.g. salicylic acid) to reduce scale.",
        "Topical corticosteroid or vitamin D analogue (calcipotriol) for plaques.",
        "Refer to dermatologist — moderate / severe disease may need phototherapy or systemic therapy.",
        "Avoid skin trauma (Koebner phenomenon); manage stress and known triggers."
      ],
      triage: "specialist_referral"
    },
    acne_vulgaris: {
      name: "Acne Vulgaris",
      latin: "Acne",
      description: "Inflammatory disorder of the pilosebaceous unit — comedones (blackheads / whiteheads), papules, pustules, and sometimes nodules — predominantly on the face, chest, and back of adolescents and young adults.",
      recommendations: [
        "Gentle, non-comedogenic cleanser twice daily; avoid harsh scrubbing.",
        "Topical retinoid (adapalene) and / or benzoyl peroxide for mild–moderate cases.",
        "Avoid picking or squeezing lesions to reduce scarring risk.",
        "See a dermatologist for moderate–severe disease, scarring, or psychological impact."
      ],
      triage: "self_care_with_followup"
    },
    tinea_corporis: {
      name: "Tinea Corporis",
      latin: "Ringworm",
      description: "A superficial dermatophyte (fungal) infection of the skin, classically presenting as a circular or ring-shaped, well-demarcated, scaly plaque with central clearing and an active advancing edge.",
      recommendations: [
        "Topical antifungal (terbinafine or clotrimazole) twice daily for 2–4 weeks.",
        "Keep affected area clean and dry; avoid sharing towels or clothing.",
        "Treat household contacts and pets if positive — prevents reinfection.",
        "Refer if widespread, scalp involvement, or failure of topical therapy after 4 weeks."
      ],
      triage: "self_care"
    },
    seborrheic_dermatitis: {
      name: "Seborrheic Dermatitis",
      latin: "Seborrhoeic eczema",
      description: "A chronic inflammatory condition affecting sebum-rich areas (scalp, eyebrows, nasolabial folds, chest) — yellow-greasy scale on a red base. Linked to Malassezia yeast colonisation.",
      recommendations: [
        "Anti-fungal shampoo (ketoconazole 2%) 2–3× weekly for scalp involvement.",
        "Mild topical corticosteroid (short courses) for inflamed areas.",
        "Topical antifungal cream for facial / chest lesions.",
        "Recurrence is common — maintenance therapy may be needed."
      ],
      triage: "self_care"
    },
    contact_dermatitis: {
      name: "Contact Dermatitis",
      latin: "Allergic / irritant",
      description: "Inflammation caused by direct skin contact with an allergen or irritant. Acute onset with redness, vesicles, and itch, often confined to the area of contact.",
      recommendations: [
        "Identify and remove the offending agent — patch testing if recurrent.",
        "Cool compresses + emollient for symptom relief.",
        "Topical corticosteroid (moderate potency) for short courses.",
        "Refer for patch testing if cause is unclear or recurrent."
      ],
      triage: "self_care"
    },
    urticaria: {
      name: "Urticaria",
      latin: "Hives",
      description: "Transient, raised, intensely itchy wheals that come and go (each lasting <24h). May be acute (<6 weeks) or chronic. Often allergic but frequently idiopathic.",
      recommendations: [
        "Non-sedating antihistamine (e.g. cetirizine, loratadine) — up-titrate if needed.",
        "Identify and avoid triggers (foods, drugs, physical stimuli).",
        "Seek urgent care if accompanied by lip / tongue / throat swelling or breathing difficulty.",
        "Chronic urticaria (>6 weeks) — refer to dermatology / allergy specialist."
      ],
      triage: "self_care_with_followup"
    },
    scabies: {
      name: "Scabies",
      latin: "Sarcoptes scabiei",
      description: "Highly contagious infestation by the mite Sarcoptes scabiei. Hallmark features: intense itching (especially at night) and burrows in the finger webs, wrists, axillae, or genitals.",
      recommendations: [
        "Topical permethrin 5% cream — apply to whole body neck-down, leave 8–12 h.",
        "Treat all household / sexual contacts simultaneously, even if asymptomatic.",
        "Wash all clothing, bedding, and towels in hot water on the day of treatment.",
        "Itch may persist 2–4 weeks after successful treatment; consult if no improvement."
      ],
      triage: "self_care_with_followup"
    },
    melasma: {
      name: "Melasma",
      latin: "Chloasma",
      description: "Acquired, symmetric hyperpigmentation — typically brown patches on the cheeks, forehead, upper lip, and chin. Most common in women, triggered by sun exposure, pregnancy, or hormonal therapy.",
      recommendations: [
        "Strict daily broad-spectrum sunscreen (SPF 50+) is the cornerstone of management.",
        "Topical hydroquinone, azelaic acid, or kojic acid under dermatologist guidance.",
        "Avoid known hormonal triggers if feasible.",
        "Realistic expectations: management is gradual and recurrence is common."
      ],
      triage: "specialist_referral"
    },
    rosacea: {
      name: "Rosacea",
      latin: "Acne rosacea",
      description: "Chronic inflammatory condition of central facial skin — persistent erythema, telangiectasias, papules, and pustules — typically affecting adults aged 30–50.",
      recommendations: [
        "Daily mineral sunscreen + gentle non-irritating skincare.",
        "Identify and avoid flushing triggers (alcohol, spicy foods, heat, stress).",
        "Topical metronidazole, azelaic acid, or ivermectin for papulopustular subtype.",
        "Refer if ocular involvement, rhinophyma, or topical therapy fails."
      ],
      triage: "specialist_referral"
    }
  },

  // ─── Symptom catalogue (the universe of facts) ────────────
  symptomLabels: {
    // morphology
    itch: "Itching",
    redness: "Redness / erythema",
    scaling: "Scaling",
    dry_skin: "Dry skin / dryness",
    vesicles: "Vesicles / small blisters",
    papules: "Papules (small bumps)",
    pustules: "Pustules (pus-filled bumps)",
    plaques: "Thick raised plaques",
    burrows: "Burrows (thin lines)",
    wheals: "Wheals / hives",
    hyperpigmentation: "Hyperpigmentation (brown patches)",
    ring_shape: "Ring-shaped / circular rash",
    greasy_scale: "Greasy / yellow scale",
    comedones: "Blackheads / whiteheads",
    telangiectasia: "Visible small blood vessels",
    // locations
    face: "Face",
    central_face: "Central face (cheeks, nose)",
    scalp: "Scalp",
    flexures: "Flexures (inner elbows, behind knees)",
    extensors: "Extensors (outer elbows, knees)",
    trunk: "Trunk / back",
    hands: "Hands / finger webs",
    feet: "Feet",
    genitals: "Genital area",
    nasolabial_folds: "Nasolabial folds / eyebrows",
    upper_lip_cheeks: "Upper lip / cheeks (symmetric)",
    body_wide: "Widespread / multiple areas",
    // modifiers
    nocturnal_itch: "Worse at night",
    symmetric: "Symmetric distribution",
    well_demarcated: "Well-defined borders",
    central_clearing: "Central clearing",
    silvery_scale: "Silvery scale",
    // triggers
    sun_exposure: "Sun exposure / pregnancy / hormones",
    heat_sweat: "Worse with heat / sweat",
    recent_contact: "Recent contact with new substance",
    household_contact: "Household contact also itchy",
    transient_lesions: "Lesions come & go in hours",
    // red flags
    rf_bleeding: "Lesion bleeds easily",
    rf_irregular_mole: "Irregular / changing mole",
    rf_rapid_growth: "Rapidly growing lesion",
    rf_systemic: "Fever / weight loss / fatigue",
    rf_widespread_infection: "Widespread skin infection",
    rf_ulceration: "Non-healing ulcer (>1 month)"
  },

  // ─── Production rules ──────────────────────────────────────
  // Each rule: id, diagnosis, conditions (function(facts)→bool|n_matched),
  // CF (base), bonus terms, and a human-readable expression.
  rules: [
    // ── ATOPIC DERMATITIS ──
    {
      id: "R-001",
      dx: "atopic_dermatitis",
      cf: 0.85,
      label: "Itch + flexural distribution + chronic + dry skin",
      requires: ["itch", "flexures", "dry_skin"],
      requiresMeta: { duration: ["subacute", "chronic"] },
      expr: "itch ∧ dry_skin ∧ flexures ∧ duration ≥ subacute"
    },
    {
      id: "R-002",
      dx: "atopic_dermatitis",
      cf: 0.50,
      label: "Personal or family history of atopy",
      requiresMeta: { family_history_atopy: ["yes"] },
      expr: "family_history_atopy = yes"
    },
    {
      id: "R-003",
      dx: "atopic_dermatitis",
      cf: 0.40,
      label: "Nocturnal itch (typical of eczema flare)",
      requires: ["nocturnal_itch", "itch"],
      excludes: ["burrows"],
      expr: "nocturnal_itch ∧ itch ∧ ¬burrows"
    },

    // ── PSORIASIS ──
    {
      id: "R-004",
      dx: "psoriasis",
      cf: 0.85,
      label: "Plaques + scaling on extensor surfaces (chronic)",
      requires: ["plaques", "scaling", "extensors"],
      requiresMeta: { duration: ["subacute", "chronic"] },
      expr: "plaques ∧ scaling ∧ extensors ∧ duration ≥ subacute"
    },
    {
      id: "R-005",
      dx: "psoriasis",
      cf: 0.55,
      label: "Silvery scale on well-demarcated plaques",
      requires: ["silvery_scale", "well_demarcated"],
      expr: "silvery_scale ∧ well_demarcated"
    },
    {
      id: "R-006",
      dx: "psoriasis",
      cf: 0.35,
      label: "Scalp involvement (common psoriasis site)",
      requires: ["scalp", "plaques"],
      expr: "scalp ∧ plaques"
    },

    // ── ACNE VULGARIS ──
    {
      id: "R-007",
      dx: "acne_vulgaris",
      cf: 0.85,
      label: "Comedones + papules / pustules on face (adolescent)",
      requires: ["comedones", "face"],
      requiresAny: ["papules", "pustules"],
      requiresMeta: { age_group: ["teen", "young_adult"] },
      expr: "comedones ∧ (papules ∨ pustules) ∧ face ∧ age ∈ {teen, young adult}"
    },
    {
      id: "R-008",
      dx: "acne_vulgaris",
      cf: 0.45,
      label: "Pustules without comedones on face",
      requires: ["pustules", "face"],
      excludes: ["wheals", "burrows"],
      expr: "pustules ∧ face"
    },

    // ── TINEA CORPORIS ──
    {
      id: "R-009",
      dx: "tinea_corporis",
      cf: 0.88,
      label: "Ring-shaped rash + scaling + itch",
      requires: ["ring_shape", "scaling", "itch"],
      expr: "ring_shape ∧ scaling ∧ itch"
    },
    {
      id: "R-010",
      dx: "tinea_corporis",
      cf: 0.50,
      label: "Central clearing + advancing edge",
      requires: ["central_clearing", "scaling"],
      expr: "central_clearing ∧ scaling"
    },
    {
      id: "R-011",
      dx: "tinea_corporis",
      cf: 0.30,
      label: "Worse with heat / sweat",
      requires: ["heat_sweat", "ring_shape"],
      expr: "heat_sweat ∧ ring_shape"
    },

    // ── SEBORRHEIC DERMATITIS ──
    {
      id: "R-012",
      dx: "seborrheic_dermatitis",
      cf: 0.85,
      label: "Greasy scale on scalp / face (symmetric)",
      requires: ["greasy_scale"],
      requiresAny: ["scalp", "nasolabial_folds"],
      expr: "greasy_scale ∧ (scalp ∨ nasolabial_folds)"
    },
    {
      id: "R-013",
      dx: "seborrheic_dermatitis",
      cf: 0.40,
      label: "Symmetric distribution + redness on sebum-rich areas",
      requires: ["symmetric", "redness", "nasolabial_folds"],
      expr: "symmetric ∧ redness ∧ nasolabial_folds"
    },

    // ── CONTACT DERMATITIS ──
    {
      id: "R-014",
      dx: "contact_dermatitis",
      cf: 0.85,
      label: "Acute redness + recent new substance exposure",
      requires: ["redness", "recent_contact"],
      requiresMeta: { duration: ["acute"] },
      expr: "redness ∧ recent_contact ∧ duration = acute"
    },
    {
      id: "R-015",
      dx: "contact_dermatitis",
      cf: 0.45,
      label: "Vesicles + well-demarcated to contact area",
      requires: ["vesicles", "well_demarcated"],
      expr: "vesicles ∧ well_demarcated"
    },

    // ── URTICARIA ──
    {
      id: "R-016",
      dx: "urticaria",
      cf: 0.92,
      label: "Wheals + transient lesions (hours)",
      requires: ["wheals", "transient_lesions"],
      expr: "wheals ∧ transient_lesions"
    },
    {
      id: "R-017",
      dx: "urticaria",
      cf: 0.50,
      label: "Wheals + intense itch (acute)",
      requires: ["wheals", "itch"],
      requiresMeta: { duration: ["acute"] },
      expr: "wheals ∧ itch ∧ duration = acute"
    },

    // ── SCABIES ──
    {
      id: "R-018",
      dx: "scabies",
      cf: 0.90,
      label: "Burrows + nocturnal itch + household contact",
      requires: ["burrows", "nocturnal_itch", "household_contact"],
      expr: "burrows ∧ nocturnal_itch ∧ household_contact"
    },
    {
      id: "R-019",
      dx: "scabies",
      cf: 0.65,
      label: "Burrows in finger webs / wrists",
      requires: ["burrows", "hands"],
      expr: "burrows ∧ hands"
    },
    {
      id: "R-020",
      dx: "scabies",
      cf: 0.45,
      label: "Severe nocturnal itch + household contact",
      requires: ["nocturnal_itch", "household_contact"],
      requiresMeta: { itch_severity: ["severe"] },
      expr: "nocturnal_itch ∧ household_contact ∧ itch_severity = severe"
    },

    // ── MELASMA ──
    {
      id: "R-021",
      dx: "melasma",
      cf: 0.88,
      label: "Symmetric facial hyperpigmentation + sun / hormonal trigger",
      requires: ["hyperpigmentation", "symmetric", "sun_exposure"],
      requiresAny: ["face", "upper_lip_cheeks"],
      expr: "hyperpigmentation ∧ symmetric ∧ sun_exposure ∧ face"
    },
    {
      id: "R-022",
      dx: "melasma",
      cf: 0.55,
      label: "Hyperpigmentation on upper lip / cheeks",
      requires: ["hyperpigmentation", "upper_lip_cheeks"],
      excludes: ["itch", "scaling"],
      expr: "hyperpigmentation ∧ upper_lip_cheeks ∧ ¬itch ∧ ¬scaling"
    },

    // ── ROSACEA ──
    {
      id: "R-023",
      dx: "rosacea",
      cf: 0.85,
      label: "Central facial redness + papules in adult",
      requires: ["central_face", "redness", "papules"],
      requiresMeta: { age_group: ["adult", "older_adult"] },
      excludes: ["comedones"],
      expr: "central_face ∧ redness ∧ papules ∧ adult ∧ ¬comedones"
    },
    {
      id: "R-024",
      dx: "rosacea",
      cf: 0.50,
      label: "Telangiectasia on central face",
      requires: ["telangiectasia", "central_face"],
      expr: "telangiectasia ∧ central_face"
    }
  ],

  // ─── Red flag rules (always surfaced) ──────────────────────
  redFlags: [
    { id: "RF-01", key: "rf_bleeding", text: "A lesion that bleeds easily warrants prompt dermatology assessment." },
    { id: "RF-02", key: "rf_irregular_mole", text: "An irregular or changing mole may indicate melanoma — see a dermatologist urgently." },
    { id: "RF-03", key: "rf_rapid_growth", text: "Rapidly growing skin lesions require professional evaluation to exclude malignancy." },
    { id: "RF-04", key: "rf_systemic", text: "Fever, weight loss, or fatigue alongside a rash may indicate systemic disease — seek prompt medical care." },
    { id: "RF-05", key: "rf_widespread_infection", text: "Widespread skin infection can escalate quickly — seek medical care today." },
    { id: "RF-06", key: "rf_ulceration", text: "Non-healing ulcers (>1 month) require urgent specialist assessment." }
  ]
};
