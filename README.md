# 🔮 Inner Lens — Astrology, Vedic & Self-Discovery

A full, dependency-light **astrology web app**. Enter your birth details and Inner Lens
computes a real **Western natal chart**, your **Vedic (Jyotish)** chart with nakshatras and
the **Vimshottari Dasha** timeline, current **transits**, relationship **compatibility**, a
**numerology** self-discovery profile, and optional **grounded AI readings** — including a
local server that runs **Claude Opus 4.8 via the GitHub Copilot CLI**.

> A mirror, not a fortune teller. For reflection and entertainment — it does not predict the future.

**Live demo:** https://sidhartha-patra.github.io/inner-lens/

---

## Features

| Tab | What you get |
| --- | --- |
| **Overview** | Big-three (Sun · Moon · Rising), an interactive SVG chart wheel, and a composed natal reading. |
| **Western** | Accurate planetary positions, Ascendant, Midheaven, Placidus houses and aspects — with **DST-correct** timezones resolved from your birth city. |
| **Vedic** | Sidereal (Lahiri ayanamsa) chart, whole-sign houses, your birth **nakshatra** + pada, and the full **Vimshottari Dasha** (mahadasha + antardasha) timeline. |
| **Transits** | Today's planets measured against your natal chart — the current astrological "weather". |
| **Compatibility** | **Synastry** between two charts: inter-aspects and a 0–100 relational score. |
| **Numerology** | Life Path, Personal Year, pinnacles, challenges, and the nine viral "self-discovery" decoders with copy-paste prompts. |

Every reading can be **grounded by an LLM**: the app feeds your real placements into the model
so the AI reading quotes your actual chart (e.g. *"Sun conjunct Jupiter in the 9th… Pluto on the Ascendant"*).

## Accuracy & method

- **Ephemeris:** [`circular-natal-horoscope-js`](https://www.npmjs.com/package/circular-natal-horoscope-js) — planetary longitudes verified against an independent Meeus solar calculation to **< 0.05°**.
- **Timezones:** resolved from birth latitude/longitude via `tz-lookup` + `moment-timezone`, so historical **DST** is handled correctly (the #1 source of wrong Ascendants in toy apps).
- **Vedic:** sidereal longitudes = tropical − **Lahiri** ayanamsa (computed per-date), driving rasis, 27 nakshatras/padas and the 120-year Vimshottari dasha cycle.

## Live AI readings (optional)

Open **Live AI ⚙** and pick a provider. Keys are stored **only in your browser** (localStorage)
and sent **only** to the provider you choose.

### Option A — Local Opus 4.8 (GitHub Copilot CLI)

Run Claude Opus 4.8 locally through the Copilot CLI — no API key, nothing leaves your machine
except the chart facts you send to the model.

```bash
npm run server     # starts http://localhost:8787  (leave it running)
```

Then in the app: **Live AI → "Copilot Opus 4.8 (local)" → Save**. The server is an
OpenAI-compatible proxy (`/v1/chat/completions`) that shells out to:

```
copilot -p "<prompt>" --model claude-opus-4.8 -s --disable-builtin-mcps \
        --no-custom-instructions --no-ask-user --disable-mcp-server <each configured server>
```

It auto-discovers and disables your `~/.copilot` MCP servers so a request returns in ~10s
of pure model output instead of hanging on MCP startup. Configure the port with
`OPUS_PROXY_PORT`.

> The deployed HTTPS site can still call `http://localhost:8787` — browsers exempt
> `localhost` from mixed-content blocking.

### Option B — Bring your own key

OpenAI, OpenRouter, Groq, or any OpenAI-compatible endpoint.

## Privacy

Chart math runs entirely in your browser. The only network call the core app makes is to a
free geocoding API to turn a **city name** into coordinates — nothing else about you is sent.
Live AI is opt-in. After the first visit the app works **offline** (PWA / service worker).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173  (hot reload)
npm run build      # production build -> dist/
npm run preview    # serve the production build
npm test           # numerology + astrology engine tests
npm run server     # local Opus 4.8 proxy (needs GitHub Copilot CLI)
```

## Project structure

```
index.html                 app shell + birth form
src/
  main.js                  controller: form, computation, tabbed UI, AI
  styles.css               cosmic theme
  engine/
    astro.js               natal chart (wraps circular-natal-horoscope-js)
    vedic.js               Lahiri sidereal, nakshatras, Vimshottari dasha
    transits.js            current transits vs natal
    synastry.js            two-chart compatibility
    aspects.js             angular aspect matching
    interpretations.js     reading composers + content tables
    numerology.js / zodiac.js / data.js / decoders.js / prompts.js
  services/
    geocode.js             city -> lat/lon (Open-Meteo, no key)
    ai.js                  OpenAI-compatible client + grounded prompts
  ui/wheel.js              SVG chart wheel (@astrodraw/astrochart)
server/opus-proxy.mjs      local Opus 4.8 OpenAI-compatible server
public/                    manifest, service worker, icon
scripts/                   sanity.mjs, astro-test.mjs (engine tests)
.github/workflows/         build + deploy to GitHub Pages
```

## Tech

Vanilla JS + **Vite** (no UI framework). Deps: `circular-natal-horoscope-js` (ephemeris +
timezones) and `@astrodraw/astrochart` (wheel). Builds to a static site, auto-deployed to
GitHub Pages via Actions.

## Credits & disclaimer

Astronomy/timezones by circular-natal-horoscope-js; chart wheel by @astrodraw/astrochart.
The numerology decoders are inspired by the viral "9 AI prompts" self-discovery trend.
This is an independent, open-source project **for reflection and entertainment** — not
astrology advice, diagnosis, or prediction.

## License

[MIT](./LICENSE)
