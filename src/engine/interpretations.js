// interpretations.js — content tables + composers that turn a chart into readings.
// Reflective psychology-of-astrology framing, not prediction.

import { SIGNS } from "./data.js";

export const PLANETS = {
  sun: { label: "Sun", governs: "your core identity and life force", kw: "who you are becoming" },
  moon: { label: "Moon", governs: "your emotional world and instincts", kw: "what you need to feel safe" },
  mercury: { label: "Mercury", governs: "how you think and communicate", kw: "your mind and voice" },
  venus: { label: "Venus", governs: "how you love, attract and value", kw: "what you find beautiful" },
  mars: { label: "Mars", governs: "your drive, desire and assertion", kw: "how you go after things" },
  jupiter: { label: "Jupiter", governs: "growth, luck and meaning", kw: "where you expand" },
  saturn: { label: "Saturn", governs: "discipline, limits and mastery", kw: "where you mature the hard way" },
  uranus: { label: "Uranus", governs: "freedom, change and originality", kw: "where you break the mold" },
  neptune: { label: "Neptune", governs: "dreams, intuition and the unseen", kw: "where you dissolve and imagine" },
  pluto: { label: "Pluto", governs: "power, depth and transformation", kw: "where you die and are reborn" },
  northnode: { label: "North Node", governs: "your growth direction this lifetime", kw: "where you are headed" },
  southnode: { label: "South Node", governs: "comfortable, past patterns", kw: "what you already know" },
};

export const HOUSES = {
  1: "self, body, and the first impression you give",
  2: "money, values, security and self-worth",
  3: "communication, learning, siblings and daily mind",
  4: "home, roots, family and emotional foundation",
  5: "creativity, romance, play and self-expression",
  6: "work, health, routines and service",
  7: "partnership, marriage and one-to-one relating",
  8: "intimacy, shared resources, depth and transformation",
  9: "beliefs, travel, higher learning and meaning",
  10: "career, reputation and public life",
  11: "friends, networks, hopes and the collective",
  12: "the unconscious, solitude, spirituality and release",
};

export const ASPECT_TONE = {
  conjunction: "fuse and intensify each other — a powerful, blended force you can't easily separate",
  sextile: "support each other with easy, available opportunity (if you use it)",
  square: "create friction and inner tension that, worked with, becomes your engine for growth",
  trine: "flow together naturally — a gift so easy you can take it for granted",
  opposition: "pull in opposite directions, asking you to balance two real needs",
};

// Vimshottari dasha period themes.
export const DASHA_THEME = {
  Sun: "authority, identity, recognition and relationship with father/self-worth — a time to step into your own light.",
  Moon: "emotions, home, nurturing, the public and the mother — a sensitive, fluctuating, care-centred chapter.",
  Mars: "energy, courage, conflict, property and drive — action, ambition and the urge to fight for something.",
  Rahu: "worldly desire, ambition, the foreign and the unconventional — amplification, obsession and big swings.",
  Jupiter: "wisdom, expansion, teachers, children and fortune — growth, meaning, optimism and opportunity.",
  Saturn: "discipline, hard work, delays, responsibility and maturity — the long, sobering climb that builds mastery.",
  Mercury: "intellect, communication, business, learning and skill — a mentally busy, adaptable, commercial period.",
  Ketu: "detachment, spirituality, loss-and-liberation and the past — a turning inward, away from the material.",
  Venus: "love, pleasure, beauty, comfort, art and relationships — sweetness, romance and material ease.",
};

// One-line nakshatra flavour (27).
export const NAKSHATRA_TRAIT = {
  Ashwini: "quick, pioneering, healing energy — first out of the gate",
  Bharani: "intense, creative, bearing the weight of transformation",
  Krittika: "sharp, purifying, cuts through illusion with fiery focus",
  Rohini: "magnetic, sensual, fertile — a lover of beauty and growth",
  Mrigashira: "curious, searching, gentle seeker always looking for more",
  Ardra: "stormy, brilliant, breaks things down to renew them",
  Punarvasu: "resilient, optimistic, returns to light after every fall",
  Pushya: "nourishing, steady, the most supportive and caring star",
  Ashlesha: "hypnotic, perceptive, coiled wisdom and emotional depth",
  Magha: "regal, ancestral, carries legacy, pride and leadership",
  "Purva Phalguni": "playful, romantic, generous lover of leisure and art",
  "Uttara Phalguni": "loyal, helpful, builds lasting bonds and contracts",
  Hasta: "skilful, clever, makes things happen with the hands and mind",
  Chitra: "dazzling, artistic, a creator of brilliant form and design",
  Swati: "independent, adaptable, scattered like wind seeking freedom",
  Vishakha: "determined, goal-driven, burns with focused ambition",
  Anuradha: "devoted, friendly, succeeds through loyalty and cooperation",
  Jyeshtha: "protective, sharp, a seasoned elder who carries authority",
  Mula: "investigative, intense, digs to the root and tears out illusion",
  "Purva Ashadha": "invincible optimism, persuasive, rising like water",
  "Uttara Ashadha": "principled, enduring, wins the lasting, ethical victory",
  Shravana: "listening, learning, connected through knowledge and word",
  Dhanishta: "rhythmic, wealthy, adaptable performer with cosmic timing",
  Shatabhisha: "mysterious, healing, solitary mind drawn to the hidden",
  "Purva Bhadrapada": "idealistic, fiery, intense spiritual transformer",
  "Uttara Bhadrapada": "deep, wise, the calm stillness beneath the waves",
  Revati: "gentle, nourishing, a compassionate guide for the final journey",
};

const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export function planetLine(p) {
  const meta = PLANETS[p.key] || { label: p.label, governs: "this part of you", kw: "" };
  const sign = SIGNS[p.sign] || { keyword: p.sign, traits: "" };
  const house = p.house ? ` in your ${ORD[p.house]} house (${HOUSES[p.house]})` : "";
  const retro = p.retro ? " — retrograde, so this energy turns inward and asks for review" : "";
  return `${p.glyph} ${meta.label} in ${p.sign} ${p.signGlyph || ""}${house}: ${meta.governs}, coloured by ${p.sign}'s ${sign.traits}${retro}.`;
}

export function composeNatalReading(chart) {
  const blocks = [];
  const sun = chart.planets.find((p) => p.key === "sun");
  const moon = chart.planets.find((p) => p.key === "moon");
  const asc = chart.ascendant;

  blocks.push({ h: "Your big three" });
  blocks.push({ p: `**Sun in ${sun.sign}** — your core self: ${SIGNS[sun.sign]?.keyword || ""}, ${SIGNS[sun.sign]?.traits || ""}. **Moon in ${moon.sign}** — your inner emotional needs: ${SIGNS[moon.sign]?.traits || ""}. **${asc.sign} rising** — the mask you meet the world with: ${SIGNS[asc.sign]?.traits || ""}.` });

  blocks.push({ h: "Your planets, sign by sign" });
  blocks.push({ list: chart.planets.map(planetLine) });

  if (chart.aspects?.length) {
    const top = pickTopAspects(chart.aspects, 5);
    blocks.push({ h: "Your defining aspects" });
    blocks.push({
      list: top.map((a) => {
        const pa = PLANETS[a.a]?.label || a.a;
        const pb = PLANETS[a.b]?.label || a.b;
        return `${pa} ${ASPECTS_GLYPH[a.type]} ${pb} (${a.type}, orb ${a.orb}°): these ${ASPECT_TONE[a.type]}.`;
      }),
    });
  }

  blocks.push({ note: "A natal chart is a mirror of tendencies and themes, not a fixed script. You always have the pen." });
  return { blocks };
}

const ASPECTS_GLYPH = { conjunction: "☌", sextile: "⚹", square: "□", trine: "△", opposition: "☍" };

// Prioritise aspects involving personal planets + tight orbs.
function pickTopAspects(aspects, n) {
  const personal = new Set(["sun", "moon", "mercury", "venus", "mars"]);
  return [...aspects]
    .map((a) => ({ ...a, score: (personal.has(a.a) ? 2 : 1) + (personal.has(a.b) ? 2 : 1) + (8 - a.orb) / 4 }))
    .sort((x, y) => y.score - x.score)
    .slice(0, n);
}

export function composeVedicReading(vedic) {
  const blocks = [];
  const moon = vedic.planets.find((p) => p.key === "moon");
  const sun = vedic.planets.find((p) => p.key === "sun");
  const nak = vedic.moonNakshatra;

  blocks.push({ h: "Your Vedic foundations (sidereal · Lahiri)" });
  blocks.push({ p: `**Lagna (Ascendant):** ${vedic.ascendant.rasi} (${vedic.ascendant.sign}). **Rashi (Moon sign):** ${moon.rasi} (${moon.sign}) — in Jyotish your Moon sign is your primary identity. **Sun:** ${sun.rasi} (${sun.sign}).` });

  blocks.push({ h: "Your birth star (Nakshatra)" });
  blocks.push({ p: `**${nak.name}**, pada ${nak.pada}, ruled by **${nak.ruler}** — ${NAKSHATRA_TRAIT[nak.name] || "a unique lunar signature"}. The Moon's nakshatra shapes your instincts and sets your entire Dasha clock.` });

  const md = vedic.dasha.currentMaha;
  const ad = vedic.dasha.currentAntar;
  blocks.push({ h: "Your current life chapter (Vimshottari Dasha)" });
  blocks.push({ p: `You are in your **${md.planet} Mahadasha**${ad ? `, **${ad.planet} Antardasha**` : ""}. ${DASHA_THEME[md.planet]} ${ad ? `Within it, the ${ad.planet} sub-period flavours things with ${shortDasha(ad.planet)}.` : ""}` });
  blocks.push({ p: `This Mahadasha runs until **${fmtDate(md.end)}**.` });

  blocks.push({ note: "Dashas are planetary seasons — they describe the weather of a life-period, not a fixed fate." });
  return { blocks };
}

function shortDasha(planet) {
  const t = DASHA_THEME[planet] || "";
  return t.split(" — ")[0] || t;
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
}

export function composeTransitReading(transits) {
  const blocks = [];
  const top = transits.aspects.filter((a) => ["sun", "moon", "venus", "mars", "saturn", "jupiter"].includes(a.natal)).slice(0, 6);
  blocks.push({ h: "Your sky right now" });
  if (!top.length) {
    blocks.push({ p: "No tight major transits to your personal planets today — a quieter, more self-directed window." });
  } else {
    blocks.push({
      list: top.map((a) => {
        const tp = PLANETS[a.transit]?.label || a.transit;
        const np = PLANETS[a.natal]?.label || a.natal;
        const tone = a.harmony > 0 ? "supportive" : a.harmony < 0 ? "challenging but growthful" : "intense and blending";
        return `Transiting ${tp} ${a.glyph} your natal ${np} (${a.type}, orb ${a.orb}°) — a ${tone} influence on ${PLANETS[a.natal]?.governs || "you"}.`;
      }),
    });
  }
  blocks.push({ note: "Transits are timing weather over your fixed natal chart — passing influences, not permanent change." });
  return { blocks };
}
