// app.js — UI controller: reads the birth date, builds the profile, renders the
// nine decoders, wires copy-prompt buttons and the optional Live-AI mode.

import {
  lifePathNumber, birthdayNumber, attitudeNumber, personalYearNumber,
  pinnacles, challenges, expressionNumber, soulUrgeNumber, maturityNumber,
} from "./numerology.js";
import { sunSign, signInfo, chineseZodiac, dayOfWeek } from "./zodiac.js";
import { DECODERS, fillPrompt } from "./prompts.js";
import { buildDecoder, buildSummary } from "./decoders.js";
import * as ai from "./ai.js";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, props = {}, ...kids) => {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  kids.flat().forEach((c) => node.append(c && c.nodeType ? c : document.createTextNode(String(c))));
  return node;
};

// ---------- profile ----------

function computeAge(y, m, d) {
  const today = new Date();
  let age = today.getFullYear() - y;
  const had = today.getMonth() + 1 > m || (today.getMonth() + 1 === m && today.getDate() >= d);
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

// ---------- rendering ----------

function renderInline(text, parent) {
  // Minimal **bold** support, everything inserted as text (no HTML injection).
  const parts = String(text).split(/\*\*(.+?)\*\*/g);
  parts.forEach((part, i) => {
    if (i % 2 === 1) parent.append(el("strong", { text: part }));
    else if (part) parent.append(document.createTextNode(part));
  });
}

function renderBlocks(container, blocks) {
  blocks.forEach((b) => {
    if (b.h) container.append(el("h4", { class: "block-h", text: b.h }));
    else if (b.p) { const p = el("p", { class: "block-p" }); renderInline(b.p, p); container.append(p); }
    else if (b.note) { const p = el("p", { class: "block-note" }); renderInline(b.note, p); container.append(p); }
    else if (b.list) {
      const ul = el("ul", { class: "block-list" });
      b.list.forEach((item) => { const li = el("li"); renderInline(item, li); ul.append(li); });
      container.append(ul);
    }
  });
}

function renderSummary(profile) {
  const sum = buildSummary(profile);
  const wrap = $("#summary");
  wrap.replaceChildren();

  const hello = profile.name ? `${profile.name}, you're a` : "You're a";
  wrap.append(
    el("div", { class: "summary-top" },
      el("span", { class: "summary-sign", text: profile.signInfo.symbol }),
      el("div", {},
        el("p", { class: "summary-hello", text: hello }),
        el("h2", { class: "summary-archetype", text: sum.archetype }),
        el("p", { class: "summary-line", text: sum.line }),
      ),
    ),
    el("p", { class: "summary-blurb", text: sum.blurb }),
    el("div", { class: "chips" },
      chip("Life Path", profile.lifePath),
      chip("Sun sign", `${profile.sign} ${profile.signInfo.symbol}`),
      chip("Element", profile.element),
      chip("Birthday no.", profile.birthday),
      chip("Personal Year", profile.personalYear),
      chip("Born on a", profile.bornOn),
      chip("Age", profile.age),
      chip("Year of the", profile.chinese),
      profile.expression ? chip("Expression", profile.expression) : null,
    ),
  );
}

function chip(label, value) {
  if (value == null) return document.createTextNode("");
  return el("span", { class: "chip" },
    el("span", { class: "chip-label", text: label }),
    el("span", { class: "chip-value", text: String(value) }),
  );
}

function decoderCard(decoder, profile) {
  const reading = buildDecoder(decoder.id, profile);
  const filled = fillPrompt(decoder.prompt, profile.dobReadable);

  const body = el("div", { class: "card-body" });
  renderBlocks(body, reading.blocks);

  const promptBox = el("pre", { class: "prompt-box hidden", text: filled });
  const aiOut = el("div", { class: "ai-output hidden" });

  const copyBtn = el("button", { class: "btn btn-ghost", type: "button",
    onclick: async (e) => {
      try { await navigator.clipboard.writeText(filled); flash(e.target, "Copied!"); }
      catch { flash(e.target, "Copy failed"); }
    } }, "Copy prompt");

  const showBtn = el("button", { class: "btn btn-ghost", type: "button",
    onclick: () => {
      promptBox.classList.toggle("hidden");
      showBtn.textContent = promptBox.classList.contains("hidden") ? "Show prompt" : "Hide prompt";
    } }, "Show prompt");

  const actions = el("div", { class: "card-actions" }, copyBtn, showBtn);

  if (ai.hasKey()) {
    const aiBtn = el("button", { class: "btn btn-ai", type: "button",
      onclick: async () => {
        aiBtn.disabled = true;
        const prev = aiBtn.textContent;
        aiBtn.textContent = "Thinking\u2026";
        aiOut.classList.remove("hidden");
        aiOut.replaceChildren(el("p", { class: "block-note", text: "Generating a live reading\u2026" }));
        try {
          const text = await ai.generateReading(filled);
          aiOut.replaceChildren(el("p", { class: "ai-badge", text: "\u2728 Live AI reading" }));
          text.split(/\n{2,}/).forEach((para) => {
            const trimmed = para.trim();
            if (!trimmed) return;
            if (/^[-*]\s/.test(trimmed)) {
              const ul = el("ul", { class: "block-list" });
              trimmed.split(/\n/).forEach((line) => {
                const li = el("li"); renderInline(line.replace(/^[-*]\s/, ""), li); ul.append(li);
              });
              aiOut.append(ul);
            } else {
              const p = el("p", { class: "block-p" }); renderInline(trimmed, p); aiOut.append(p);
            }
          });
        } catch (err) {
          aiOut.replaceChildren(el("p", { class: "block-error", text: `\u26A0 ${err.message}` }));
        } finally {
          aiBtn.disabled = false;
          aiBtn.textContent = prev;
        }
      } }, "\u2728 Generate with AI");
    actions.append(aiBtn);
  }

  return el("article", { class: "card", id: `card-${decoder.id}` },
    el("header", { class: "card-head" },
      el("span", { class: "card-icon", text: decoder.icon }),
      el("div", {},
        el("h3", { class: "card-title", text: decoder.title }),
        el("p", { class: "card-tagline", text: decoder.tagline }),
      ),
    ),
    body,
    actions,
    promptBox,
    aiOut,
  );
}

function flash(btn, msg) {
  const original = btn.textContent;
  btn.textContent = msg;
  btn.classList.add("flash");
  setTimeout(() => { btn.textContent = original; btn.classList.remove("flash"); }, 1200);
}

function renderResults(profile) {
  renderSummary(profile);
  const grid = $("#cards");
  grid.replaceChildren(...DECODERS.map((d) => decoderCard(d, profile)));

  const copyAll = $("#copy-all");
  copyAll.onclick = async (e) => {
    const all = DECODERS.map((d) => `## ${d.title}\n${fillPrompt(d.prompt, profile.dobReadable)}`).join("\n\n");
    try { await navigator.clipboard.writeText(all); flash(e.target, "All 9 copied!"); }
    catch { flash(e.target, "Copy failed"); }
  };

  $("#results").classList.remove("hidden");
  $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- form ----------

function onSubmit(e) {
  e.preventDefault();
  const name = $("#name").value;
  const dobStr = $("#dob").value;
  if (!dobStr) { $("#dob").focus(); return; }
  const [y, m, d] = dobStr.split("-").map(Number);
  if (!y || !m || !d) return;

  localStorage.setItem("asd.last", JSON.stringify({ name, dob: dobStr }));
  const profile = buildProfile(name, y, m, d);
  renderResults(profile);
}

function restoreLast() {
  try {
    const last = JSON.parse(localStorage.getItem("asd.last") || "{}");
    if (last.name) $("#name").value = last.name;
    if (last.dob) $("#dob").value = last.dob;
  } catch { /* ignore */ }
}

// ---------- AI settings dialog ----------

function setupAiDialog() {
  const dlg = $("#ai-dialog");
  const provider = $("#ai-provider");
  const base = $("#ai-base");
  const model = $("#ai-model");
  const key = $("#ai-key");
  const status = $("#ai-status");

  Object.entries(ai.PROVIDERS).forEach(([id, p]) =>
    provider.append(el("option", { value: id, text: p.label })));

  function applyProvider(id) {
    const p = ai.PROVIDERS[id];
    if (!p) return;
    if (id !== "custom") { base.value = p.baseUrl; model.value = p.model; }
  }

  function load() {
    const s = ai.loadSettings();
    provider.value = s.provider || "openai";
    applyProvider(provider.value);
    if (s.baseUrl) base.value = s.baseUrl;
    if (s.model) model.value = s.model;
    key.value = s.apiKey || "";
    reflectStatus();
  }

  function reflectStatus() {
    const on = ai.hasKey();
    $("#ai-toggle-label").textContent = on ? "Live AI: ON" : "Live AI: off";
    $("#ai-toggle").classList.toggle("on", on);
  }

  provider.addEventListener("change", () => applyProvider(provider.value));

  $("#ai-save").addEventListener("click", () => {
    ai.saveSettings({
      provider: provider.value,
      baseUrl: base.value.trim(),
      model: model.value.trim(),
      apiKey: key.value.trim(),
    });
    status.textContent = "Saved. Live AI buttons will appear on your next reveal.";
    reflectStatus();
  });

  $("#ai-clear").addEventListener("click", () => {
    ai.clearSettings();
    key.value = "";
    status.textContent = "Cleared. Key removed from this browser.";
    reflectStatus();
  });

  $("#ai-test").addEventListener("click", async () => {
    ai.saveSettings({ provider: provider.value, baseUrl: base.value.trim(), model: model.value.trim(), apiKey: key.value.trim() });
    status.textContent = "Testing\u2026";
    try {
      const txt = await ai.generateReading("Reply with exactly: connection ok");
      status.textContent = `Provider responded \u2713 (${txt.slice(0, 40)})`;
    } catch (err) {
      status.textContent = `\u26A0 ${err.message}`;
    }
    reflectStatus();
  });

  $("#ai-toggle").addEventListener("click", () => dlg.showModal());
  $("#ai-close").addEventListener("click", () => dlg.close());
  load();
}

// ---------- init ----------

document.addEventListener("DOMContentLoaded", () => {
  $("#dob-form").addEventListener("submit", onSubmit);
  $("#example-btn").addEventListener("click", () => {
    $("#name").value = "Alex";
    $("#dob").value = "1990-07-15";
    $("#dob-form").requestSubmit();
  });
  $("#dob").max = new Date().toISOString().slice(0, 10);
  restoreLast();
  setupAiDialog();
  $("#year").textContent = new Date().getFullYear();
});
