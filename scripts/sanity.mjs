// sanity.mjs — node smoke test for the offline engine. Run: node scripts/sanity.mjs
// Imports only the pure (DOM-free) modules.

import {
  lifePathNumber, birthdayNumber, attitudeNumber, personalYearNumber,
  pinnacles, challenges, expressionNumber, soulUrgeNumber, maturityNumber, reduceNumber,
} from "../assets/js/numerology.js";
import { sunSign, signInfo, chineseZodiac, dayOfWeek } from "../assets/js/zodiac.js";
import { DECODERS, fillPrompt } from "../assets/js/prompts.js";
import { buildDecoder, buildSummary } from "../assets/js/decoders.js";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

function computeAge(y, m, d) {
  const t = new Date();
  let age = t.getFullYear() - y;
  const had = t.getMonth() + 1 > m || (t.getMonth() + 1 === m && t.getDate() >= d);
  if (!had) age -= 1;
  return age;
}

function buildProfile(name, y, m, d) {
  const currentYear = new Date().getFullYear();
  const lifePath = lifePathNumber(y, m, d);
  const sign = sunSign(m, d);
  const expression = expressionNumber(name);
  return {
    name: (name || "").trim(),
    year: y, month: m, day: d,
    dobReadable: `${d} ${MONTHS[m - 1]} ${y}`,
    currentYear,
    age: computeAge(y, m, d),
    bornOn: dayOfWeek(y, m, d),
    lifePath,
    birthday: birthdayNumber(d),
    attitude: attitudeNumber(m, d),
    personalYear: personalYearNumber(m, d, currentYear),
    pinnacles: pinnacles(y, m, d, lifePath),
    challenges: challenges(y, m, d),
    sign,
    signInfo: signInfo(sign),
    element: signInfo(sign).element,
    modality: signInfo(sign).modality,
    chinese: chineseZodiac(y),
    expression,
    soulUrge: soulUrgeNumber(name),
    maturity: maturityNumber(lifePath, expression),
  };
}

let failures = 0;
function check(cond, msg) {
  if (!cond) { failures++; console.error(`  \u2717 ${msg}`); }
}

// 1) Reduction / master-number sanity.
check(reduceNumber(29, false) === 2, "reduceNumber(29,false) === 2");
check(reduceNumber(29) === 11, "reduceNumber(29) === 11 (master kept)");
check(reduceNumber(11) === 11, "reduceNumber(11) keeps master 11");
check(reduceNumber(38) === 11, "reduceNumber(38) === 11 (master)");
check(reduceNumber(11, false) === 2, "reduceNumber(11,false) === 2");
check(lifePathNumber(1989, 4, 21) === 7, "Life Path 21 Apr 1989 === 7");
check(sunSign(4, 21) === "Taurus", "21 Apr is Taurus");
check(sunSign(12, 25) === "Capricorn", "25 Dec is Capricorn");
check(sunSign(1, 1) === "Capricorn", "1 Jan is Capricorn");
check(chineseZodiac(1984) === "Rat", "1984 is Rat");
check(chineseZodiac(1989) === "Snake", "1989 is Snake");

// 2) Every decoder renders non-empty blocks for a spread of dates, with no throw.
const samples = [
  ["Alex", 1990, 7, 15],
  ["Sam", 2000, 11, 29],   // master-prone
  ["Jo", 1984, 1, 1],
  ["Priya", 1989, 4, 21],
  ["", 1975, 12, 31],
  ["Max", 2010, 2, 29],    // leap day
];

for (const [name, y, m, d] of samples) {
  let profile;
  try {
    profile = buildProfile(name, y, m, d);
  } catch (e) {
    failures++; console.error(`  \u2717 buildProfile threw for ${y}-${m}-${d}: ${e.message}`); continue;
  }
  const summary = buildSummary(profile);
  check(summary.archetype && summary.line, `summary built for ${y}-${m}-${d}`);

  for (const dec of DECODERS) {
    try {
      const out = buildDecoder(dec.id, profile);
      check(out.blocks && out.blocks.length >= 2, `${dec.id} has blocks for ${y}-${m}-${d}`);
      const empty = out.blocks.some((b) =>
        (b.p !== undefined && !b.p) ||
        (b.h !== undefined && !b.h) ||
        (b.list !== undefined && (!b.list.length || b.list.some((x) => x == null || x === "" || /undefined|NaN/.test(String(x))))) ||
        (b.p !== undefined && /undefined|NaN/.test(b.p)));
      check(!empty, `${dec.id} blocks free of undefined/NaN for ${y}-${m}-${d}`);
      const filled = fillPrompt(dec.prompt, profile.dobReadable);
      check(!filled.includes("{dob}"), `${dec.id} prompt filled for ${y}-${m}-${d}`);
    } catch (e) {
      failures++; console.error(`  \u2717 ${dec.id} threw for ${y}-${m}-${d}: ${e.message}`);
    }
  }
}

// 3) Print one full reading for eyeballing.
const p = buildProfile("Priya", 1989, 4, 21);
console.log("\nSample profile (Priya, 21 Apr 1989):");
console.log("  Life Path:", p.lifePath, "| Sun:", p.sign, "| Element:", p.element,
  "| Personal Year:", p.personalYear, "| Chinese:", p.chinese, "| Expression:", p.expression);
console.log("  Pinnacles:", p.pinnacles.map((x) => `${x.number}(${x.start}-${x.end ?? "+"})`).join(", "));
console.log("  Challenges:", p.challenges.join(", "));

if (failures === 0) {
  console.log(`\n\u2713 All checks passed (${DECODERS.length} decoders \u00D7 ${samples.length} dates).`);
  process.exit(0);
} else {
  console.error(`\n\u2717 ${failures} check(s) failed.`);
  process.exit(1);
}
