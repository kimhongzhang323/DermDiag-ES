// Package kb is the DermDiag knowledge base: condition metadata,
// symptom catalogue, production rules, and red flags. Ported from kb.js.
package kb

type Condition struct {
	Key             string   `json:"key"`
	Name            string   `json:"name"`
	Latin           string   `json:"latin"`
	Description     string   `json:"description"`
	Recommendations []string `json:"recommendations"`
	Triage          string   `json:"triage"`
}

type Rule struct {
	ID           string              `json:"id"`
	Dx           string              `json:"dx"`
	CF           float64             `json:"cf"`
	Label        string              `json:"label"`
	Expr         string              `json:"expr"`
	Requires     []string            `json:"requires,omitempty"`
	RequiresAny  []string            `json:"requiresAny,omitempty"`
	Excludes     []string            `json:"excludes,omitempty"`
	RequiresMeta map[string][]string `json:"requiresMeta,omitempty"`
}

type RedFlag struct {
	ID   string `json:"id"`
	Key  string `json:"key"`
	Text string `json:"text"`
}

var Conditions = map[string]Condition{
	"atopic_dermatitis": {Key: "atopic_dermatitis", Name: "Atopic Dermatitis", Latin: "Eczema",
		Description: "A chronic, relapsing inflammatory skin condition characterised by intense itch and dry, inflamed skin — typically on the flexures (inner elbows, behind knees, neck). Strongly associated with personal or family history of atopy.",
		Recommendations: []string{
			"Daily emollient / fragrance-free moisturiser, applied liberally after bathing.",
			"Lukewarm (not hot) showers; avoid harsh soaps and known triggers.",
			"Short courses of low-potency topical corticosteroid for active flares.",
			"Consult a dermatologist if symptoms persist >2 weeks or affect sleep / daily function.",
		}, Triage: "self_care_with_followup"},
	"psoriasis": {Key: "psoriasis", Name: "Psoriasis", Latin: "Psoriasis vulgaris",
		Description: "A chronic autoimmune condition presenting as well-demarcated, erythematous plaques covered with thick silvery scale — typically on extensor surfaces (elbows, knees), scalp, and lower back.",
		Recommendations: []string{
			"Daily emollient + keratolytic (e.g. salicylic acid) to reduce scale.",
			"Topical corticosteroid or vitamin D analogue (calcipotriol) for plaques.",
			"Refer to dermatologist — moderate / severe disease may need phototherapy or systemic therapy.",
			"Avoid skin trauma (Koebner phenomenon); manage stress and known triggers.",
		}, Triage: "specialist_referral"},
	"acne_vulgaris": {Key: "acne_vulgaris", Name: "Acne Vulgaris", Latin: "Acne",
		Description: "Inflammatory disorder of the pilosebaceous unit — comedones (blackheads / whiteheads), papules, pustules, and sometimes nodules — predominantly on the face, chest, and back of adolescents and young adults.",
		Recommendations: []string{
			"Gentle, non-comedogenic cleanser twice daily; avoid harsh scrubbing.",
			"Topical retinoid (adapalene) and / or benzoyl peroxide for mild–moderate cases.",
			"Avoid picking or squeezing lesions to reduce scarring risk.",
			"See a dermatologist for moderate–severe disease, scarring, or psychological impact.",
		}, Triage: "self_care_with_followup"},
	"tinea_corporis": {Key: "tinea_corporis", Name: "Tinea Corporis", Latin: "Ringworm",
		Description: "A superficial dermatophyte (fungal) infection of the skin, classically presenting as a circular or ring-shaped, well-demarcated, scaly plaque with central clearing and an active advancing edge.",
		Recommendations: []string{
			"Topical antifungal (terbinafine or clotrimazole) twice daily for 2–4 weeks.",
			"Keep affected area clean and dry; avoid sharing towels or clothing.",
			"Treat household contacts and pets if positive — prevents reinfection.",
			"Refer if widespread, scalp involvement, or failure of topical therapy after 4 weeks.",
		}, Triage: "self_care"},
	"seborrheic_dermatitis": {Key: "seborrheic_dermatitis", Name: "Seborrheic Dermatitis", Latin: "Seborrhoeic eczema",
		Description: "A chronic inflammatory condition affecting sebum-rich areas (scalp, eyebrows, nasolabial folds, chest) — yellow-greasy scale on a red base. Linked to Malassezia yeast colonisation.",
		Recommendations: []string{
			"Anti-fungal shampoo (ketoconazole 2%) 2–3× weekly for scalp involvement.",
			"Mild topical corticosteroid (short courses) for inflamed areas.",
			"Topical antifungal cream for facial / chest lesions.",
			"Recurrence is common — maintenance therapy may be needed.",
		}, Triage: "self_care"},
	"contact_dermatitis": {Key: "contact_dermatitis", Name: "Contact Dermatitis", Latin: "Allergic / irritant",
		Description: "Inflammation caused by direct skin contact with an allergen or irritant. Acute onset with redness, vesicles, and itch, often confined to the area of contact.",
		Recommendations: []string{
			"Identify and remove the offending agent — patch testing if recurrent.",
			"Cool compresses + emollient for symptom relief.",
			"Topical corticosteroid (moderate potency) for short courses.",
			"Refer for patch testing if cause is unclear or recurrent.",
		}, Triage: "self_care"},
	"urticaria": {Key: "urticaria", Name: "Urticaria", Latin: "Hives",
		Description: "Transient, raised, intensely itchy wheals that come and go (each lasting <24h). May be acute (<6 weeks) or chronic. Often allergic but frequently idiopathic.",
		Recommendations: []string{
			"Non-sedating antihistamine (e.g. cetirizine, loratadine) — up-titrate if needed.",
			"Identify and avoid triggers (foods, drugs, physical stimuli).",
			"Seek urgent care if accompanied by lip / tongue / throat swelling or breathing difficulty.",
			"Chronic urticaria (>6 weeks) — refer to dermatology / allergy specialist.",
		}, Triage: "self_care_with_followup"},
	"scabies": {Key: "scabies", Name: "Scabies", Latin: "Sarcoptes scabiei",
		Description: "Highly contagious infestation by the mite Sarcoptes scabiei. Hallmark features: intense itching (especially at night) and burrows in the finger webs, wrists, axillae, or genitals.",
		Recommendations: []string{
			"Topical permethrin 5% cream — apply to whole body neck-down, leave 8–12 h.",
			"Treat all household / sexual contacts simultaneously, even if asymptomatic.",
			"Wash all clothing, bedding, and towels in hot water on the day of treatment.",
			"Itch may persist 2–4 weeks after successful treatment; consult if no improvement.",
		}, Triage: "self_care_with_followup"},
	"melasma": {Key: "melasma", Name: "Melasma", Latin: "Chloasma",
		Description: "Acquired, symmetric hyperpigmentation — typically brown patches on the cheeks, forehead, upper lip, and chin. Most common in women, triggered by sun exposure, pregnancy, or hormonal therapy.",
		Recommendations: []string{
			"Strict daily broad-spectrum sunscreen (SPF 50+) is the cornerstone of management.",
			"Topical hydroquinone, azelaic acid, or kojic acid under dermatologist guidance.",
			"Avoid known hormonal triggers if feasible.",
			"Realistic expectations: management is gradual and recurrence is common.",
		}, Triage: "specialist_referral"},
	"rosacea": {Key: "rosacea", Name: "Rosacea", Latin: "Acne rosacea",
		Description: "Chronic inflammatory condition of central facial skin — persistent erythema, telangiectasias, papules, and pustules — typically affecting adults aged 30–50.",
		Recommendations: []string{
			"Daily mineral sunscreen + gentle non-irritating skincare.",
			"Identify and avoid flushing triggers (alcohol, spicy foods, heat, stress).",
			"Topical metronidazole, azelaic acid, or ivermectin for papulopustular subtype.",
			"Refer if ocular involvement, rhinophyma, or topical therapy fails.",
		}, Triage: "specialist_referral"},
}

var SymptomLabels = map[string]string{
	"itch": "Itching", "redness": "Redness / erythema", "scaling": "Scaling",
	"dry_skin": "Dry skin / dryness", "vesicles": "Vesicles / small blisters",
	"papules": "Papules (small bumps)", "pustules": "Pustules (pus-filled bumps)",
	"plaques": "Thick raised plaques", "burrows": "Burrows (thin lines)",
	"wheals": "Wheals / hives", "hyperpigmentation": "Hyperpigmentation (brown patches)",
	"ring_shape": "Ring-shaped / circular rash", "greasy_scale": "Greasy / yellow scale",
	"comedones": "Blackheads / whiteheads", "telangiectasia": "Visible small blood vessels",
	"face": "Face", "central_face": "Central face (cheeks, nose)", "scalp": "Scalp",
	"flexures": "Flexures (inner elbows, behind knees)",
	"extensors": "Extensors (outer elbows, knees)", "trunk": "Trunk / back",
	"hands": "Hands / finger webs", "feet": "Feet", "genitals": "Genital area",
	"nasolabial_folds": "Nasolabial folds / eyebrows",
	"upper_lip_cheeks": "Upper lip / cheeks (symmetric)",
	"body_wide": "Widespread / multiple areas",
	"nocturnal_itch": "Worse at night", "symmetric": "Symmetric distribution",
	"well_demarcated": "Well-defined borders", "central_clearing": "Central clearing",
	"silvery_scale": "Silvery scale",
	"sun_exposure": "Sun exposure / pregnancy / hormones",
	"heat_sweat": "Worse with heat / sweat",
	"recent_contact": "Recent contact with new substance",
	"household_contact": "Household contact also itchy",
	"transient_lesions": "Lesions come & go in hours",
	"rf_bleeding": "Lesion bleeds easily",
	"rf_irregular_mole": "Irregular / changing mole",
	"rf_rapid_growth": "Rapidly growing lesion",
	"rf_systemic": "Fever / weight loss / fatigue",
	"rf_widespread_infection": "Widespread skin infection",
	"rf_ulceration": "Non-healing ulcer (>1 month)",
}

var Rules = []Rule{
	{ID: "R-001", Dx: "atopic_dermatitis", CF: 0.85, Label: "Itch + flexural distribution + chronic + dry skin",
		Requires: []string{"itch", "flexures", "dry_skin"}, RequiresMeta: map[string][]string{"duration": {"subacute", "chronic"}},
		Expr: "itch ∧ dry_skin ∧ flexures ∧ duration ≥ subacute"},
	{ID: "R-002", Dx: "atopic_dermatitis", CF: 0.50, Label: "Personal or family history of atopy",
		RequiresMeta: map[string][]string{"family_history_atopy": {"yes"}}, Expr: "family_history_atopy = yes"},
	{ID: "R-003", Dx: "atopic_dermatitis", CF: 0.40, Label: "Nocturnal itch (typical of eczema flare)",
		Requires: []string{"nocturnal_itch", "itch"}, Excludes: []string{"burrows"},
		Expr: "nocturnal_itch ∧ itch ∧ ¬burrows"},
	{ID: "R-004", Dx: "psoriasis", CF: 0.85, Label: "Plaques + scaling on extensor surfaces (chronic)",
		Requires: []string{"plaques", "scaling", "extensors"}, RequiresMeta: map[string][]string{"duration": {"subacute", "chronic"}},
		Expr: "plaques ∧ scaling ∧ extensors ∧ duration ≥ subacute"},
	{ID: "R-005", Dx: "psoriasis", CF: 0.55, Label: "Silvery scale on well-demarcated plaques",
		Requires: []string{"silvery_scale", "well_demarcated"}, Expr: "silvery_scale ∧ well_demarcated"},
	{ID: "R-006", Dx: "psoriasis", CF: 0.35, Label: "Scalp involvement (common psoriasis site)",
		Requires: []string{"scalp", "plaques"}, Expr: "scalp ∧ plaques"},
	{ID: "R-007", Dx: "acne_vulgaris", CF: 0.85, Label: "Comedones + papules / pustules on face (adolescent)",
		Requires: []string{"comedones", "face"}, RequiresAny: []string{"papules", "pustules"},
		RequiresMeta: map[string][]string{"age_group": {"teen", "young_adult"}},
		Expr: "comedones ∧ (papules ∨ pustules) ∧ face ∧ age ∈ {teen, young adult}"},
	{ID: "R-008", Dx: "acne_vulgaris", CF: 0.45, Label: "Pustules without comedones on face",
		Requires: []string{"pustules", "face"}, Excludes: []string{"wheals", "burrows"}, Expr: "pustules ∧ face"},
	{ID: "R-009", Dx: "tinea_corporis", CF: 0.88, Label: "Ring-shaped rash + scaling + itch",
		Requires: []string{"ring_shape", "scaling", "itch"}, Expr: "ring_shape ∧ scaling ∧ itch"},
	{ID: "R-010", Dx: "tinea_corporis", CF: 0.50, Label: "Central clearing + advancing edge",
		Requires: []string{"central_clearing", "scaling"}, Expr: "central_clearing ∧ scaling"},
	{ID: "R-011", Dx: "tinea_corporis", CF: 0.30, Label: "Worse with heat / sweat",
		Requires: []string{"heat_sweat", "ring_shape"}, Expr: "heat_sweat ∧ ring_shape"},
	{ID: "R-012", Dx: "seborrheic_dermatitis", CF: 0.85, Label: "Greasy scale on scalp / face (symmetric)",
		Requires: []string{"greasy_scale"}, RequiresAny: []string{"scalp", "nasolabial_folds"},
		Expr: "greasy_scale ∧ (scalp ∨ nasolabial_folds)"},
	{ID: "R-013", Dx: "seborrheic_dermatitis", CF: 0.40, Label: "Symmetric distribution + redness on sebum-rich areas",
		Requires: []string{"symmetric", "redness", "nasolabial_folds"},
		Expr: "symmetric ∧ redness ∧ nasolabial_folds"},
	{ID: "R-014", Dx: "contact_dermatitis", CF: 0.85, Label: "Acute redness + recent new substance exposure",
		Requires: []string{"redness", "recent_contact"}, RequiresMeta: map[string][]string{"duration": {"acute"}},
		Expr: "redness ∧ recent_contact ∧ duration = acute"},
	{ID: "R-015", Dx: "contact_dermatitis", CF: 0.45, Label: "Vesicles + well-demarcated to contact area",
		Requires: []string{"vesicles", "well_demarcated"}, Expr: "vesicles ∧ well_demarcated"},
	{ID: "R-016", Dx: "urticaria", CF: 0.92, Label: "Wheals + transient lesions (hours)",
		Requires: []string{"wheals", "transient_lesions"}, Expr: "wheals ∧ transient_lesions"},
	{ID: "R-017", Dx: "urticaria", CF: 0.50, Label: "Wheals + intense itch (acute)",
		Requires: []string{"wheals", "itch"}, RequiresMeta: map[string][]string{"duration": {"acute"}},
		Expr: "wheals ∧ itch ∧ duration = acute"},
	{ID: "R-018", Dx: "scabies", CF: 0.90, Label: "Burrows + nocturnal itch + household contact",
		Requires: []string{"burrows", "nocturnal_itch", "household_contact"},
		Expr: "burrows ∧ nocturnal_itch ∧ household_contact"},
	{ID: "R-019", Dx: "scabies", CF: 0.65, Label: "Burrows in finger webs / wrists",
		Requires: []string{"burrows", "hands"}, Expr: "burrows ∧ hands"},
	{ID: "R-020", Dx: "scabies", CF: 0.45, Label: "Severe nocturnal itch + household contact",
		Requires: []string{"nocturnal_itch", "household_contact"},
		RequiresMeta: map[string][]string{"itch_severity": {"severe"}},
		Expr: "nocturnal_itch ∧ household_contact ∧ itch_severity = severe"},
	{ID: "R-021", Dx: "melasma", CF: 0.88, Label: "Symmetric facial hyperpigmentation + sun / hormonal trigger",
		Requires: []string{"hyperpigmentation", "symmetric", "sun_exposure"},
		RequiresAny: []string{"face", "upper_lip_cheeks"},
		Expr: "hyperpigmentation ∧ symmetric ∧ sun_exposure ∧ face"},
	{ID: "R-022", Dx: "melasma", CF: 0.55, Label: "Hyperpigmentation on upper lip / cheeks",
		Requires: []string{"hyperpigmentation", "upper_lip_cheeks"}, Excludes: []string{"itch", "scaling"},
		Expr: "hyperpigmentation ∧ upper_lip_cheeks ∧ ¬itch ∧ ¬scaling"},
	{ID: "R-023", Dx: "rosacea", CF: 0.85, Label: "Central facial redness + papules in adult",
		Requires: []string{"central_face", "redness", "papules"},
		RequiresMeta: map[string][]string{"age_group": {"adult", "older_adult"}}, Excludes: []string{"comedones"},
		Expr: "central_face ∧ redness ∧ papules ∧ adult ∧ ¬comedones"},
	{ID: "R-024", Dx: "rosacea", CF: 0.50, Label: "Telangiectasia on central face",
		Requires: []string{"telangiectasia", "central_face"}, Expr: "telangiectasia ∧ central_face"},
}

var RedFlags = []RedFlag{
	{ID: "RF-01", Key: "rf_bleeding", Text: "A lesion that bleeds easily warrants prompt dermatology assessment."},
	{ID: "RF-02", Key: "rf_irregular_mole", Text: "An irregular or changing mole may indicate melanoma — see a dermatologist urgently."},
	{ID: "RF-03", Key: "rf_rapid_growth", Text: "Rapidly growing skin lesions require professional evaluation to exclude malignancy."},
	{ID: "RF-04", Key: "rf_systemic", Text: "Fever, weight loss, or fatigue alongside a rash may indicate systemic disease — seek prompt medical care."},
	{ID: "RF-05", Key: "rf_widespread_infection", Text: "Widespread skin infection can escalate quickly — seek medical care today."},
	{ID: "RF-06", Key: "rf_ulceration", Text: "Non-healing ulcers (>1 month) require urgent specialist assessment."},
}
