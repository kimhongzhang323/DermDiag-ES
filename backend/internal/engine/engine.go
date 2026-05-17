// Package engine implements forward-chaining inference over the DermDiag KB
// with MYCIN-style certainty-factor combination. Ported from engine.js.
package engine

import (
	"math"
	"sort"

	"github.com/krr/dermdiag/internal/kb"
)

type Facts struct {
	Symptoms map[string]bool   `json:"symptoms"`
	Meta     map[string]string `json:"meta"`
}

type FiredRule struct {
	RuleID string  `json:"ruleId"`
	Dx     string  `json:"dx"`
	CF     float64 `json:"cf"`
	Label  string  `json:"label"`
	Expr   string  `json:"expr"`
}

type Diagnosis struct {
	Dx          string       `json:"dx"`
	CF          float64      `json:"cf"`
	Condition   kb.Condition `json:"condition"`
	FiredRules  []FiredRule  `json:"firedRules"`
}

type Result struct {
	Diagnoses  []Diagnosis  `json:"diagnoses"`
	RedFlags   []kb.RedFlag `json:"redFlags"`
	Verdict    string       `json:"verdict"`
	FiredCount int          `json:"firedCount"`
	Facts      Facts        `json:"facts"`
}

func combineCF(a, b float64) float64 {
	return a + b*(1-a)
}

func contains(xs []string, x string) bool {
	for _, v := range xs {
		if v == x {
			return true
		}
	}
	return false
}

func evaluate(rule kb.Rule, f Facts) *FiredRule {
	for _, k := range rule.Requires {
		if !f.Symptoms[k] {
			return nil
		}
	}
	if len(rule.RequiresAny) > 0 {
		any := false
		for _, k := range rule.RequiresAny {
			if f.Symptoms[k] {
				any = true
				break
			}
		}
		if !any {
			return nil
		}
	}
	for _, k := range rule.Excludes {
		if f.Symptoms[k] {
			return nil
		}
	}
	for key, allowed := range rule.RequiresMeta {
		v, ok := f.Meta[key]
		if !ok || !contains(allowed, v) {
			return nil
		}
	}
	return &FiredRule{RuleID: rule.ID, Dx: rule.Dx, CF: rule.CF, Label: rule.Label, Expr: rule.Expr}
}

func Run(f Facts) Result {
	if f.Symptoms == nil {
		f.Symptoms = map[string]bool{}
	}
	if f.Meta == nil {
		f.Meta = map[string]string{}
	}

	cfByDx := map[string]float64{}
	traceByDx := map[string][]FiredRule{}
	fired := 0

	for _, rule := range kb.Rules {
		r := evaluate(rule, f)
		if r == nil {
			continue
		}
		fired++
		if cur, ok := cfByDx[r.Dx]; ok {
			cfByDx[r.Dx] = combineCF(cur, r.CF)
		} else {
			cfByDx[r.Dx] = r.CF
		}
		traceByDx[r.Dx] = append(traceByDx[r.Dx], *r)
	}

	diagnoses := make([]Diagnosis, 0, len(cfByDx))
	for dx, cf := range cfByDx {
		diagnoses = append(diagnoses, Diagnosis{
			Dx:         dx,
			CF:         math.Round(cf*100) / 100,
			Condition:  kb.Conditions[dx],
			FiredRules: traceByDx[dx],
		})
	}
	sort.Slice(diagnoses, func(i, j int) bool { return diagnoses[i].CF > diagnoses[j].CF })

	var redFlags []kb.RedFlag
	for _, rf := range kb.RedFlags {
		if f.Symptoms[rf.Key] {
			redFlags = append(redFlags, rf)
		}
	}

	verdict := "low"
	if len(diagnoses) > 0 {
		top := diagnoses[0].CF
		switch {
		case top >= 0.85:
			verdict = "high"
		case top >= 0.6:
			verdict = "moderate"
		}
	}

	return Result{
		Diagnoses:  diagnoses,
		RedFlags:   redFlags,
		Verdict:    verdict,
		FiredCount: fired,
		Facts:      f,
	}
}
