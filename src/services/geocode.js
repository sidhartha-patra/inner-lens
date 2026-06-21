// geocode.js — birth-place search via Open-Meteo's free geocoding API (no key, CORS-ok).
// Only the typed city name is sent. Latitude/longitude drive timezone + chart math.

export async function searchPlaces(query) {
  const q = (query || "").trim();
  if (q.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r) => ({
      name: r.name,
      admin1: r.admin1 || "",
      country: r.country || "",
      countryCode: r.country_code || "",
      lat: r.latitude,
      lon: r.longitude,
      timezone: r.timezone || "",
      label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
    }));
  } catch {
    return [];
  }
}

export function debounce(fn, ms = 280) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
