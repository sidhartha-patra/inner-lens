// transits.js — current ("now") transiting planets and their aspects to a natal chart.

import { computeNatal, houseOfLon } from "./astro.js";
import { matchAspect, TRANSIT_ORBS } from "./aspects.js";

// Reykjavik is UTC year-round (no DST), so feeding UTC clock components as "local"
// time there yields the exact geocentric planet longitudes for that UTC instant.
const UTC_LOC = { lat: 64.1466, lon: -21.9426 };

export function transitingPlanets(atDate = new Date()) {
  const d = atDate;
  const chart = computeNatal({
    name: "transit",
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(),
    lat: UTC_LOC.lat, lon: UTC_LOC.lon,
  });
  return chart.planets;
}

export function computeTransits(natal, atDate = new Date()) {
  const tps = transitingPlanets(atDate);

  const planets = tps.map((tp) => ({
    ...tp,
    natalHouse: houseOfLon(tp.lon, natal.houses),
  }));

  const aspects = [];
  for (const tp of tps) {
    for (const np of natal.planets) {
      const m = matchAspect(tp.lon, np.lon, TRANSIT_ORBS);
      if (m) aspects.push({ transit: tp.key, natal: np.key, type: m.type, orb: m.orb, harmony: m.harmony, glyph: m.glyph });
    }
  }
  // Tightest first.
  aspects.sort((a, b) => a.orb - b.orb);

  return { date: atDate.toISOString(), planets, aspects };
}
