import { useState } from "react";
import Layout from "../components/Layout";

const API_KEY = "596e8629dc6604ff3ad22867e61e0667";

// ─── Risk badge ──────────────────────────────────────────────────────
function RiskBadge({ score }) {
  const level = score >= 8 ? "High" : score >= 5 ? "Medium" : "Low";
  const colors = {
    High: { bg: "rgba(255,80,80,0.12)", color: "#ff6b6b", border: "rgba(255,80,80,0.25)" },
    Medium: { bg: "rgba(255,159,67,0.12)", color: "#ff9f43", border: "rgba(255,159,67,0.25)" },
    Low: { bg: "rgba(46,213,115,0.12)", color: "#2ed573", border: "rgba(46,213,115,0.25)" },
  };
  const c = colors[level];
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {level} Risk
    </span>
  );
}

// ─── Weather snapshot card ───────────────────────────────────────────
function WeatherSnapshot({ title, data, emoji }) {
  if (!data) return null;
  return (
    <div style={{
      background: "#1a1d2e", borderRadius: 14, padding: "16px 18px",
      border: "1px solid #1e2235", flex: "1 1 220px",
    }}>
      <div style={{ fontSize: 12, color: "#5a6080", marginBottom: 10 }}>{emoji} {title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 32 }}>{data.icon}</span>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#e8eaf6" }}>{data.temp}°C</div>
          <div style={{ fontSize: 12, color: "#8892b0", textTransform: "capitalize" }}>{data.description}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        <div style={{ fontSize: 12, color: "#5a6080" }}>💧 {data.humidity}%</div>
        <div style={{ fontSize: 12, color: "#5a6080" }}>💨 {data.wind} km/h</div>
      </div>
    </div>
  );
}

// ─── Packing list display ────────────────────────────────────────────
function PackingList({ items }) {
  const [checked, setChecked] = useState({});
  const toggleCheck = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  if (!items?.length) return null;

  // Group by category
  const groups = {};
  items.forEach((item, i) => {
    const cat = item.category || "General";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ ...item, i });
  });

  return (
    <div>
      {Object.entries(groups).map(([cat, catItems]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#6c7fff", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {cat}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {catItems.map(({ item, i }) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                style={{
                  padding: "6px 12px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                  background: checked[i] ? "rgba(108,127,255,0.2)" : "#252840",
                  color: checked[i] ? "#a0aaff" : "#8892b0",
                  border: checked[i] ? "1px solid rgba(108,127,255,0.3)" : "1px solid #1e2235",
                  textDecoration: checked[i] ? "line-through" : "none",
                  transition: "all .15s",
                }}
              >
                {checked[i] ? "✓ " : ""}{item}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main TravelPlanner ──────────────────────────────────────────────
export default function TravelPlanner() {
  const [form, setForm] = useState({ from: "", to: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchCityWeather = async (city) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error(`Could not find weather for "${city}"`);
    const d = await res.json();
    return {
      city: d.name, country: d.sys.country,
      temp: Math.round(d.main.temp),
      feels: Math.round(d.main.feels_like),
      humidity: d.main.humidity,
      wind: Math.round(d.wind.speed * 3.6),
      description: d.weather[0].description,
      icon: getIcon(d.weather[0].main),
      main: d.weather[0].main,
      rain: d.rain?.["1h"] || 0,
      clouds: d.clouds.all,
    };
  };

  const getIcon = (main) => {
    const m = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️", Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️" };
    return m[main] || "🌡️";
  };

  const calcRisk = (w) => {
    let score = 0;
    if (w.temp > 38 || w.temp < 5) score += 3;
    else if (w.temp > 32 || w.temp < 10) score += 2;
    if (w.wind > 60) score += 3;
    else if (w.wind > 40) score += 2;
    if (["Thunderstorm", "Snow"].includes(w.main)) score += 4;
    else if (["Rain", "Drizzle"].includes(w.main)) score += 2;
    if (w.humidity > 85) score += 1;
    return Math.min(score, 10);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.startDate || !form.endDate) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.startDate > form.endDate) {
      setError("End date must be after start date.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setAiResult(null);

    try {
      const [fromW, toW] = await Promise.all([
        fetchCityWeather(form.from),
        fetchCityWeather(form.to),
      ]);

      const days = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1;
      const fromRisk = calcRisk(fromW);
      const toRisk = calcRisk(toW);

      setResult({ fromW, toW, days, fromRisk, toRisk });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);

    // Trigger AI
    if (!error) getAIRecommendation();
  };

 const getAIRecommendation = async () => {

  if (!result) return;

  setAiLoading(true);

  try {

    const weather =
      result.toW;

    let summary = "";

    let riskLevel = "Low";

    let riskReason = "";

    let warnings = [];

    let travelTips = [];

    let packingList = [];

    // WEATHER ANALYSIS

    if (
      weather.main === "Rain"
    ) {

      summary =
        `Rainy conditions are expected in ${weather.city}. Roads may become slippery and outdoor activities could be affected.`;

      riskLevel = "Medium";

      riskReason =
        "Rain may affect travel comfort and visibility.";

      warnings.push(
        "Carry an umbrella."
      );

      warnings.push(
        "Expect wet road conditions."
      );

      travelTips.push(
        "Wear waterproof footwear."
      );

      travelTips.push(
        "Keep electronic devices protected."
      );

      packingList.push(
        { item: "Umbrella", category: "Gear" },
        { item: "Raincoat", category: "Clothing" },
        { item: "Waterproof bag", category: "Gear" }
      );
    }

    else if (
      weather.main === "Clear"
    ) {

      summary =
        `${weather.city} currently has clear skies and pleasant weather. Conditions are ideal for sightseeing and outdoor travel.`;

      riskReason =
        "Weather conditions are stable.";

      travelTips.push(
        "Perfect time for outdoor photography."
      );

      travelTips.push(
        "Use sunscreen during daytime."
      );

      packingList.push(
        { item: "Sunglasses", category: "Clothing" },
        { item: "Cap", category: "Clothing" },
        { item: "Sunscreen", category: "Health" }
      );
    }

    else if (
      weather.main === "Thunderstorm"
    ) {

      summary =
        `Thunderstorms are expected in ${weather.city}. Outdoor travel may become risky during heavy weather activity.`;

      riskLevel = "High";

      riskReason =
        "Severe weather conditions detected.";

      warnings.push(
        "Avoid outdoor activities."
      );

      warnings.push(
        "Monitor weather alerts."
      );

      packingList.push(
        { item: "Emergency flashlight", category: "Gear" },
        { item: "Power bank", category: "Electronics" }
      );
    }

    else {

      summary =
        `Current weather in ${weather.city} is ${weather.description}. Travel conditions appear manageable.`;

      travelTips.push(
        "Stay updated with live weather forecasts."
      );
    }

    // TEMPERATURE

    if (weather.temp > 35) {

      warnings.push(
        "High temperatures detected."
      );

      packingList.push(
        { item: "Water bottle", category: "Health" }
      );

      travelTips.push(
        "Stay hydrated throughout the trip."
      );
    }

    if (weather.wind > 40) {

      warnings.push(
        "Strong winds expected."
      );
    }

    // EXTRA ITEMS

    packingList.push(
      { item: "Passport / ID", category: "Documents" },
      { item: "Phone charger", category: "Electronics" },
      { item: "Travel tickets", category: "Documents" },
      { item: "Medicine kit", category: "Health" }
    );

    // SAVE RESULT

    setAiResult({

      summary,

      riskLevel,

      riskReason,

      warnings,

      travelTips,

      bestTimeToTravel:
        "Morning hours are recommended for comfortable travel.",

      packingList
    });

  } catch (e) {

    console.log(e);

    setAiResult({

      summary:
        "AI analysis unavailable.",

      packingList: [],

      travelTips: [],

      warnings: []
    });
  }

  setAiLoading(false);
};
    

  return (
    <Layout>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#e8eaf6" }}>
            🧭 Travel Planner
          </h1>
          <p style={{ color: "#5a6080", margin: "4px 0 0", fontSize: 14 }}>
            AI-powered weather analysis for your journey
          </p>
        </div>

        {/* ── Input form ── */}
        <div style={{ background: "#1a1d2e", borderRadius: 18, padding: "24px", border: "1px solid #1e2235", marginBottom: 24 }}>
          <form onSubmit={handleAnalyze}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#5a6080", marginBottom: 6 }}>
                  📍 Current Location
                </label>
                <input
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  placeholder="e.g. Colombo"
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                    background: "#13151f", border: "1px solid #252840",
                    color: "#e8eaf6", fontSize: 14, outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#5a6080", marginBottom: 6 }}>
                  🎯 Destination
                </label>
                <input
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  placeholder="e.g. Dubai"
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                    background: "#13151f", border: "1px solid #252840",
                    color: "#e8eaf6", fontSize: 14, outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#5a6080", marginBottom: 6 }}>
                  📅 Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  min={today}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                    background: "#13151f", border: "1px solid #252840",
                    color: "#e8eaf6", fontSize: 14, outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#5a6080", marginBottom: 6 }}>
                  📅 End Date
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate || today}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                    background: "#13151f", border: "1px solid #252840",
                    color: "#e8eaf6", fontSize: 14, outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(255,80,80,0.1)", borderRadius: 8, padding: "10px 14px", color: "#ff6b6b", fontSize: 13, marginBottom: 14 }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 28px", borderRadius: 12, cursor: "pointer",
                background: loading ? "#252840" : "linear-gradient(135deg, #6c7fff, #9c6fff)",
                color: "#fff", border: "none", fontSize: 15, fontWeight: 600,
                opacity: loading ? 0.7 : 1, transition: "opacity .15s",
              }}
            >
              {loading ? "⏳ Analyzing..." : "🚀 Analyze My Trip"}
            </button>
          </form>
        </div>

        {/* ── Results ── */}
        {result && (
          <div>
            {/* Weather comparison */}
            <h3 style={{ fontSize: 15, color: "#8892b0", fontWeight: 500, margin: "0 0 14px" }}>
              🌍 Weather Comparison
            </h3>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
              <WeatherSnapshot title={`${result.fromW.city} (Origin)`} data={result.fromW} emoji="🛫" />
              <div style={{ display: "flex", alignItems: "center", fontSize: 24 }}>→</div>
              <WeatherSnapshot title={`${result.toW.city} (Destination)`} data={result.toW} emoji="🛬" />
            </div>

            {/* Trip overview */}
            <div style={{
              background: "#1a1d2e", borderRadius: 16, padding: "20px",
              border: "1px solid #1e2235", marginBottom: 24,
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#5a6080" }}>📅 Trip Duration</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#e8eaf6", marginTop: 4 }}>{result.days} days</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#5a6080" }}>🌡️ Temp Change</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#ff9f43", marginTop: 4 }}>
                    {result.fromW.temp}° → {result.toW.temp}°
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#5a6080", marginBottom: 6 }}>⚠️ Destination Risk</div>
                  <RiskBadge score={result.toRisk} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#5a6080", marginBottom: 6 }}>📍 Origin Risk</div>
                  <RiskBadge score={result.fromRisk} />
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {aiLoading && (
              <div style={{ background: "#1a1d2e", borderRadius: 16, padding: "24px", border: "1px solid rgba(108,127,255,0.2)", marginBottom: 24, textAlign: "center", color: "#5a6080" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
                <div>AI is analyzing your trip...</div>
              </div>
            )}

            {aiResult && (
              <div>
                {/* AI Summary */}
                <div style={{
                  background: "linear-gradient(135deg, #1a1d2e, #141728)",
                  borderRadius: 16, padding: "20px",
                  border: "1px solid rgba(108,127,255,0.2)",
                  marginBottom: 20,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>🤖</span>
                    <span style={{ fontWeight: 600, color: "#a0aaff" }}>AI Travel Analysis</span>
                  </div>
                  <p style={{ color: "#c5c9e0", fontSize: 14, lineHeight: 1.7, margin: "0 0 14px" }}>
                    {aiResult.summary}
                  </p>
                  {aiResult.bestTimeToTravel && (
                    <div style={{ fontSize: 13, color: "#6c7fff", borderTop: "1px solid #1e2235", paddingTop: 12 }}>
                      ⏰ {aiResult.bestTimeToTravel}
                    </div>
                  )}
                </div>

                {/* Warnings */}
                {aiResult.warnings?.length > 0 && (
                  <div style={{
                    background: "rgba(255,159,67,0.08)", borderRadius: 14,
                    padding: "16px 18px", border: "1px solid rgba(255,159,67,0.2)",
                    marginBottom: 20,
                  }}>
                    <div style={{ fontWeight: 600, color: "#ff9f43", marginBottom: 10, fontSize: 14 }}>⚠️ Travel Warnings</div>
                    {aiResult.warnings.map((w, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#f0a040", marginBottom: 4 }}>• {w}</div>
                    ))}
                  </div>
                )}

                {/* Travel tips */}
                {aiResult.travelTips?.length > 0 && (
                  <div style={{ background: "#1a1d2e", borderRadius: 16, padding: "20px", border: "1px solid #1e2235", marginBottom: 20 }}>
                    <div style={{ fontWeight: 600, color: "#e8eaf6", marginBottom: 14, fontSize: 14 }}>💡 Travel Tips</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                      {aiResult.travelTips.map((tip, i) => (
                        <div key={i} style={{
                          background: "#13151f", borderRadius: 10, padding: "12px 14px",
                          fontSize: 13, color: "#8892b0", lineHeight: 1.5,
                          borderLeft: "3px solid #6c7fff",
                        }}>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Packing list */}
                {aiResult.packingList?.length > 0 && (
                  <div style={{ background: "#1a1d2e", borderRadius: 16, padding: "20px", border: "1px solid #1e2235", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ fontWeight: 600, color: "#e8eaf6", fontSize: 14 }}>🎒 AI Packing List</div>
                      <span style={{ fontSize: 12, color: "#5a6080" }}>Click items to check them off</span>
                    </div>
                    <PackingList items={aiResult.packingList} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#5a6080" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✈️</div>
            <div style={{ fontSize: 16, color: "#8892b0", marginBottom: 8 }}>Plan your perfect trip</div>
            <div style={{ fontSize: 13 }}>Enter your origin, destination and dates above</div>
          </div>
        )}
      </div>
    </Layout>
  );
}