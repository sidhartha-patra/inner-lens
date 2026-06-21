// numerology.js — deterministic numerology calculations from a birth date.
// Pure functions, no DOM. All "keep master" logic preserves 11/22/33.

const MASTERS = new Set([11, 22, 33]);

function digitSum(n) {
  return String(Math.abs(n))
    .split("")
    .reduce((a, c) => a + (Number(c) || 0), 0);
}

// Reduce a number to a single digit. When keepMaster is true, stop at 11/22/33.
export function reduceNumber(n, keepMaster = true) {
  let x = Math.abs(Math.trunc(n));
  while (x > 9 && !(keepMaster && MASTERS.has(x))) {
    x = digitSum(x);
  }
  return x;
}

// Life Path: reduce month, day, year separately, sum, then reduce (keep master).
export function lifePathNumber(year, month, day) {
  const rm = reduceNumber(month, true);
  const rd = reduceNumber(day, true);
  const ry = reduceNumber(year, true);
  return reduceNumber(rm + rd + ry, true);
}

// Birthday number: the day of month reduced (keep master).
export function birthdayNumber(day) {
  return reduceNumber(day, true);
}

// Sun / Attitude number: day + month reduced to a single digit.
export function attitudeNumber(month, day) {
  return reduceNumber(reduceNumber(month, false) + reduceNumber(day, false), false);
}

// Personal Year: birth month + birth day + current year, reduced to 1-9.
export function personalYearNumber(month, day, currentYear) {
  const rm = reduceNumber(month, false);
  const rd = reduceNumber(day, false);
  const ry = reduceNumber(currentYear, false);
  return reduceNumber(rm + rd + ry, false);
}

// Four pinnacles with their age windows.
export function pinnacles(year, month, day, lifePath) {
  const rm = reduceNumber(month, false);
  const rd = reduceNumber(day, false);
  const ry = reduceNumber(year, false);

  const p1 = reduceNumber(rm + rd, true);
  const p2 = reduceNumber(rd + ry, true);
  const p3 = reduceNumber(reduceNumber(p1, false) + reduceNumber(p2, false), true);
  const p4 = reduceNumber(rm + ry, true);

  const lpSingle = reduceNumber(lifePath, false);
  const firstEnd = 36 - lpSingle;

  return [
    { number: p1, start: 0, end: firstEnd },
    { number: p2, start: firstEnd + 1, end: firstEnd + 9 },
    { number: p3, start: firstEnd + 10, end: firstEnd + 18 },
    { number: p4, start: firstEnd + 19, end: null },
  ];
}

// Four challenges (lessons). Challenges are always single digits, 0 is valid.
export function challenges(year, month, day) {
  const rm = reduceNumber(month, false);
  const rd = reduceNumber(day, false);
  const ry = reduceNumber(year, false);

  const c1 = Math.abs(rm - rd);
  const c2 = Math.abs(rd - ry);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(rm - ry);

  return [c1, c2, c3, c4];
}

// --- Name-based numbers (optional, only when a name is supplied) ---

const LETTER_VALUE = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};
const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function lettersOnly(name) {
  return (name || "").toLowerCase().replace(/[^a-z]/g, "").split("");
}

// Expression / Destiny number: all letters of the full name.
export function expressionNumber(name) {
  const letters = lettersOnly(name);
  if (!letters.length) return null;
  const sum = letters.reduce((a, ch) => a + (LETTER_VALUE[ch] || 0), 0);
  return reduceNumber(sum, true);
}

// Soul Urge / Heart's Desire: the vowels of the name.
export function soulUrgeNumber(name) {
  const letters = lettersOnly(name).filter((ch) => VOWELS.has(ch));
  if (!letters.length) return null;
  const sum = letters.reduce((a, ch) => a + (LETTER_VALUE[ch] || 0), 0);
  return reduceNumber(sum, true);
}

// Maturity number: life path + expression, reduced (keep master).
export function maturityNumber(lifePath, expression) {
  if (expression == null) return null;
  return reduceNumber(reduceNumber(lifePath, false) + reduceNumber(expression, false), true);
}
