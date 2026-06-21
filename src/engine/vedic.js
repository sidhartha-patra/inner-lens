// vedic.js — Jyotish layer: Lahiri sidereal positions, 27 nakshatras, and the
// Vimshottari Dasha timeline. Sidereal longitudes are derived from the accurate
// tropical longitudes minus a properly computed Lahiri ayanamsa.

import { norm360, signIndexOf, degWithinSign, formatDMS } from "./astro.js";

export const RASIS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
];
export const RASI_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

// 27 nakshatras with their Vimshottari ruling planet.
export const NAKSHATRAS = [
  { name: "Ashwini", ruler: "Ketu", deity: "Ashwini Kumaras" },
  { name: "Bharani", ruler: "Venus", deity: "Yama" },
  { name: "Krittika", ruler: "Sun", deity: "Agni" },
  { name: "Rohini", ruler: "Moon", deity: "Brahma" },
  { name: "Mrigashira", ruler: "Mars", deity: "Soma" },
  { name: "Ardra", ruler: "Rahu", deity: "Rudra" },
  { name: "Punarvasu", ruler: "Jupiter", deity: "Aditi" },
  { name: "Pushya", ruler: "Saturn", deity: "Brihaspati" },
  { name: "Ashlesha", ruler: "Mercury", deity: "Nagas" },
  { name: "Magha", ruler: "Ketu", deity: "Pitris" },
  { name: "Purva Phalguni", ruler: "Venus", deity: "Bhaga" },
  { name: "Uttara Phalguni", ruler: "Sun", deity: "Aryaman" },
  { name: "Hasta", ruler: "Moon", deity: "Savitri" },
  { name: "Chitra", ruler: "Mars", deity: "Tvashtar" },
  { name: "Swati", ruler: "Rahu", deity: "Vayu" },
  { name: "Vishakha", ruler: "Jupiter", deity: "Indra-Agni" },
  { name: "Anuradha", ruler: "Saturn", deity: "Mitra" },
  { name: "Jyeshtha", ruler: "Mercury", deity: "Indra" },
  { name: "Mula", ruler: "Ketu", deity: "Nirriti" },
  { name: "Purva Ashadha", ruler: "Venus", deity: "Apas" },
  { name: "Uttara Ashadha", ruler: "Sun", deity: "Vishvedevas" },
  { name: "Shravana", ruler: "Moon", deity: "Vishnu" },
  { name: "Dhanishta", ruler: "Mars", deity: "Vasus" },
  { name: "Shatabhisha", ruler: "Rahu", deity: "Varuna" },
  { name: "Purva Bhadrapada", ruler: "Jupiter", deity: "Aja Ekapada" },
  { name: "Uttara Bhadrapada", ruler: "Saturn", deity: "Ahir Budhnya" },
  { name: "Revati", ruler: "Pushan", deity: "Pushan" },
];
// Fix Revati ruler (Mercury in Vimshottari ordering).
NAKSHATRAS[26].ruler = "Mercury";

// Vimshottari order + mahadasha lengths (years). Total = 120.
export const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

const NAK_SIZE = 360 / 27;      // 13°20'
const PADA_SIZE = NAK_SIZE / 4; // 3°20'
const DAYS_PER_YEAR = 365.25;

// Lahiri (Chitrapaksha) ayanamsa in degrees for a given Julian Day (UT).
// Linear model anchored at J2000 (23.853°), precession ~50.2796"/yr — accurate to
// ~0.001° for the modern era, well within nakshatra/pada tolerance.
export function lahiriAyanamsa(jd) {
  const t = (jd - 2451545.0) / DAYS_PER_YEAR; // years since J2000
  return 23.853 + (50.2796 / 3600) * t;
}

export function toSidereal(lon, jd) {
  return norm360(lon - lahiriAyanamsa(jd));
}

export function nakshatraOf(siderealLon) {
  const L = norm360(siderealLon);
  const idx = Math.floor(L / NAK_SIZE);
  const within = L - idx * NAK_SIZE;
  const pada = Math.floor(within / PADA_SIZE) + 1;
  const fraction = within / NAK_SIZE; // 0..1 traversed
  return { index: idx, ...NAKSHATRAS[idx], pada, fraction };
}

// Full Vimshottari mahadasha timeline + current maha/antar dasha.
export function vimshottariDasha(moonSiderealLon, birthDateUTC) {
  const nak = nakshatraOf(moonSiderealLon);
  const startPlanet = nak.ruler;
  const startIdx = DASHA_ORDER.indexOf(startPlanet);

  // Balance of the first (running-at-birth) mahadasha.
  const balanceYears = (1 - nak.fraction) * DASHA_YEARS[startPlanet];

  const periods = [];
  let cursor = new Date(birthDateUTC.getTime());
  // The first dasha actually began before birth; we show it from birth with its balance.
  for (let i = 0; i < 9; i++) {
    const planet = DASHA_ORDER[(startIdx + i) % 9];
    const years = i === 0 ? balanceYears : DASHA_YEARS[planet];
    const start = new Date(cursor.getTime());
    const end = new Date(cursor.getTime() + years * DAYS_PER_YEAR * 86400000);
    periods.push({ planet, start, end, years: DASHA_YEARS[planet] });
    cursor = end;
  }

  const now = new Date();
  const currentMaha = periods.find((p) => now >= p.start && now < p.end) || periods[0];

  // Antardasha (bhukti) within the current mahadasha.
  const antar = [];
  if (currentMaha) {
    const mahaPlanet = currentMaha.planet;
    const mahaIdx = DASHA_ORDER.indexOf(mahaPlanet);
    // The mahadasha's full span (not the truncated first-balance one) for proportions.
    const fullYears = DASHA_YEARS[mahaPlanet];
    let ac = new Date(currentMaha.start.getTime());
    // For the running mahadasha we approximate antar start from its (balance-adjusted) start.
    for (let i = 0; i < 9; i++) {
      const planet = DASHA_ORDER[(mahaIdx + i) % 9];
      const subYears = (fullYears * DASHA_YEARS[planet]) / 120;
      const start = new Date(ac.getTime());
      const end = new Date(ac.getTime() + subYears * DAYS_PER_YEAR * 86400000);
      antar.push({ planet, start, end });
      ac = end;
    }
  }
  const currentAntar = antar.find((p) => now >= p.start && now < p.end) || null;

  return { nakshatra: nak, periods, currentMaha, currentAntar, antar };
}

// Build the full Vedic view from a tropical natal chart + its JD + birth UTC date.
export function computeVedic(natal) {
  const jd = natal.meta.jd;
  const ayan = lahiriAyanamsa(jd);

  const sidPoint = (p) => {
    const sl = toSidereal(p.lon, jd);
    const si = signIndexOf(sl);
    const nak = nakshatraOf(sl);
    return {
      key: p.key, label: p.label, glyph: p.glyph,
      lon: sl, sign: RASI_EN[si], rasi: RASIS[si], signIndex: si,
      degInSign: degWithinSign(sl), dms: formatDMS(degWithinSign(sl)),
      nakshatra: nak.name, pada: nak.pada, nakshatraRuler: nak.ruler,
      retro: p.retro,
    };
  };

  const planets = natal.planets.map(sidPoint);
  const nodes = (natal.nodes || []).map(sidPoint);
  const ascendant = sidPoint(natal.ascendant);
  const moon = planets.find((p) => p.key === "moon");

  // Whole-sign houses from the sidereal ascendant (standard in Jyotish).
  const ascSign = ascendant.signIndex;
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const si = (ascSign + i) % 12;
    houses.push({ num: i + 1, sign: RASI_EN[si], rasi: RASIS[si], signIndex: si });
  }
  // Assign whole-sign house to each planet.
  for (const p of [...planets, ...nodes]) {
    p.house = ((p.signIndex - ascSign + 12) % 12) + 1;
  }

  const birthUTC = new Date(natal.meta.utcISO);
  const dasha = vimshottariDasha(moon.lon, birthUTC);

  return { ayanamsa: ayan, ascendant, planets, nodes, houses, moonNakshatra: dasha.nakshatra, dasha };
}
