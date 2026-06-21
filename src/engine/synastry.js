// synastry.js — relationship compatibility: inter-aspects between two natal charts.

import { matchAspect, ORBS } from "./aspects.js";

// Weight planets by relational importance.
const WEIGHT = {
  sun: 3, moon: 3, venus: 3, mars: 2.5, mercury: 2,
  jupiter: 1.5, saturn: 1.5, uranus: 1, neptune: 1, pluto: 1,
};

export function computeSynastry(natalA, natalB) {
  const aspects = [];
  let rawScore = 0;
  let weightTotal = 0;

  for (const a of natalA.planets) {
    for (const b of natalB.planets) {
      const m = matchAspect(a.lon, b.lon, ORBS);
      if (!m) continue;
      const w = (WEIGHT[a.key] || 1) * (WEIGHT[b.key] || 1);
      // Closer orb = stronger; harmony in {-1,0,1}, conjunction(0) treated mildly positive.
      const tightness = 1 - m.orb / (ORBS[m.type] || 8);
      const polarity = m.harmony === 0 ? 0.4 : m.harmony;
      rawScore += polarity * w * tightness;
      weightTotal += w;
      aspects.push({ a: a.key, b: b.key, type: m.type, orb: m.orb, harmony: m.harmony, glyph: m.glyph, weight: Math.round(w * 10) / 10 });
    }
  }

  aspects.sort((x, y) => (y.weight * (1 - y.orb / 8)) - (x.weight * (1 - x.orb / 8)));

  // Map rawScore to a friendly 0-100 (centered around 50).
  const score = Math.max(0, Math.min(100, Math.round(50 + (weightTotal ? (rawScore / weightTotal) * 120 : 0))));

  const harmonious = aspects.filter((a) => a.harmony > 0).length;
  const challenging = aspects.filter((a) => a.harmony < 0).length;

  return { aspects, score, harmonious, challenging, total: aspects.length };
}
