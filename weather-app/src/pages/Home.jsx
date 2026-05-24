import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const API_KEY = "596e8629dc6604ff3ad22867e61e0667"; // Replace with real key

// ─── Mini bar chart (no external lib needed) ───────────────────────────
function TempChart({ data }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map((d) => d.temp));
  const min = Math.min(...data.map((d) => d.temp));
  const norm = (v) => ((v - min) / (max - min || 1)) * 80 + 10;

  return (
    <svg viewBox={`0 0 ${data.length * 60} 120`} width="100%" style={{ overflow: "visible" }}>
      {data.map((d, i) => {
        const x = i * 60 + 30;
        const y = 110 - norm(d.temp);
        const prevY = i > 0 ? 110 - norm(data[i - 1].temp) : y;
        const prevX = (i - 1) * 60 + 30;
        return (
          <g key={i}>
            {i > 0 && (
              <line x1={prevX} y1={prevY} x2={x} y2={y}
                stroke="#6c7fff" strokeWidth="2" strokeLinecap="round" />
            )}
            <circle cx={x} cy={y} r="4" fill="#6c7fff" />
            <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fill="#a0aaff">{d.temp}°</text>
            <text x={x} y="118" textAnchor="middle" fontSize="10" fill="#5a6080">{d.hour}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Forecast card ─────────────────────────────────────────────────────
function ForecastCard({ day, icon, high, low, desc }) {
  return (
    <div style={{
      background: "#1a1d2e", borderRadius: 14, padding: "16px 14px",
      textAlign: "center", border: "1px solid #1e2235", flex: "1 1 120px",
      minWidth: 100,
    }}>
      <div style={{ fontSize: 12, color: "#5a6080", marginBottom: 6 }}>{day}</div>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#8892b0", marginBottom: 8 }}>{desc}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#ff9f43" }}>{high}°</span>
        <span style={{ fontSize: 14, color: "#5a6080" }}>{low}°</span>
      </div>
    </div>
  );
}

// ─── AI suggestion card ────────────────────────────────────────────────
function AICard({ weather }) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const getAISuggestion = async () => {
    if (!weather) return;
    setLoading(true);
    setSuggestion("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Current weather in ${weather.city}: ${weather.temp}°C, ${weather.description}, humidity ${weather.humidity}%, wind ${weather.wind} km/h.
Give a warm, helpful 3-sentence daily tip: what to wear, activities to do, and a health/safety note. Be friendly and specific to this weather. No bullet points.`,
          }],
        }),
      });
      const data = await res.json();
      setSuggestion(data.content?.[0]?.text || "Couldn't get suggestion.");
    } catch {
      setSuggestion("AI suggestion unavailable right now.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1d2e 0%, #141728 100%)",
      borderRadius: 16, padding: 20,
      border: "1px solid rgba(108,127,255,0.2)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: "rgba(108,127,255,0.06)",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#a0aaff" }}>AI Weather Tip</span>
        </div>
        <button
          onClick={getAISuggestion}
          disabled={loading || !weather}
          style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: "rgba(108,127,255,0.15)", color: "#a0aaff",
            border: "1px solid rgba(108,127,255,0.3)",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Thinking..." : "✨ Get Tip"}
        </button>
      </div>
      {suggestion ? (
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#c5c9e0", margin: 0 }}>{suggestion}</p>
      ) : (
        <p style={{ fontSize: 13, color: "#5a6080", margin: 0, fontStyle: "italic" }}>
          Click "Get Tip" for an AI-powered daily weather recommendation ✨
        </p>
      )}
    </div>
  );
}

// ─── Main Home component ───────────────────────────────────────────────
export default function Home() {
  const [city, setCity] = useState("Colombo");
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  // Fetch weather by city name
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");
    try {
      // Current weather
      const wRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      if (!wRes.ok) {

  const errorData =
    await wRes.json();

  throw new Error(
    errorData.message ||
    "Unable to fetch weather data"
  );
}
      const wData = await wRes.json();

      setWeather({
        city: wData.name,
        country: wData.sys.country,
        temp: Math.round(wData.main.temp),
        feels: Math.round(wData.main.feels_like),
        humidity: wData.main.humidity,
        wind: Math.round(wData.wind.speed * 3.6),
        description: wData.weather[0].description,
        icon: getWeatherIcon(wData.weather[0].main),
        visibility: (wData.visibility / 1000).toFixed(1),
        pressure: wData.main.pressure,
        lat: wData.coord.lat,
        lon: wData.coord.lon,
      });

      // 5-day forecast
      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      const fData = await fRes.json();

      // Group by day
      const days = {};
      fData.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("en", { weekday: "short" });
        if (!days[day]) {
          days[day] = { temps: [], icons: [], desc: item.weather[0].description };
        }
        days[day].temps.push(item.main.temp);
        days[day].icons.push(item.weather[0].main);
      });

      const forecastList = Object.entries(days).slice(0, 5).map(([day, d]) => ({
        day,
        high: Math.round(Math.max(...d.temps)),
        low: Math.round(Math.min(...d.temps)),
        icon: getWeatherIcon(d.icons[0]),
        desc: d.desc,
      }));
      setForecast(forecastList);

      // Hourly (next 8 x 3hr = 24hr)
      const hourlyData = fData.list.slice(0, 8).map((item) => ({
        hour: new Date(item.dt * 1000).toLocaleTimeString("en", { hour: "2-digit", hour12: true }),
        temp: Math.round(item.main.temp),
      }));
      setHourly(hourlyData);
    } catch (e) {
      setError(e.message || "Failed to fetch weather");
    }
    setLoading(false);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();
          setCity(data.name);
          fetchWeather(data.name);
        } catch {
          setError("Location fetch failed");
        }
        setLocLoading(false);
      },
      () => { setError("Location denied"); setLocLoading(false); }
    );
  };

  useEffect(() => { fetchWeather(city); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      fetchWeather(searchInput.trim());
      setSearchInput("");
    }
  };

  const getWeatherIcon = (main) => {
    const icons = {
      Clear: "☀️", Clouds: "☁️", Rain: "🌧️",
      Drizzle: "🌦️", Thunderstorm: "⛈️", Snow: "❄️",
      Mist: "🌫️", Fog: "🌫️", Haze: "🌫️",
    };
    return icons[main] || "🌡️";
  };

  const getBgColor = () => {
    if (!weather) return "#0f1117";
    const t = weather.temp;
    if (t >= 35) return "#1f120a";
    if (t >= 25) return "#121a0f";
    if (t >= 15) return "#0d1420";
    return "#0d1525";
  };

  return (
    <Layout>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#e8eaf6" }}>
            🌤️ Weather Dashboard
          </h1>
          <p style={{ color: "#5a6080", margin: "4px 0 0", fontSize: 14 }}>
            {new Date().toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city..."
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 12,
              background: "#1a1d2e", border: "1px solid #1e2235",
              color: "#e8eaf6", fontSize: 14, outline: "none",
            }}
          />
          <button type="submit" style={{
            padding: "12px 20px", borderRadius: 12, cursor: "pointer",
            background: "#6c7fff", color: "#fff", border: "none",
            fontSize: 14, fontWeight: 600,
          }}>
            🔍 Search
          </button>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locLoading}
            style={{
              padding: "12px 16px", borderRadius: 12, cursor: "pointer",
              background: "#1a1d2e", color: "#a0aaff",
              border: "1px solid #1e2235", fontSize: 14,
              opacity: locLoading ? 0.6 : 1,
            }}
          >
            {locLoading ? "..." : "📍"}
          </button>
        </form>

        {error && (
          <div style={{
            background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)",
            borderRadius: 10, padding: "10px 16px", color: "#ff6b6b",
            marginBottom: 20, fontSize: 13,
          }}>
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#5a6080" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⛅</div>
            <div>Loading weather...</div>
          </div>
        )}

        {!loading && weather && (
          <>
            {/* ── Current weather hero ── */}
            <div style={{
              background: getBgColor(),
              borderRadius: 20, padding: "28px 28px",
              border: "1px solid #1e2235",
              marginBottom: 20,
              display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center",
            }}>
              {/* Main temp */}
              <div style={{ flex: "1 1 200px" }}>
                <div style={{ fontSize: 13, color: "#6c7fff", fontWeight: 600, marginBottom: 4 }}>
                  📍 {weather.city}, {weather.country}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  <span style={{ fontSize: 72, lineHeight: 1 }}>{weather.icon}</span>
                  <div>
                    <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1, color: "#fff" }}>
                      {weather.temp}°
                    </div>
                    <div style={{ fontSize: 14, color: "#8892b0", marginTop: 4, textTransform: "capitalize" }}>
                      {weather.description}
                    </div>
                    <div style={{ fontSize: 13, color: "#5a6080" }}>
                      Feels like {weather.feels}°C
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 12, flex: "1 1 200px",
              }}>
                {[
                  { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
                  { label: "Wind", value: `${weather.wind} km/h`, icon: "💨" },
                  { label: "Visibility", value: `${weather.visibility} km`, icon: "👁️" },
                  { label: "Pressure", value: `${weather.pressure} hPa`, icon: "🌡️" },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{
                    background: "rgba(255,255,255,0.04)", borderRadius: 12,
                    padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 11, color: "#5a6080" }}>{icon} {label}</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "#e8eaf6", marginTop: 2 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── AI Tip card ── */}
            <div style={{ marginBottom: 20 }}>
              <AICard weather={weather} />
            </div>

            {/* ── Hourly chart ── */}
            <div style={{
              background: "#1a1d2e", borderRadius: 16, padding: "20px",
              border: "1px solid #1e2235", marginBottom: 20,
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#8892b0", fontWeight: 500 }}>
                📈 24-Hour Temperature
              </h3>
              <TempChart data={hourly} />
            </div>

            {/* ── 5-day forecast ── */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "#8892b0", fontWeight: 500 }}>
                🗓️ 5-Day Forecast
              </h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {forecast.map((f, i) => (
                  <ForecastCard key={i} {...f} />
                ))}
              </div>
            </div>

            {/* ── Quick links ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              {[
                { label: "🧭 Plan Travel", path: "/travel", desc: "Smart trip planner" },
                { label: "🌦 Full Forecast", path: "/forecast", desc: "Hourly & daily" },
                { label: "🗺 View Maps", path: "/maps", desc: "Weather maps" },
                { label: "🤖 AI Agent", path: "/agent", desc: "Smart recommendations" },
              ].map(({ label, path, desc }) => (
                <a key={path} href={path} style={{
                  display: "block", textDecoration: "none",
                  background: "#1a1d2e", borderRadius: 12, padding: "14px 16px",
                  border: "1px solid #1e2235", transition: "border-color .15s",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#a0aaff" }}>{label}</div>
                  <div style={{ fontSize: 12, color: "#5a6080", marginTop: 2 }}>{desc}</div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}