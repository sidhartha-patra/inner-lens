// zodiac.js — sun sign, element, modality and Chinese (year) zodiac from a date.

import { SIGNS } from "./data.js";

// Western sun sign from month (1-12) and day.
export function sunSign(month, day) {
  const m = Number(month);
  const d = Number(day);
  const ranges = [
    ["Capricorn", 1, 1, 1, 19],
    ["Aquarius", 1, 20, 2, 18],
    ["Pisces", 2, 19, 3, 20],
    ["Aries", 3, 21, 4, 19],
    ["Taurus", 4, 20, 5, 20],
    ["Gemini", 5, 21, 6, 20],
    ["Cancer", 6, 21, 7, 22],
    ["Leo", 7, 23, 8, 22],
    ["Virgo", 8, 23, 9, 22],
    ["Libra", 9, 23, 10, 22],
    ["Scorpio", 10, 23, 11, 21],
    ["Sagittarius", 11, 22, 12, 21],
    ["Capricorn", 12, 22, 12, 31],
  ];
  for (const [name, sm, sd, em, ed] of ranges) {
    if (m === sm && m === em && d >= sd && d <= ed) return name;
    if (m === sm && m !== em && d >= sd) return name;
    if (m === em && m !== sm && d <= ed) return name;
  }
  return "Capricorn";
}

export function signInfo(name) {
  return SIGNS[name] || null;
}

const ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

// Chinese zodiac animal (approximate — by solar year; ignores lunar new-year offset).
export function chineseZodiac(year) {
  // 1984 was the Year of the Rat.
  const idx = ((Number(year) - 1984) % 12 + 12) % 12;
  return ANIMALS[idx];
}

// Day of week the person was born (nice extra context).
export function dayOfWeek(year, month, day) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return days[d.getUTCDay()];
}
