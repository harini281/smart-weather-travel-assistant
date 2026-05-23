import axios from "axios";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
 Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "../App.css";
import "../index.css";

function Dashboard() {

  const navigate = useNavigate();

  // STATES

  const [city, setCity] = useState("");

  const [weather, setWeather] = useState(null);

  const [forecast, setForecast] = useState([]);

  const [history, setHistory] = useState([]);

  const [advice, setAdvice] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  const [language, setLanguage] = useState("en");

  // USERNAME

  const username =
    localStorage.getItem("username");

  // TRANSLATIONS

  const translations = {

    en: {

      welcome: "Welcome",

      dashboard: "Dashboard",

      forecast: "Forecast",

      history: "History",

      reports: "Reports",

      search: "Search",

      currentLocation:
        "Current Location",

      analytics:
        "Temperature Analytics",

      recentSearches:
        "Recent Searches",

      reportDownload:
        "Download Full Analysis Report",

      dark:
        "Dark Mode",

      light:
        "Light Mode"
    },

    ta: {

      welcome:
        "வரவேற்கிறோம்",

      dashboard:
        "டாஷ்போர்டு",

      forecast:
        "முன்னறிவிப்பு",

      history:
        "வரலாறு",

      reports:
        "அறிக்கைகள்",

      search:
        "தேடுக",

      currentLocation:
        "தற்போதைய இடம்",

      analytics:
        "வெப்பநிலை பகுப்பாய்வு",

      recentSearches:
        "சமீபத்திய தேடல்கள்",

      reportDownload:
        "முழு அறிக்கையை பதிவிறக்கு",

      dark:
        "இருண்ட நிலை",

      light:
        "ஒளி நிலை"
    },

    si: {

      welcome:
        "සාදරයෙන් පිළිගනිමු",

      dashboard:
        "උපකරණ පුවරුව",

      forecast:
        "කාලගුණ අනාවැකිය",

      history:
        "ඉතිහාසය",

      reports:
        "වාර්තා",

      search:
        "සොයන්න",

      currentLocation:
        "වත්මන් ස්ථානය",

      analytics:
        "උෂ්ණත්ව විශ්ලේෂණය",

      recentSearches:
        "මෑත සෙවීම්",

      reportDownload:
        "සම්පූර්ණ වාර්තාව බාගන්න",

      dark:
        "අඳුරු මාදිලිය",

      light:
        "දීප්තිමත් මාදිලිය"
    }

  };

  const t = translations[language];

  // CHART DATA

  const chartData = forecast.map((day) => ({

    date: day.date.slice(5),

    temp: day.day.avgtemp_c

  }));

  // LOAD HISTORY

  const getHistory = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/weather"
      );

      setHistory(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // AUTO LOAD

  useEffect(() => {

    getHistory();

  }, []);

  // AI ADVICE

  const generateAdvice = (temp, condition) => {

    if (
      condition.toLowerCase().includes("rain")
    ) {

      setAdvice(
        "🌧 Rain expected today. Carry an umbrella."
      );

    }

    else if (temp > 30) {

      setAdvice(
        "☀ Very hot weather. Stay hydrated."
      );

    }

    else if (temp < 20) {

      setAdvice(
        "🧥 Cold weather detected. Wear a jacket."
      );

    }

    else {

      setAdvice(
        "🌤 Weather looks pleasant today."
      );

    }

  };

  // CURRENT LOCATION

  const getCurrentLocationWeather = () => {

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const apiKey =
          "09e9c37c210f4e2c96611330262205";

        const response = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5`
        );

        setWeather(response.data);

        setForecast(
          response.data.forecast.forecastday
        );

        generateAdvice(
          response.data.current.temp_c,
          response.data.current.condition.text
        );

      }

    );

  };

  // SEARCH WEATHER

  const getWeather = async () => {

    try {

      const apiKey =
        "09e9c37c210f4e2c96611330262205";

      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`
      );

      setWeather(response.data);

      setForecast(
        response.data.forecast.forecastday
      );

      generateAdvice(
        response.data.current.temp_c,
        response.data.current.condition.text
      );

      await axios.post(
        "http://127.0.0.1:8000/weather",
        null,
        {
          params: {

            city:
              response.data.location.name,

            temperature:
              response.data.current.temp_c,

            condition:
              response.data.current.condition.text

          }
        }
      );

      getHistory();

    } catch (error) {

      alert("City not found!");

    }

  };

  return (

    <div
      className={`dashboard-container ${
        darkMode
          ? "dark-theme"
          : "light-theme"
      }`}
    >

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2>
          ☁ Weather
        </h2>

        <ul>

          <li>
            🏠 {t.dashboard}
          </li>

          <li>
            🌤 {t.forecast}
          </li>

          <li>
            🕘 {t.history}
          </li>

          <li>
            📄 {t.reports}
          </li>

        </ul>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={() => {

            localStorage.removeItem(
              "username"
            );

            navigate("/");

          }}
        >
          🚪 Logout
        </button>

      </div>

      {/* MAIN */}

      <div className="main-content">

        {/* USER */}

        <h1>

          {t.welcome}
          {" "}
          {username || "User"}
          👋

        </h1>

        {/* ACTIONS */}

        <div className="top-actions">

          {/* THEME */}

          <button

            className="theme-btn"

            onClick={() =>
              setDarkMode(!darkMode)
            }
          >

            {darkMode
              ? `☀ ${t.light}`
              : `🌙 ${t.dark}`}

          </button>

          {/* LANGUAGE SWITCHER */}

          <div className="language-switcher">

            <button

              className={
                language === "en"
                  ? "lang-btn active-lang"
                  : "lang-btn"
              }

              onClick={() =>
                setLanguage("en")
              }
            >

              🇺🇸 English

            </button>

            <button

              className={
                language === "ta"
                  ? "lang-btn active-lang"
                  : "lang-btn"
              }

              onClick={() =>
                setLanguage("ta")
              }
            >

              🇱🇰 தமிழ்

            </button>

            <button

              className={
                language === "si"
                  ? "lang-btn active-lang"
                  : "lang-btn"
              }

              onClick={() =>
                setLanguage("si")
              }
            >

              🇱🇰 සිංහල

            </button>

          </div>

        </div>

        {/* SEARCH */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
          />

          <button
            onClick={getWeather}
          >
            {t.search}
          </button>

          <button
            onClick={
              getCurrentLocationWeather
            }
          >
            {t.currentLocation}
          </button>

        </div>

        {/* WEATHER + AI */}

        <div className="top-section">

          {/* WEATHER CARD */}

          {weather && (

            <div className="weather-card">

              <h2>
                {weather.location.name}
              </h2>

              <img
                src={
                  weather.current.condition.icon
                }
                alt="weather icon"
              />

              <p>
                🌡 {weather.current.temp_c}°C
              </p>

              <p>
                ☁ {weather.current.condition.text}
              </p>

              <p>
                💧 Humidity:
                {" "}
                {weather.current.humidity}%
              </p>

              <p>
                🌬 Wind:
                {" "}
                {weather.current.wind_kph} kph
              </p>

              <p>
                🥵 Feels Like:
                {" "}
                {weather.current.feelslike_c}°C
              </p>

            </div>

          )}

          {/* AI CARD */}

          {advice && (

            <div className="ai-card">

              <h2>
                🤖 Weather AI Agent
              </h2>

              <p>
                {advice}
              </p>

            </div>

          )}

        </div>

        {/* FORECAST */}

        <div className="forecast-container">

          {forecast.map((day, index) => (

            <div
              className="forecast-card"
              key={index}
            >

              <h3>
                {day.date}
              </h3>

              <img
                src={
                  day.day.condition.icon
                }
                alt="forecast icon"
              />

              <p>
                🌡 {day.day.avgtemp_c}°C
              </p>

              <p>
                ☁ {day.day.condition.text}
              </p>

            </div>

          ))}

        </div>

        {/* CHART */}

        <div className="chart-section">

          <h2>
            📊 {t.analytics}
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <LineChart
              data={chartData}
            >

              <defs>

                <linearGradient
                  id="colorTemp"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >

                  <stop
                    offset="0%"
                    stopColor="#7c3aed"
                  />

                  <stop
                    offset="100%"
                    stopColor="#38bdf8"
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="url(#colorTemp)"
                strokeWidth={5}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* HISTORY */}

        <div className="history-section">

          <h2>
            🕘 {t.recentSearches}
          </h2>

          <div className="history-grid">

            {[...history]

              .reverse()

              .slice(0, 5)

              .map((item) => (

                <div
                  className="history-card"
                  key={item.id}
                >

                  <p>
                    🌍 {item.city}
                  </p>

                  <p>
                    🌡 {item.temperature}°C
                  </p>

                  <p>
                    ☁ {item.condition}
                  </p>

                </div>

              ))}

          </div>

        </div>

        {/* PDF */}

        <button

          className="report-btn"

          onClick={() => {

            if (!weather) {

              alert(
                "Search weather first!"
              );

              return;
            }

            const doc = new jsPDF();

            doc.text(
              "Weather Report",
              20,
              20
            );

            doc.save(
              `${weather.location.name}-weather-report.pdf`
            );

          }}
        >

          📄 {t.reportDownload}

        </button>

      </div>

    </div>

  );

}

export default Dashboard;