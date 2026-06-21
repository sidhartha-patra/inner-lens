// decoders.js — composes each of the 9 decoders into a structured, personalised
// reading from the computed profile. Returns "blocks" the UI renders safely (no raw HTML).

import {
  NUMBERS, ELEMENTS, MODALITIES, PERSONAL_YEAR, PINNACLE, CHALLENGE, CHINESE,
} from "./data.js";

// "What drains you" per core number (keyed by reduced 1-9).
const DRAINS = {
  1: "rigid hierarchies, micromanagement, and roles where you can't own the outcome",
  2: "cut-throat, combative environments and work that isolates you from people",
  3: "monotonous, voiceless routine with no room for creativity or expression",
  4: "chaotic, ever-shifting environments with no structure or clear expectations",
  5: "repetitive desk-bound routine, tight control, and anything that cages you",
  6: "cold, impersonal transactional work with no human impact or care",
  7: "loud, shallow, purely social roles with no depth, focus, or room to think",
  8: "powerless positions with no authority, low stakes, and no path to real impact",
  9: "purely mercenary work with no meaning, ethics, or service to something larger",
};

const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function lpKey(n) {
  // Map master numbers down for tables keyed 1-9.
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

// Which pinnacle is active for the given age.
function currentPinnacle(profile) {
  const age = profile.age;
  return profile.pinnacles.find(
    (p) => age >= p.start && (p.end === null || age <= p.end)
  );
}

export function buildDecoder(id, profile) {
  const lp = NUMBERS[profile.lifePath];
  const s = profile.signInfo;
  const blocks = [];

  switch (id) {
    case "blueprint": {
      blocks.push({ h: `Life Path ${profile.lifePath} — ${lp.archetype}` });
      blocks.push({ p: lp.core });
      blocks.push({
        p: `Your ${profile.sign} sun (${s.element}, ${s.modality}) overlays this with a ${s.traits} streak. As a ${s.element} sign you carry ${ELEMENTS[s.element]} As ${s.modality.toLowerCase()} energy you are ${MODALITIES[s.modality]}`,
      });
      blocks.push({ h: "Hidden strengths" });
      blocks.push({ list: lp.strengths });
      blocks.push({ h: "Blind spots" });
      blocks.push({ list: lp.shadows });
      blocks.push({ h: "Long-term purpose" });
      blocks.push({ p: lp.purpose });
      blocks.push({ note: "Brutally honest read: your greatest strength and your biggest blind spot are usually the same trait pointed in two directions. Watch where yours overcorrects." });
      break;
    }

    case "patterns": {
      blocks.push({ p: `Across your life, the same patterns repeat. As a ${lp.archetype.toLowerCase()} (Life Path ${profile.lifePath}), ${lp.core.charAt(0).toLowerCase() + lp.core.slice(1)}` });
      blocks.push({ h: "Recurring patterns" });
      blocks.push({
        list: [
          `Emotionally, you default to being ${lp.keywords.join(", ")}.`,
          `Your ${profile.sign} nature pulls you toward ${s.traits}.`,
          `Under stress you swing toward your shadow side: ${lp.shadows[0].toLowerCase()}.`,
        ],
      });
      blocks.push({ h: "How they shape your life" });
      blocks.push({ p: `In relationships: ${lp.love}` });
      blocks.push({ p: `In career choices: ${lp.career}` });
      blocks.push({ h: "Self-sabotage loop" });
      blocks.push({ p: `Your classic loop: ${lp.shadows[0]} and ${lp.shadows[1] ? lp.shadows[1].toLowerCase() : "old fear"}. It tends to trigger exactly when you're closest to what you want — recognising the loop is how you break it.` });
      break;
    }

    case "strengths": {
      blocks.push({ h: "Your top natural advantages" });
      blocks.push({ list: [...lp.strengths, `${s.element}-sign gift: ${s.strength}`] });
      blocks.push({ h: "Your biggest internal weaknesses" });
      blocks.push({ list: [...lp.shadows, `${profile.sign} shadow: ${s.shadow}`] });
      blocks.push({ h: "Leverage & neutralise" });
      blocks.push({ p: `Leverage: lean deliberately into being ${lp.keywords[0]} and ${lp.keywords[1]} — these are where you outperform almost everyone. Build your work and relationships around them.` });
      blocks.push({ p: `Neutralise: ${lp.growth}` });
      break;
    }

    case "timing": {
      blocks.push({ h: `This year for you: Personal Year ${profile.personalYear} — ${PERSONAL_YEAR[profile.personalYear].title}` });
      blocks.push({ p: PERSONAL_YEAR[profile.personalYear].text });
      const cur = currentPinnacle(profile);
      blocks.push({ h: "Your life phases (pinnacles)" });
      blocks.push({
        list: profile.pinnacles.map((p, i) => {
          const range = p.end === null ? `age ${p.start}+` : `ages ${p.start}\u2013${p.end}`;
          const active = cur && cur === p ? "  \u2190 you are here" : "";
          return `${ordinal(i + 1)} phase (${range}): ${PINNACLE[p.number] || "a chapter of growth."}${active}`;
        }),
      });
      if (cur) {
        blocks.push({ h: "The phase you're in now" });
        blocks.push({ p: `At ${profile.age}, you're in your ${ordinal(profile.pinnacles.indexOf(cur) + 1).toLowerCase()} pinnacle: ${PINNACLE[cur.number] || "a chapter of growth and recalibration."} Lean into its theme rather than fighting it.` });
      }
      blocks.push({ note: "These are reflective life phases, not fixed fortune — windows of emphasis, not guarantees." });
      break;
    }

    case "relationships": {
      blocks.push({ h: "How you show up in love" });
      blocks.push({ p: lp.love });
      blocks.push({ p: `Your ${profile.sign} heart is ${s.love}.` });
      if (profile.soulUrge && NUMBERS[profile.soulUrge]) {
        blocks.push({ p: `Beneath the surface, your heart's-desire number (${profile.soulUrge}) means you most deeply crave the world of the ${NUMBERS[profile.soulUrge].archetype.toLowerCase()}: ${NUMBERS[profile.soulUrge].keywords.join(", ")}.` });
      }
      blocks.push({ h: "Your emotional needs" });
      blocks.push({ list: lp.needs });
      blocks.push({ h: "Common conflict triggers" });
      blocks.push({ list: lp.triggers });
      blocks.push({ h: "Attachment tendency" });
      blocks.push({ p: `When you feel safe you're warm and present; when a need goes unmet you tend to ${lp.shadows[0].toLowerCase()}. Naming the need out loud — before it becomes a trigger — is your relationship superpower.` });
      break;
    }

    case "career": {
      blocks.push({ h: "Where you naturally perform best" });
      blocks.push({ p: lp.career });
      blocks.push({ h: "Environments that amplify you" });
      blocks.push({ list: [...lp.careerRoles, `${profile.sign} fit: ${s.work}`] });
      blocks.push({ h: "What drains you" });
      blocks.push({ p: `Avoid ${DRAINS[lpKey(profile.lifePath)]}. These quietly erode your energy and push you into your shadow patterns.` });
      blocks.push({ h: "How to align" });
      blocks.push({ p: `Engineer your work so most days use your core gifts (${lp.keywords[0]}, ${lp.keywords[1]}). Even a great title in the wrong environment will drain you; a humble role in the right one will light you up.` });
      break;
    }

    case "conflict": {
      blocks.push({ h: "Your central inner contradiction" });
      blocks.push({ p: lp.conflict });
      const mainChallenge = profile.challenges[2]; // 3rd challenge spans most of life
      blocks.push({ h: "The lesson underneath it" });
      blocks.push({ p: CHALLENGE[mainChallenge] || CHALLENGE[0] });
      blocks.push({
        p: `There's also a tension between your ${s.element} sun (${ELEMENTS[s.element].split(" \u2014 ")[0]}) and the demands of a Life Path ${profile.lifePath}. You feel torn because both sides are genuinely you — the goal isn't to pick one, it's to stop letting them sabotage each other.`,
      });
      blocks.push({ note: "Inner conflict isn't a flaw to fix — it's two real values competing. Integration, not elimination, is the work." });
      break;
    }

    case "purpose": {
      blocks.push({ h: "The theme your life keeps circling" });
      blocks.push({ p: lp.purpose });
      if (profile.maturity && NUMBERS[profile.maturity]) {
        blocks.push({ h: "What ripens with maturity" });
        blocks.push({ p: `Your maturity number (${profile.maturity}) suggests that in the second half of life your purpose increasingly expresses as the ${NUMBERS[profile.maturity].archetype.toLowerCase()}: ${NUMBERS[profile.maturity].purpose}` });
      }
      blocks.push({ h: "What you're meant to build, master & express" });
      blocks.push({
        p: `Build: a life and work that let you be fully ${lp.keywords[0]} and ${lp.keywords[1]}. Master: turning your ${lp.strengths[0].toLowerCase()} into something only you can make. Express: the ${profile.sign} voice in you — ${s.keyword.toLowerCase()}.`,
      });
      break;
    }

    case "forecast": {
      blocks.push({ h: "Your core growth lesson" });
      blocks.push({ p: lp.growth });
      const nextPY = (profile.personalYear % 9) + 1;
      blocks.push({ h: "Where the next chapter points" });
      blocks.push({ p: `You're moving from a ${PERSONAL_YEAR[profile.personalYear].title} year toward a ${PERSONAL_YEAR[nextPY].title} year. ${PERSONAL_YEAR[nextPY].text}` });
      blocks.push({ h: "Mindset shifts to grow into" });
      blocks.push({
        list: [
          `Loosen the grip of your shadow: ${lp.shadows[0].toLowerCase()}.`,
          CHALLENGE[profile.challenges[3]] || CHALLENGE[0],
          `Trust the strength you under-use: your ${lp.strengths[lp.strengths.length - 1].toLowerCase()}.`,
        ],
      });
      blocks.push({ note: "These are mindset shifts, not predictions. Nothing here is fixed — it's a map of where your growth tends to live." });
      break;
    }

    default:
      blocks.push({ p: "No reading available." });
  }

  return { blocks };
}

export function buildAllDecoders(profile, decoderList) {
  const out = {};
  for (const d of decoderList) out[d.id] = buildDecoder(d.id, profile);
  return out;
}

// A short headline summary shown at the top of the results.
export function buildSummary(profile) {
  const lp = NUMBERS[profile.lifePath];
  return {
    archetype: lp.archetype,
    line: `Life Path ${profile.lifePath} \u00B7 ${profile.sign} ${profile.signInfo.symbol} \u00B7 ${profile.element} \u00B7 Year of the ${profile.chinese}`,
    blurb: `${lp.keywords.map((k) => k[0].toUpperCase() + k.slice(1)).join(" \u00B7 ")}. ${CHINESE[profile.chinese]}`,
  };
}
