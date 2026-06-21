// prompts.js — the nine viral prompts (Dipti Sharma / Grok), as reusable templates.
// {dob} is replaced with the user's date of birth. Wording mirrors the source article.

export const DECODERS = [
  {
    id: "blueprint",
    icon: "\u{1F9ED}", // compass
    title: "Life Blueprint Decoder",
    tagline: "Core traits, hidden strengths, blind spots & long-term purpose.",
    prompt:
      "Act as a life path analyst. I will give you my date of birth: {dob}. " +
      "Analyze it using psychology, numerology logic, and life pattern mapping. " +
      "Reveal my core personality traits, hidden strengths, blind spots, and long-term purpose. " +
      "Be brutally honest and specific.",
  },
  {
    id: "patterns",
    icon: "\u{1F501}", // repeat
    title: "Personality Pattern Revealer",
    tagline: "Recurring emotional, behavioural & decision-making patterns.",
    prompt:
      "Based on my birth date {dob}, identify recurring emotional, behavioral, and decision-making patterns. " +
      "Explain how they shape my relationships, career choices, and self-sabotage loops.",
  },
  {
    id: "strengths",
    icon: "\u{2696}\u{FE0F}", // scales
    title: "Strength & Weakness Breakdown",
    tagline: "Top natural advantages and biggest internal weaknesses.",
    prompt:
      "Use my date of birth {dob} to list my top natural advantages and my biggest internal weaknesses. " +
      "Explain how to leverage the strengths and neutralize the weaknesses.",
  },
  {
    id: "timing",
    icon: "\u{23F3}", // hourglass
    title: "Life Timing Analyzer",
    tagline: "Key life phases, past turning points & upcoming periods.",
    prompt:
      "Analyze my birth date {dob} and identify key life phases. " +
      "Highlight past turning points and upcoming periods of growth, struggle, or opportunity.",
  },
  {
    id: "relationships",
    icon: "\u{1F495}", // two hearts
    title: "Relationship Mirror",
    tagline: "Attachment tendencies, emotional needs & conflict triggers.",
    prompt:
      "Based on my birth date {dob}, explain how I show up in close relationships. " +
      "Include attachment tendencies, emotional needs, and common conflict triggers.",
  },
  {
    id: "career",
    icon: "\u{1F9ED}", // placeholder, overridden below
    title: "Career Alignment Scanner",
    tagline: "Roles & environments where you naturally perform best.",
    prompt:
      "Using my birth date {dob}, identify careers, roles, or environments where I naturally perform best. " +
      "Explain which paths drain me and which amplify my strengths.",
  },
  {
    id: "conflict",
    icon: "\u{1F300}", // cyclone
    title: "Inner Conflict Decoder",
    tagline: "Internal contradictions and why you feel torn.",
    prompt:
      "Analyze internal contradictions in my personality based on my birth date {dob}. " +
      "Explain why I feel torn between certain desires, goals, or identities.",
  },
  {
    id: "purpose",
    icon: "\u{1F31F}", // star
    title: "Purpose Clarifier",
    tagline: "The single core theme your life keeps circling around.",
    prompt:
      "Based on my birth date {dob}, define the single core theme my life keeps circling around. " +
      "Explain what I am meant to build, master, or express.",
  },
  {
    id: "forecast",
    icon: "\u{1F52E}", // crystal ball
    title: "Future Pattern Forecast",
    tagline: "Likely growth lessons & mindset shifts (not predictions).",
    prompt:
      "Using my birth date {dob}, outline likely future challenges and growth lessons. " +
      "Focus on mindset shifts, not predictions.",
  },
];

// Fix the career icon (briefcase).
DECODERS.find((d) => d.id === "career").icon = "\u{1F4BC}";

export function fillPrompt(template, dob) {
  return template.replace(/\{dob\}/g, dob);
}
