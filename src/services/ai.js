// ai.js — optional Live-AI readings. Bring-your-own-key (OpenAI-compatible) OR the
// local Copilot Opus proxy (no key). Keys live only in the browser (localStorage)
// and are sent only to the provider you choose.

export const PROVIDERS = {
  "copilot-local": { label: "Copilot Opus 4.8 (local server)", baseUrl: "http://localhost:8787/v1", model: "claude-opus-4.8", noKey: true },
  openai: { label: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  openrouter: { label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini" },
  groq: { label: "Groq", baseUrl: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
  custom: { label: "Custom (OpenAI-compatible)", baseUrl: "", model: "" },
};

const STORE_KEY = "il.ai.settings";

export function loadSettings() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch { return {}; }
}
export function saveSettings(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s || {})); }
export function clearSettings() { localStorage.removeItem(STORE_KEY); }

export function providerNeedsKey(providerId) {
  return !PROVIDERS[providerId]?.noKey;
}
export function isReady() {
  const s = loadSettings();
  if (!s.provider || !s.baseUrl || !s.model) return false;
  return PROVIDERS[s.provider]?.noKey ? true : Boolean(s.apiKey);
}

const SYSTEM_PROMPT =
  "You are a thoughtful astrologer and self-discovery analyst. You blend Western and Vedic " +
  "astrology, psychology and numerology. You are specific, warm and honest, never vague or " +
  "fortune-telling. Treat charts as mirrors of tendencies and timing, not fixed fate. When given " +
  "chart data, ground every statement in the actual placements provided. Use short paragraphs and " +
  "bullet points. Keep responses under 320 words.";

export async function generateReading(userPrompt, settings) {
  const cfg = settings || loadSettings();
  const baseUrl = (cfg.baseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) throw new Error("No API base URL set.");
  if (!cfg.model) throw new Error("No model set.");
  const needsKey = providerNeedsKey(cfg.provider);
  if (needsKey && !cfg.apiKey) throw new Error("No API key set for this provider.");

  const headers = { "Content-Type": "application/json" };
  if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    let detail = "";
    try { const j = await res.json(); detail = j.error?.message || JSON.stringify(j); }
    catch { detail = await res.text(); }
    throw new Error(`Provider error ${res.status}: ${detail || res.statusText}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from provider.");
  return text.trim();
}

// --- Grounded prompt builders: embed compact chart facts so the LLM is specific. ---

export function westernFacts(chart) {
  const lines = chart.planets.map((p) => `${p.label}: ${p.sign} ${p.dms}${p.house ? `, house ${p.house}` : ""}${p.retro ? " (R)" : ""}`);
  const asp = chart.aspects.slice(0, 8).map((a) => `${a.a} ${a.type} ${a.b} (orb ${a.orb}°)`);
  return [
    `Western (tropical) chart for ${chart.meta.name || "the person"}:`,
    `Ascendant: ${chart.ascendant.sign} ${chart.ascendant.dms}; Midheaven: ${chart.midheaven.sign}.`,
    `Planets: ${lines.join("; ")}.`,
    `Key aspects: ${asp.join("; ")}.`,
  ].join("\n");
}

export function vedicFacts(vedic) {
  const md = vedic.dasha.currentMaha, ad = vedic.dasha.currentAntar;
  const lines = vedic.planets.map((p) => `${p.label}: ${p.rasi} (${p.nakshatra} p${p.pada}), house ${p.house}`);
  return [
    `Vedic (sidereal, Lahiri ayanamsa ${vedic.ayanamsa.toFixed(2)}°):`,
    `Lagna: ${vedic.ascendant.rasi}; Moon nakshatra: ${vedic.moonNakshatra.name} pada ${vedic.moonNakshatra.pada} (ruler ${vedic.moonNakshatra.ruler}).`,
    `Current Mahadasha: ${md.planet}${ad ? `, Antardasha: ${ad.planet}` : ""}.`,
    `Placements: ${lines.join("; ")}.`,
  ].join("\n");
}

export function buildGroundedPrompt(kind, ctx) {
  if (kind === "western") {
    return `${westernFacts(ctx.western)}\n\nGive a grounded natal reading: core personality (Sun/Moon/Rising), strengths, challenges, and life direction. Reference the specific placements above.`;
  }
  if (kind === "vedic") {
    return `${vedicFacts(ctx.vedic)}\n\nGive a grounded Vedic reading: lagna and Moon-sign nature, the meaning of the birth nakshatra, and what the current Mahadasha/Antardasha period asks of them. Reference the specific placements above.`;
  }
  if (kind === "synthesis") {
    return `${westernFacts(ctx.western)}\n\n${vedicFacts(ctx.vedic)}\n\nSynthesize Western and Vedic views into one honest portrait: who they are, their core tensions, gifts, and the theme of their current life-period. Note where the two systems agree or differ.`;
  }
  if (kind === "transits") {
    const t = ctx.transits.aspects.slice(0, 6).map((a) => `transit ${a.transit} ${a.type} natal ${a.natal} (orb ${a.orb}°)`).join("; ");
    return `${westernFacts(ctx.western)}\n\nCurrent transits: ${t}.\n\nDescribe the person's current astrological 'weather' and the growth themes available now. Mindset and timing, not predictions.`;
  }
  return ctx?.prompt || "";
}
