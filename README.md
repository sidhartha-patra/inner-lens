# 🔮 Inner Lens — AI Self-Discovery from your birth date

A small, dependency-free web app that turns the viral **“9 AI prompts”** self-discovery
trend into an interactive tool. Enter a birth date and Inner Lens reads your
**personality, recurring patterns, strengths, life timing, relationships, career direction,
inner conflicts, purpose and future growth** — blending psychology, numerology logic and
behavioural pattern mapping.

> A mirror, not a fortune teller. For reflection and entertainment — it does not predict the future.

**Live demo:** _enable GitHub Pages on this repo (Settings → Pages → Source: GitHub Actions)._

---

## What it does

The app is built around the nine reflective "decoders" from the trend:

1. **Life Blueprint Decoder** — core traits, hidden strengths, blind spots, long-term purpose
2. **Personality Pattern Revealer** — recurring emotional, behavioural & decision-making patterns
3. **Strength & Weakness Breakdown** — natural advantages vs internal weaknesses
4. **Life Timing Analyzer** — life phases, past turning points & upcoming periods
5. **Relationship Mirror** — attachment tendencies, emotional needs & conflict triggers
6. **Career Alignment Scanner** — where you thrive vs what drains you
7. **Inner Conflict Decoder** — internal contradictions and why you feel torn
8. **Purpose Clarifier** — the single theme your life keeps circling
9. **Future Pattern Forecast** — growth lessons & mindset shifts (not predictions)

## Three ways to read

- **Built-in engine (offline).** Computes a real numerology + zodiac profile (Life Path,
  Personal Year, pinnacles, challenges, sun sign, element, modality, Chinese zodiac) and
  composes each reading. No account, no network, no API key.
- **Copy the prompt.** Every card carries the exact viral prompt pre-filled with your date —
  copy it into Grok, ChatGPT, Claude or Gemini and read it in your own AI tool.
- **Live AI (optional).** Bring your own OpenAI-compatible API key (OpenAI, OpenRouter, Groq, …).
  It's stored **only in your browser** (localStorage) and sent **only** to the provider you choose.

## Privacy

Everything runs client-side. Your birth date and name never leave your browser, and there is
no backend. If you opt into Live AI, your prompt and your key go directly to the AI provider
you configured — and nowhere else.

## Run locally

It's a static site — just serve the folder:

```bash
# Python
python -m http.server 8080
# or Node
npx serve .
```

Then open <http://localhost:8080>.

## Project structure

```
index.html
assets/
  css/styles.css
  js/
    data.js         meaning tables (numbers, signs, elements, personal years)
    numerology.js   life path, pinnacles, challenges, personal year, name numbers
    zodiac.js       sun sign, element, modality, Chinese zodiac
    prompts.js      the nine prompt templates
    decoders.js     composes the nine readings from the profile
    ai.js           optional OpenAI-compatible live client
    app.js          UI wiring & rendering
scripts/sanity.mjs  node smoke test for the engine
.github/workflows/deploy-pages.yml
```

## Tech

Vanilla HTML, CSS and ES modules. **No build step, no dependencies.** Deploys straight to
GitHub Pages via the included Actions workflow.

## Credits & disclaimer

Concept inspired by the viral "9 AI prompts" shared by Dipti Sharma and reporting in
Mint, Moneycontrol and others. This project is an independent, open-source reinterpretation
for self-reflection and entertainment. It is **not** astrology advice, psychological diagnosis,
or prediction of future events.

## License

[MIT](./LICENSE)
