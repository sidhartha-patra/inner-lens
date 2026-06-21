// aspects.js — shared angular-aspect matching for transits and synastry.

export const ASPECTS = {
  conjunction: { angle: 0, glyph: "☌", harmony: 0 },
  sextile: { angle: 60, glyph: "⚹", harmony: 1 },
  square: { angle: 90, glyph: "□", harmony: -1 },
  trine: { angle: 120, glyph: "△", harmony: 1 },
  opposition: { angle: 180, glyph: "☍", harmony: -1 },
};

// Default natal/synastry orbs (degrees).
export const ORBS = { conjunction: 8, sextile: 4, square: 7, trine: 7, opposition: 8 };
// Tighter orbs for transits.
export const TRANSIT_ORBS = { conjunction: 5, sextile: 3, square: 4, trine: 4, opposition: 5 };

const angDiff = (a, b) => {
  let d = Math.abs(((a - b) % 360) + 360) % 360;
  if (d > 180) d = 360 - d;
  return d;
};

// Returns the tightest matching aspect between two longitudes, or null.
export function matchAspect(lonA, lonB, orbs = ORBS) {
  const sep = angDiff(lonA, lonB);
  let best = null;
  for (const [type, def] of Object.entries(ASPECTS)) {
    const orb = Math.abs(sep - def.angle);
    if (orb <= (orbs[type] ?? 0)) {
      if (!best || orb < best.orb) best = { type, orb: Math.round(orb * 100) / 100, harmony: def.harmony, glyph: def.glyph };
    }
  }
  return best;
}
