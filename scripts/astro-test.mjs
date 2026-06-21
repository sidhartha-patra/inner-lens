// astro-test.mjs — validates the astrology engine (natal, Vedic, transits, synastry).
import { computeNatal } from "../src/engine/astro.js";
import { computeVedic } from "../src/engine/vedic.js";
import { computeTransits } from "../src/engine/transits.js";
import { computeSynastry } from "../src/engine/synastry.js";
import { composeNatalReading, composeVedicReading, composeTransitReading } from "../src/engine/interpretations.js";

let fails = 0;
const check = (c, m) => { if (!c) { fails++; console.error("  ✗ " + m); } };

// --- Natal: Rourkela, 21 Apr 1989, 22:05 IST ---
const natal = computeNatal({ name: "Test", year: 1989, month: 4, day: 21, hour: 22, minute: 5, lat: 22.2604, lon: 84.8536, place: "Rourkela" });
const sun = natal.planets.find((p) => p.key === "sun");
const moon = natal.planets.find((p) => p.key === "moon");
console.log("Natal: Sun", sun.sign, sun.dms, "| Moon", moon.sign, "| Asc", natal.ascendant.sign, "| #aspects", natal.aspects.length);
check(sun.sign === "Taurus", "Sun is Taurus");
check(moon.sign === "Scorpio", "Moon is Scorpio");
check(natal.ascendant.sign === "Sagittarius", "Ascendant is Sagittarius");
check(natal.planets.length === 10, "10 planets present");
check(natal.houses.length === 12, "12 houses present");
check(natal.meta.utcISO.startsWith("1989-04-21T16:35"), "UTC resolved to 16:35Z (IST)");

// --- Vedic ---
const vedic = computeVedic(natal);
console.log("Vedic: ayanamsa", vedic.ayanamsa.toFixed(3), "| Moon", vedic.planets.find(p=>p.key==="moon").rasi,
  "| Nakshatra", vedic.moonNakshatra.name, "pada", vedic.moonNakshatra.pada, "ruler", vedic.moonNakshatra.ruler,
  "| Maha", vedic.dasha.currentMaha.planet, "Antar", vedic.dasha.currentAntar?.planet);
check(vedic.ayanamsa > 23 && vedic.ayanamsa < 24.5, "Lahiri ayanamsa ~23-24°");
check(vedic.planets.length === 10, "Vedic 10 planets");
check(vedic.dasha.periods.length === 9, "Dasha has 9 mahadashas");
check(["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"].includes(vedic.dasha.currentMaha.planet), "Current mahadasha valid");
check(vedic.houses.length === 12, "Vedic whole-sign houses");

// --- Transits ---
const tr = computeTransits(natal);
console.log("Transits: #planets", tr.planets.length, "| #aspects-to-natal", tr.aspects.length, "| sample", tr.aspects[0]?.transit, tr.aspects[0]?.type, tr.aspects[0]?.natal);
check(tr.planets.length === 10, "10 transit planets");
check(tr.planets.every((p) => p.natalHouse >= 1 && p.natalHouse <= 12), "transit planets mapped to natal houses");

// --- Synastry ---
const natalB = computeNatal({ name: "Partner", year: 1990, month: 7, day: 15, hour: 6, minute: 30, lat: 40.71, lon: -74.0, place: "NYC" });
const syn = computeSynastry(natal, natalB);
console.log("Synastry: score", syn.score, "| harmonious", syn.harmonious, "challenging", syn.challenging, "total", syn.total);
check(syn.score >= 0 && syn.score <= 100, "synastry score within 0-100");
check(syn.total > 0, "synastry found inter-aspects");

// --- Readings compose without error ---
const r1 = composeNatalReading(natal); check(r1.blocks.length >= 4, "natal reading blocks");
const r2 = composeVedicReading(vedic); check(r2.blocks.length >= 4, "vedic reading blocks");
const r3 = composeTransitReading(tr); check(r3.blocks.length >= 2, "transit reading blocks");
const allText = JSON.stringify([r1, r2, r3]);
check(!/undefined|NaN/.test(allText), "readings free of undefined/NaN");

if (fails === 0) console.log("\n✓ Astro engine: ALL CHECKS PASSED");
else { console.error(`\n✗ ${fails} check(s) failed`); process.exit(1); }
