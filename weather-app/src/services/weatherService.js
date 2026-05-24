// Home.jsx

import { useState } from "react";
import { getWeatherByCity } from "../services/weatherService";

export default function Home() {

  const [city, setCity] = useState("");

  const [weatherData, setWeatherData] = useState(null);

  const [error, setError] = useState("");

  const handleSearch = async () => {

    const result =
      await getWeatherByCity(city);

    console.log(result);

    if (result.success) {

      setWeatherData(result.data);

      setError("");

    } else {

      setError(result.message);

      setWeatherData(null);
    }
  };

  return (
    <div className="home">

      <h1>🌤️ Weather Dashboard</h1>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >

        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
          style={{
            padding: "15px",
            width: "400px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "15px 25px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#6c63ff",
            color: "white",
            fontWeight: "bold",
          }}
        >
          🔍 Search
        </button>

      </div>

      {/* Error Message */}
      {error && (

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            background: "#2a0f18",
            color: "#ff6b6b",
            border: "1px solid #ff4d6d",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Weather Card */}
      {weatherData && (

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "15px",
            background: "#151528",
            color: "white",
            width: "350px",
          }}
        >

          <h2>
            {weatherData.name},
            {" "}
            {weatherData.sys.country}
          </h2>

          <h1>
            {weatherData.main.temp}°C
          </h1>

          <p>
            🌤️
            {" "}
            {weatherData.weather[0].main}
          </p>

          <p>
            💧 Humidity:
            {" "}
            {weatherData.main.humidity}%
          </p>

          <p>
            💨 Wind:
            {" "}
            {weatherData.wind.speed} m/s
          </p>

        </div>
      )}

    </div>
  );
}