// astro.js — wraps circular-natal-horoscope-js into a normalized chart object that
// is easy to render, interpret, and feed to an LLM. Timezone/DST is resolved by the
// library via tz-lookup + moment-timezone from the birth latitude/longitude.

import pkg from "circular-natal-horoscope-js";
const { Origin, Horoscope } = pkg;

export const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];
export const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
export const PLANET_GLYPHS = {
  sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂", jupiter: "♃",
  saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇", chiron: "⚷",
  northnode: "☊", southnode: "☋", lilith: "⚸",
};
const HOUSE_NAME_TO_NUM = {
  First: 1, Second: 2, Third: 3, Fourth: 4, Fifth: 5, Sixth: 6,
  Seventh: 7, Eighth: 8, Ninth: 9, Tenth: 10, Eleventh: 11, Twelfth: 12,
};

const PLANET_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

export const norm360 = (x) => ((x % 360) + 360) % 360;

export function signIndexOf(lon) {
  return Math.floor(norm360(lon) / 30);
}
export function degWithinSign(lon) {
  return norm360(lon) % 30;
}
export function formatDMS(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

function bodyToPoint(key, body) {
  if (!body || !body.ChartPosition) return null;
  const lon = body.ChartPosition.Ecliptic.DecimalDegrees;
  if (typeof lon !== "number" || Number.isNaN(lon)) return null;
  const si = signIndexOf(lon);
  return {
    key,
    label: body.label || key,
    glyph: PLANET_GLYPHS[key] || "•",
    lon,
    sign: SIGN_NAMES[si],
    signIndex: si,
    signGlyph: SIGN_GLYPHS[si],
    degInSign: degWithinSign(lon),
    dms: formatDMS(degWithinSign(lon)),
    house: body.House ? HOUSE_NAME_TO_NUM[body.House.label] || null : null,
    retro: Boolean(body.isRetrograde),
  };
}

// Build the raw library horoscope for an instant + location.
export function buildHoroscope({ year, month, day, hour, minute, lat, lon, zodiac = "tropical", houseSystem = "placidus" }) {
  const origin = new Origin({
    year, month: month - 1, date: day, hour, minute,
    latitude: lat, longitude: lon,
  });
  const horoscope = new Horoscope({
    origin,
    houseSystem,
    zodiac,
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: ["major"],
    language: "en",
  });
  return { origin, horoscope };
}

// Normalized natal chart (tropical / Western).
export function computeNatal(input) {
  const { origin, horoscope } = buildHoroscope(input);

  const planets = [];
  for (const key of PLANET_KEYS) {
    const p = bodyToPoint(key, horoscope.CelestialBodies[key]);
    if (p) planets.push(p);
  }
  // Lunar nodes (north/south) from CelestialPoints.
  const cp = horoscope.CelestialPoints || {};
  const north = bodyToPoint("northnode", cp.northnode);
  const south = bodyToPoint("southnode", cp.southnode);
  const nodes = [north, south].filter(Boolean);

  const asc = horoscope.Ascendant.ChartPosition.Ecliptic.DecimalDegrees;
  const mc = horoscope.Midheaven.ChartPosition.Ecliptic.DecimalDegrees;

  const houses = horoscope.Houses.map((h, i) => {
    const cusp = h.ChartPosition.StartPosition.Ecliptic.DecimalDegrees;
    return { num: i + 1, cuspLon: cusp, sign: SIGN_NAMES[signIndexOf(cusp)], signIndex: signIndexOf(cusp) };
  });

  const aspects = (horoscope.Aspects?.all || []).map((a) => ({
    a: a.point1Key,
    b: a.point2Key,
    type: a.aspectKey,
    level: a.aspectLevel,
    orb: Math.round(a.orb * 100) / 100,
  })).filter((a) => PLANET_KEYS.includes(a.a) && PLANET_KEYS.includes(a.b));

  return {
    meta: {
      name: (input.name || "").trim(),
      year: input.year, month: input.month, day: input.day, hour: input.hour, minute: input.minute,
      lat: input.lat, lon: input.lon, place: input.place || "",
      jd: origin.julianDate,
      utcISO: origin.utcTimeFormatted,
      localISO: origin.localTimeFormatted,
      zodiac: input.zodiac || "tropical",
      houseSystem: input.houseSystem || "placidus",
    },
    ascendant: pointFromLon("ascendant", "Ascendant", "Asc", asc, 1),
    midheaven: pointFromLon("midheaven", "Midheaven", "MC", mc, 10),
    planets,
    nodes,
    houses,
    aspects,
  };
}

function pointFromLon(key, label, glyph, lon, house) {
  const si = signIndexOf(lon);
  return {
    key, label, glyph, lon,
    sign: SIGN_NAMES[si], signIndex: si, signGlyph: SIGN_GLYPHS[si],
    degInSign: degWithinSign(lon), dms: formatDMS(degWithinSign(lon)), house,
  };
}

// Which natal house a given longitude falls in (for transits).
export function houseOfLon(lon, houses) {
  const L = norm360(lon);
  for (let i = 0; i < 12; i++) {
    const start = norm360(houses[i].cuspLon);
    const end = norm360(houses[(i + 1) % 12].cuspLon);
    if (start <= end) {
      if (L >= start && L < end) return i + 1;
    } else {
      if (L >= start || L < end) return i + 1;
    }
  }
  return null;
}
