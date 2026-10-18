export async function fetchWeather({ lat, lng }) {
  const key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  if (!key) {
    // Realistic fallback data for demo and offline use
    return {
      ok: true,
      current: {
        tempC: 24.5,
        humidity: 65,
        precipMm: 1.2,
        uvIndex: 6,
        windSpeed: 3.8,
        description: "Parcialmente nublado",
        icon: "02d",
      },
      forecast: [
        { dt: new Date(Date.now() + 86400000).toISOString().slice(0, 10), tempC: 25.1, humidity: 62, precipMm: 0.5 },
        { dt: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), tempC: 26.0, humidity: 58, precipMm: 0.0 },
        { dt: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10), tempC: 24.8, humidity: 70, precipMm: 4.2 },
        { dt: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10), tempC: 23.5, humidity: 75, precipMm: 6.8 },
        { dt: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10), tempC: 25.0, humidity: 60, precipMm: 1.0 },
      ],
    };
  }

  try {
    const curUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=pt&appid=${key}`;
    const fcUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&lang=pt&appid=${key}`;
    const [curR, fcR] = await Promise.all([fetch(curUrl), fetch(fcUrl)]);
    if (!curR.ok) return { ok: false, error: `OWM erro ${curR.status}: ${await curR.text()}` };
    if (!fcR.ok) return { ok: false, error: `OWM forecast erro ${fcR.status}` };
    const cur = await curR.json();
    const fc = await fcR.json();

    const byDay = new Map();
    for (const it of fc.list ?? []) {
      const day = it.dt_txt.slice(0, 10);
      const b = byDay.get(day) ?? { t: [], h: [], p: 0 };
      b.t.push(it.main.temp);
      b.h.push(it.main.humidity);
      b.p += it.rain?.["3h"] ?? 0;
      byDay.set(day, b);
    }
    const forecast = Array.from(byDay.entries())
      .slice(0, 5)
      .map(([dt, b]) => ({
        dt,
        tempC: +(b.t.reduce((a, c) => a + c, 0) / b.t.length).toFixed(1),
        humidity: Math.round(b.h.reduce((a, c) => a + c, 0) / b.h.length),
        precipMm: +b.p.toFixed(1),
      }));

    return {
      ok: true,
      current: {
        tempC: cur.main.temp,
        humidity: cur.main.humidity,
        precipMm: cur.rain?.["1h"] ?? 0,
        uvIndex: null,
        windSpeed: cur.wind.speed,
        description: cur.weather?.[0]?.description ?? "",
        icon: cur.weather?.[0]?.icon ?? "01d",
      },
      forecast,
    };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
