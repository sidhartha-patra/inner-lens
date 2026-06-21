// main.js — Inner Lens controller: birth form, chart computation, tabbed UI, AI.
import "./styles.css";

import { computeNatal } from "./engine/astro.js";
import { computeVedic } from "./engine/vedic.js";
import { computeTransits } from "./engine/transits.js";
import { computeSynastry } from "./engine/synastry.js";
import {
  lifePathNumber, birthdayNumber, attitudeNumber, personalYearNumber,
  pinnacles, challenges, expressionNumber, soulUrgeNumber, maturityNumber,
} from "./engine/numerology.js";
import { sunSign, signInfo, chineseZodiac, dayOfWeek } from "./engine/zodiac.js";
import { DECODERS, fillPrompt } from "./engine/prompts.js";
import { buildDecoder, buildSummary as buildNumSummary } from "./engine/decoders.js";
import {
  composeNatalReading, composeVedicReading, composeTransitReading, fmtDate, PLANETS,
} from "./engine/interpretations.js";
import { searchPlaces, debounce } from "./services/geocode.js";
import { renderWheel } from "./ui/wheel.js";
import * as ai from "./services/ai.js";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const $ = (s, r = document) => r.querySelector(s);

function el(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k === "text") n.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
    else if (v != null) n.setAttribute(k, v);
  }
  kids.flat().forEach((c) => c != null && n.append(c && c.nodeType ? c : document.createTextNode(String(c))));
  return n;
}
function renderInline(text, parent) {
  String(text).split(/\*\*(.+?)\*\*/g).forEach((part, i) => {
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
      b.list.forEach((it) => { const li = el("li"); renderInline(it, li); ul.append(li); });
      container.append(ul);
    }
  });
}
function flash(btn, msg) {
  const o = btn.textContent; btn.textContent = msg; btn.classList.add("flash");
  setTimeout(() => { btn.textContent = o; btn.classList.remove("flash"); }, 1200);
}
function chip(label, value) {
  if (value == null) return null;
  return el("span", { class: "chip" }, el("span", { class: "chip-label", text: label }), el("span", { class: "chip-value", text: String(value) }));
}

const state = { person: null, western: null, vedic: null, transits: null, numerology: null, partner: null, synastry: null, tab: "overview" };

// ---------- numerology profile ----------
function computeNumerology(name, y, m, d) {
  const cur = new Date().getFullYear();
  const lp = lifePathNumber(y, m, d);
  const sign = sunSign(m, d);
  const expr = expressionNumber(name);
  let age = cur - y;
  const had = (new Date().getMonth() + 1) > m || ((new Date().getMonth() + 1) === m && new Date().getDate() >= d);
  if (!had) age -= 1;
  return {
    name: (name || "").trim(), year: y, month: m, day: d,
    dobReadable: `${d} ${MONTHS[m - 1]} ${y}`, currentYear: cur, age, bornOn: dayOfWeek(y, m, d),
    lifePath: lp, birthday: birthdayNumber(d), attitude: attitudeNumber(m, d),
    personalYear: personalYearNumber(m, d, cur), pinnacles: pinnacles(y, m, d, lp), challenges: challenges(y, m, d),
    sign, signInfo: signInfo(sign), element: signInfo(sign).element, modality: signInfo(sign).modality,
    chinese: chineseZodiac(y), expression: expr, soulUrge: soulUrgeNumber(name), maturity: maturityNumber(lp, expr),
  };
}

// ---------- AI button ----------
function aiButton(kind, ctx, label = "✨ Generate with AI") {
  const out = el("div", { class: "ai-output hidden" });
  const btn = el("button", { class: "btn btn-ai", type: "button",
    onclick: async () => {
      if (!ai.isReady()) { $("#ai-dialog").showModal(); return; }
      btn.disabled = true; const prev = btn.textContent; btn.textContent = "Thinking…";
      out.classList.remove("hidden"); out.replaceChildren(el("p", { class: "block-note", text: "Generating a grounded reading…" }));
      try {
        const prompt = ctx.prompt || ai.buildGroundedPrompt(kind, ctx);
        const text = await ai.generateReading(prompt);
        out.replaceChildren(el("p", { class: "ai-badge", text: "✨ Live AI reading" }));
        text.split(/\n{2,}/).forEach((para) => {
          const t = para.trim(); if (!t) return;
          if (/^[-*]\s/.test(t)) {
            const ul = el("ul", { class: "block-list" });
            t.split(/\n/).forEach((ln) => { const li = el("li"); renderInline(ln.replace(/^[-*]\s/, ""), li); ul.append(li); });
            out.append(ul);
          } else { const p = el("p", { class: "block-p" }); renderInline(t, p); out.append(p); }
        });
      } catch (e) { out.replaceChildren(el("p", { class: "block-error", text: `⚠ ${e.message}` })); }
      finally { btn.disabled = false; btn.textContent = prev; }
    } }, label);
  return el("div", {}, el("div", { class: "card-actions" }, btn), out);
}

// ---------- summary ----------
function renderSummary() {
  const w = state.western, num = state.numerology, v = state.vedic;
  const wrap = $("#summary"); wrap.replaceChildren();
  const sun = w.planets.find((p) => p.key === "sun");
  const moon = w.planets.find((p) => p.key === "moon");
  const hello = state.person.name ? `${state.person.name} —` : "Your chart —";
  wrap.append(
    el("div", { class: "summary-top" },
      el("span", { class: "summary-sign", text: w.ascendant.signGlyph }),
      el("div", {},
        el("p", { class: "summary-hello", text: hello }),
        el("h2", { class: "summary-archetype", text: `${sun.sign} Sun · ${moon.sign} Moon · ${w.ascendant.sign} Rising` }),
        el("p", { class: "summary-line", text: `Vedic: ${v.planets.find(p=>p.key==="moon").rasi} Moon · ${v.moonNakshatra.name} nakshatra · ${v.dasha.currentMaha.planet} Dasha` }),
      ),
    ),
    el("div", { class: "chips" },
      chip("Sun", `${sun.sign} ${sun.signGlyph}`), chip("Moon", `${moon.sign} ${moon.signGlyph}`),
      chip("Rising", `${w.ascendant.sign} ${w.ascendant.signGlyph}`),
      chip("Life Path", num.lifePath), chip("Personal Year", num.personalYear),
      chip("Nakshatra", v.moonNakshatra.name), chip("Dasha", v.dasha.currentMaha.planet),
      chip("Chinese", num.chinese),
      state.person.timeKnown ? null : chip("⚠ time", "unknown"),
    ),
  );
}

// ---------- tabs ----------
function setTab(name) {
  state.tab = name;
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  const host = $("#tab-content"); host.replaceChildren();
  ({ overview: renderOverview, western: renderWestern, vedic: renderVedic, transits: renderTransits, numerology: renderNumerology, compatibility: renderCompatibility }[name] || renderOverview)(host);
}

function card(title, ...children) {
  return el("article", { class: "card" }, title ? el("h3", { class: "card-title", text: title }) : null, ...children);
}

function renderOverview(host) {
  const w = state.western;
  const wheel = el("div", { id: "wheel-overview", class: "wheel" });
  const left = card("Your chart wheel", wheel);
  const reading = el("div", {}); renderBlocks(reading, composeNatalReading(w).blocks);
  const right = card(null, reading, aiButton("synthesis", { western: state.western, vedic: state.vedic }, "✨ AI: full Western+Vedic portrait"));
  host.append(el("div", { class: "two-col" }, left, right));
  renderWheel("wheel-overview", w, 440);
}

function planetTable(points, vedic = false) {
  const t = el("table", { class: "ptable" });
  t.append(el("thead", {}, el("tr", {}, el("th", { text: "" }), el("th", { text: "Planet" }), el("th", { text: vedic ? "Rasi" : "Sign" }), el("th", { text: "Deg" }), el("th", { text: vedic ? "Nakshatra" : "House" }))));
  const tb = el("tbody");
  points.forEach((p) => {
    tb.append(el("tr", {},
      el("td", { class: "p-glyph", text: p.glyph }),
      el("td", { text: p.label + (p.retro ? " ℞" : "") }),
      el("td", { text: `${vedic ? p.rasi : p.sign} ${p.signGlyph || ""}` }),
      el("td", { text: p.dms }),
      el("td", { text: vedic ? `${p.nakshatra} (${p.pada})` : (p.house ? `House ${p.house}` : "—") }),
    ));
  });
  t.append(tb);
  return t;
}

function renderWestern(host) {
  const w = state.western;
  const wheel = el("div", { id: "wheel-western", class: "wheel" });
  host.append(el("div", { class: "two-col" },
    card("Natal wheel (tropical · Placidus)", wheel),
    card("Planets", planetTable(w.planets)),
  ));
  if (!state.person.timeKnown) host.append(el("p", { class: "block-note", text: "⚠ Birth time unknown — Ascendant, Midheaven and houses are approximate (set to noon)." }));
  const reading = el("div", {}); renderBlocks(reading, composeNatalReading(w).blocks);
  host.append(card("Your natal reading", reading, aiButton("western", { western: w })));
  renderWheel("wheel-western", w, 440);
}

function renderVedic(host) {
  const v = state.vedic;
  host.append(card("Vedic planets (sidereal · Lahiri · whole-sign)", planetTable(v.planets, true)));

  // Dasha timeline
  const tl = el("div", { class: "dasha-timeline" });
  v.dasha.periods.forEach((p) => {
    const active = p === v.dasha.currentMaha;
    tl.append(el("div", { class: "dasha-row" + (active ? " active" : "") },
      el("span", { class: "dasha-planet", text: p.planet }),
      el("span", { class: "dasha-dates", text: `${fmtDate(p.start)} → ${fmtDate(p.end)}` }),
      active ? el("span", { class: "dasha-now", text: "now" }) : null,
    ));
  });
  host.append(card("Vimshottari Dasha timeline", tl));

  const reading = el("div", {}); renderBlocks(reading, composeVedicReading(v).blocks);
  host.append(card("Your Vedic reading", reading, aiButton("vedic", { vedic: v })));
}

function renderTransits(host) {
  const t = state.transits;
  const reading = el("div", {}); renderBlocks(reading, composeTransitReading(t).blocks);
  host.append(card(`Transits for ${new Date(t.date).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`, reading,
    aiButton("transits", { western: state.western, transits: t })));

  const list = el("div", { class: "transit-list" });
  t.planets.forEach((p) => list.append(el("div", { class: "transit-pill" }, el("span", { text: `${p.glyph} ${p.label}` }), el("span", { class: "muted", text: `${p.sign} ${p.signGlyph} · natal house ${p.natalHouse}` }))));
  host.append(card("Where the planets are now", list));
}

function renderNumerology(host) {
  const num = state.numerology;
  const sum = buildNumSummary(num);
  host.append(card(`${sum.archetype} — your numerology`, el("p", { class: "block-p", text: sum.blurb }),
    el("div", { class: "chips" },
      chip("Life Path", num.lifePath), chip("Birthday", num.birthday), chip("Personal Year", num.personalYear),
      chip("Expression", num.expression || "—"), chip("Soul Urge", num.soulUrge || "—"), chip("Maturity", num.maturity || "—"),
    )));

  const grid = el("div", { class: "cards-grid" });
  DECODERS.forEach((d) => {
    const reading = buildDecoder(d.id, num);
    const filled = fillPrompt(d.prompt, num.dobReadable);
    const body = el("div", {}); renderBlocks(body, reading.blocks);
    const promptBox = el("pre", { class: "prompt-box hidden", text: filled });
    const copyBtn = el("button", { class: "btn btn-ghost", type: "button", onclick: async (e) => { try { await navigator.clipboard.writeText(filled); flash(e.target, "Copied!"); } catch { flash(e.target, "Copy failed"); } } }, "Copy prompt");
    const showBtn = el("button", { class: "btn btn-ghost", type: "button" }, "Show prompt");
    showBtn.addEventListener("click", () => { promptBox.classList.toggle("hidden"); showBtn.textContent = promptBox.classList.contains("hidden") ? "Show prompt" : "Hide prompt"; });
    const ab = aiButton(null, { prompt: filled });
    grid.append(el("article", { class: "card" },
      el("header", { class: "card-head" }, el("span", { class: "card-icon", text: d.icon }),
        el("div", {}, el("h3", { class: "card-title", text: d.title }), el("p", { class: "card-tagline", text: d.tagline }))),
      body, el("div", { class: "card-actions" }, copyBtn, showBtn), promptBox, ab));
  });
  host.append(grid);
}

function renderCompatibility(host) {
  host.append(el("p", { class: "block-p", text: "Enter a second person's birth details to see your synastry — how your charts interact." }));
  const f = el("form", { class: "birth-form compact" });
  const pName = el("input", { type: "text", placeholder: "Their name (optional)", maxlength: "40" });
  const pDate = el("input", { type: "date", required: "true" });
  const pTime = el("input", { type: "time", value: "12:00" });
  const pPlace = el("input", { type: "text", placeholder: "Search a city…" });
  const pResults = el("ul", { class: "place-results hidden" });
  const pChosen = el("p", { class: "place-chosen" });
  let pCoords = null;
  const onSearch = debounce(async () => {
    const r = await searchPlaces(pPlace.value);
    pResults.replaceChildren(); if (!r.length) { pResults.classList.add("hidden"); return; }
    r.forEach((pl) => pResults.append(el("li", { onclick: () => { pCoords = pl; pChosen.textContent = `📍 ${pl.label} (${pl.lat.toFixed(2)}, ${pl.lon.toFixed(2)})`; pPlace.value = pl.label; pResults.classList.add("hidden"); } }, pl.label)));
    pResults.classList.remove("hidden");
  }, 300);
  pPlace.addEventListener("input", onSearch);
  const out = el("div", {});
  const go = el("button", { class: "btn btn-primary", type: "submit" }, "Check compatibility");
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!pDate.value) return;
    if (!pCoords) { pChosen.textContent = "Please pick a birth city first."; return; }
    const [y, m, d] = pDate.value.split("-").map(Number);
    const [hh, mm] = (pTime.value || "12:00").split(":").map(Number);
    const partner = computeNatal({ name: pName.value, year: y, month: m, day: d, hour: hh, minute: mm, lat: pCoords.lat, lon: pCoords.lon, place: pCoords.label });
    const syn = computeSynastry(state.western, partner);
    state.partner = partner; state.synastry = syn;
    out.replaceChildren(renderSynastry(syn, partner));
  });
  f.append(
    el("div", { class: "grid2" }, el("div", { class: "field" }, el("label", { text: "Their name" }), pName), el("div", { class: "field" }, el("label", { text: "Date of birth" }), pDate)),
    el("div", { class: "grid2" }, el("div", { class: "field" }, el("label", { text: "Time of birth" }), pTime), el("div", { class: "field place-field" }, el("label", { text: "Birth place" }), pPlace, pResults, pChosen)),
    el("div", { class: "form-actions" }, go),
  );
  host.append(card(null, f), out);
}

function renderSynastry(syn, partner) {
  const wrap = el("div", {});
  const a = state.person.name || "You";
  const b = partner.meta.name || "Them";
  wrap.append(card(`${a} × ${b}`,
    el("div", { class: "score-wrap" },
      el("div", { class: "score-num", text: `${syn.score}` }),
      el("div", {}, el("p", { class: "block-p", text: `Compatibility score (0–100). ${syn.harmonious} harmonious and ${syn.challenging} challenging inter-aspects out of ${syn.total}.` })),
    ),
    el("h4", { class: "block-h", text: "Strongest connections" }),
    el("ul", { class: "block-list" }, syn.aspects.slice(0, 8).map((x) =>
      el("li", { text: `${PLANETS[x.a]?.label || x.a} ${x.glyph} ${PLANETS[x.b]?.label || x.b} — ${x.type}${x.harmony > 0 ? " (flowing)" : x.harmony < 0 ? " (tension)" : ""}, orb ${x.orb}°` }))),
    aiButton(null, { prompt: synastryPrompt(syn, a, b) }),
  ));
  return wrap;
}
function synastryPrompt(syn, a, b) {
  const top = syn.aspects.slice(0, 10).map((x) => `${x.a} ${x.type} ${x.b} (orb ${x.orb}°)`).join("; ");
  return `Synastry between ${a} and ${b}. Score ${syn.score}/100, ${syn.harmonious} harmonious vs ${syn.challenging} challenging aspects. Key inter-aspects: ${top}. Give an honest, grounded compatibility reading: the relationship's natural strengths, its friction points, and advice. Reference the specific aspects.`;
}

// ---------- form ----------
function setupForm() {
  const placeInput = $("#place"); const placeResults = $("#place-results"); const placeChosen = $("#place-chosen");
  let chosen = null;
  const onSearch = debounce(async () => {
    const r = await searchPlaces(placeInput.value);
    placeResults.replaceChildren();
    if (!r.length) { placeResults.classList.add("hidden"); return; }
    r.forEach((pl) => placeResults.append(el("li", { onclick: () => {
      chosen = pl; placeChosen.textContent = `📍 ${pl.label} (${pl.lat.toFixed(3)}, ${pl.lon.toFixed(3)})`;
      placeInput.value = pl.label; placeResults.classList.add("hidden");
      $("#lat").value = pl.lat.toFixed(4); $("#lon").value = pl.lon.toFixed(4);
    } }, pl.label)));
    placeResults.classList.remove("hidden");
  }, 300);
  placeInput.addEventListener("input", onSearch);
  document.addEventListener("click", (e) => { if (!placeResults.contains(e.target) && e.target !== placeInput) placeResults.classList.add("hidden"); });

  $("#manual-toggle").addEventListener("click", () => $("#manual-coords").classList.toggle("hidden"));
  $("#time-unknown").addEventListener("change", (e) => { $("#time").disabled = e.target.checked; if (e.target.checked) $("#time").value = "12:00"; });

  $("#example-btn").addEventListener("click", () => {
    $("#name").value = "Alex"; $("#date").value = "1990-07-15"; $("#time").value = "14:30";
    placeInput.value = "London, England, United Kingdom"; placeChosen.textContent = "📍 London (51.508, -0.126)";
    $("#lat").value = "51.5074"; $("#lon").value = "-0.1278"; chosen = { lat: 51.5074, lon: -0.1278, label: "London, UK" };
    $("#birth-form").requestSubmit();
  });

  $("#birth-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = $("#date").value; if (!date) { $("#date").focus(); return; }
    const lat = parseFloat($("#lat").value); const lon = parseFloat($("#lon").value);
    if (Number.isNaN(lat) || Number.isNaN(lon)) { placeChosen.textContent = "Please pick a birth city (or enter coordinates)."; return; }
    const [y, m, d] = date.split("-").map(Number);
    const timeKnown = !$("#time-unknown").checked && Boolean($("#time").value);
    const [hh, mm] = (timeKnown ? $("#time").value : "12:00").split(":").map(Number);
    const name = $("#name").value;

    state.person = { name, year: y, month: m, day: d, hour: hh, minute: mm, lat, lon, place: chosen?.label || "", timeKnown };
    compute();
  });
}

function compute() {
  const p = state.person;
  state.western = computeNatal({ name: p.name, year: p.year, month: p.month, day: p.day, hour: p.hour, minute: p.minute, lat: p.lat, lon: p.lon, place: p.place });
  state.vedic = computeVedic(state.western);
  state.transits = computeTransits(state.western);
  state.numerology = computeNumerology(p.name, p.year, p.month, p.day);
  localStorage.setItem("il.last", JSON.stringify(p));
  renderSummary();
  setTab("overview");
  $("#results").classList.remove("hidden");
  $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- AI dialog ----------
function setupAiDialog() {
  const dlg = $("#ai-dialog"); const provider = $("#ai-provider");
  const base = $("#ai-base"); const model = $("#ai-model"); const key = $("#ai-key"); const status = $("#ai-status");
  Object.entries(ai.PROVIDERS).forEach(([id, p]) => provider.append(el("option", { value: id, text: p.label })));

  const applyProvider = (id) => {
    const p = ai.PROVIDERS[id]; if (!p) return;
    if (id !== "custom") { base.value = p.baseUrl; model.value = p.model; }
    const needs = ai.providerNeedsKey(id);
    key.disabled = !needs; $("#ai-key-label").textContent = needs ? "API key" : "API key (not needed)";
  };
  const reflect = () => { const on = ai.isReady(); $("#ai-toggle-label").textContent = on ? "Live AI: ON" : "Live AI: off"; $("#ai-toggle").classList.toggle("on", on); };

  const load = () => {
    const s = ai.loadSettings();
    provider.value = s.provider || "copilot-local"; applyProvider(provider.value);
    if (s.baseUrl) base.value = s.baseUrl; if (s.model) model.value = s.model; key.value = s.apiKey || "";
    reflect();
  };
  provider.addEventListener("change", () => applyProvider(provider.value));
  $("#ai-save").addEventListener("click", () => { ai.saveSettings({ provider: provider.value, baseUrl: base.value.trim(), model: model.value.trim(), apiKey: key.value.trim() }); status.textContent = "Saved."; reflect(); });
  $("#ai-clear").addEventListener("click", () => { ai.clearSettings(); key.value = ""; status.textContent = "Cleared."; reflect(); });
  $("#ai-test").addEventListener("click", async () => {
    ai.saveSettings({ provider: provider.value, baseUrl: base.value.trim(), model: model.value.trim(), apiKey: key.value.trim() });
    status.textContent = "Testing…";
    try { const t = await ai.generateReading("Reply with exactly: connection ok"); status.textContent = `Provider responded ✓ (${t.slice(0, 40)})`; }
    catch (e) { status.textContent = `⚠ ${e.message}`; } reflect();
  });
  $("#ai-toggle").addEventListener("click", () => dlg.showModal());
  $("#ai-close").addEventListener("click", () => dlg.close());
  load();
}

// ---------- init ----------
document.addEventListener("DOMContentLoaded", () => {
  setupForm(); setupAiDialog();
  document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => setTab(t.dataset.tab)));
  $("#date").max = new Date().toISOString().slice(0, 10);
  $("#year").textContent = new Date().getFullYear();
  try { const last = JSON.parse(localStorage.getItem("il.last") || "{}"); if (last.name) $("#name").value = last.name; } catch {}
});

// PWA: register the service worker for offline + installability.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}
