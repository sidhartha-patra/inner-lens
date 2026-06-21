// ai.js — optional "Live AI" mode. Bring-your-own-key, OpenAI-compatible Chat
// Completions. The key is stored only in the browser (localStorage) and is sent
// only to the provider endpoint you choose. No backend, no third party.

export const PROVIDERS = {
  openai: { label: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  openrouter: { label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini" },
  groq: { label: "Groq", baseUrl: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
  custom: { label: "Custom (OpenAI-compatible)", baseUrl: "", model: "" },
};

const STORE_KEY = "asd.ai.settings";

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORE_KEY, JSON.stringify(settings || {}));
}

export function clearSettings() {
  localStorage.removeItem(STORE_KEY);
}

export function hasKey() {
  const s = loadSettings();
  return Boolean(s && s.apiKey);
}

const SYSTEM_PROMPT =
  "You are a thoughtful self-discovery analyst blending psychology, numerology logic and " +
  "behavioural pattern mapping. You are reflective, specific and honest, never mystical or " +
  "fortune-telling. Frame everything as introspection and patterns, not predictions about " +
  "fixed events. Use clear, warm, direct language. Format with short paragraphs and bullet " +
  "points. Keep each response under 300 words.";

export async function generateReading(userPrompt, settings) {
  const cfg = settings || loadSettings();
  const baseUrl = (cfg.baseUrl || "").replace(/\/+$/, "");
  if (!cfg.apiKey) throw new Error("No API key set.");
  if (!baseUrl) throw new Error("No API base URL set.");
  if (!cfg.model) throw new Error("No model set.");

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
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
    try {
      const j = await res.json();
      detail = j.error?.message || JSON.stringify(j);
    } catch {
      detail = await res.text();
    }
    throw new Error(`Provider error ${res.status}: ${detail || res.statusText}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from provider.");
  return text.trim();
}
