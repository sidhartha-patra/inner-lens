// wheel.js — render an SVG natal wheel using @astrodraw/astrochart.

import * as astrochartNS from "@astrodraw/astrochart";

const Chart = astrochartNS.Chart || astrochartNS.default?.Chart || astrochartNS.default;

// Map our planet keys -> astrochart's expected names.
const NAME = {
  sun: "Sun", moon: "Moon", mercury: "Mercury", venus: "Venus", mars: "Mars",
  jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune",
  pluto: "Pluto", northnode: "NNode", southnode: "SNode", chiron: "Chiron", lilith: "Lilith",
};

export function renderWheel(containerId, chart, size = 460) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = "";
  try {
    const planets = {};
    for (const p of chart.planets) {
      if (NAME[p.key]) planets[NAME[p.key]] = [p.lon];
    }
    for (const n of chart.nodes || []) {
      if (NAME[n.key]) planets[NAME[n.key]] = [n.lon];
    }
    const cusps = chart.houses.map((h) => h.cuspLon);

    const data = { planets, cusps };
    const c = new Chart(containerId, size, size);
    const radix = c.radix(data);
    if (radix && typeof radix.aspects === "function") {
      try { radix.aspects(); } catch { /* aspect drawing optional */ }
    }
    return true;
  } catch (err) {
    el.innerHTML = `<p class="block-note">Chart wheel unavailable: ${err.message}</p>`;
    return false;
  }
}
