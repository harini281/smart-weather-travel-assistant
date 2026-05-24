import { useState, useEffect } from "react";

import Layout from "../components/Layout";

import ForecastCard from "../components/ForecastCard";

import SearchBar from "../components/SearchBar";

import "../App.css";

export default function Forecast() {

  // STATES

  const [city, setCity] =
    useState("Colombo");

  const [forecast, setForecast] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hourly, setHourly] =
    useState([]);

  // API

  const apiKey =
    "YOUR_WEATHER_API_KEY";

  // FETCH FORECAST

  const fetchForecast = async (
    cityName
  ) => {

    setLoading(true);

    setError("");

    try {

      const response =
        await fetch(

          `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5`

        );

      if (!response.ok) {

        throw new Error(
          "Location not found"
        );

      }

      const data =
        await response.json();

      // DAILY FORECAST

      setForecast(
        data.forecast.forecastday
      );

      // HOURLY FORECAST

      const hourlyData =
        data.forecast.forecastday.flatMap(
          (day) =>
            day.hour.slice(0, 6)
        );

      setHourly(hourlyData);

      setCity(
        data.location.name
      );

    } catch (err) {

      setError(
        err.message
      );

    }

    setLoading(false);

  };

  // INITIAL LOAD

  useEffect(() => {

    fetchForecast(city);

  }, []);

  // LOCATION WEATHER

  const getCurrentLocation =
    () => {

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const lat =
            position.coords.latitude;

          const lon =
            position.coords.longitude;

          fetchForecast(
            `${lat},${lon}`
          );

        }

      );

    };

  return (

    <Layout>

      <div className="forecast-page">

        {/* HEADER */}

        <div className="forecast-header">

          <h1>

            🌦 Weather Forecast

          </h1>

          <p>

            5-day forecast,
            hourly updates,
            travel weather insights
            and smart analytics

          </p>

        </div>

        {/* SEARCH BAR */}

        <SearchBar

          onSearch={fetchForecast}

          onLocationClick={
            getCurrentLocation
          }

          loading={loading}

          locLoading={loading}

          placeholder="Search city, zip code, landmark..."

        />

        {/* ERROR */}

        {error && (

          <div className="forecast-error">

            ❌ {error}

          </div>

        )}

        {/* LOADING */}

        {loading && (

          <div className="forecast-loading">

            ⏳ Loading forecast...

          </div>

        )}

        {/* CITY TITLE */}

        {!loading && !error && (

          <div className="forecast-location">

            📍 {city}

          </div>

        )}

        {/* DAILY FORECAST */}

        {!loading && (

          <>

            <div className="section-title">

              📅 5-Day Forecast

            </div>

            <div className="forecast-grid">

              {forecast.map(
                (day, index) => (

                  <ForecastCard

                    key={index}

                    day={day}

                  />

                )
              )}

            </div>

          </>

        )}

        {/* HOURLY */}

        {!loading && (

          <>

            <div className="section-title">

              ⏰ Hourly Forecast

            </div>

            <div className="hourly-grid">

              {hourly.map(
                (hour, index) => (

                  <div
                    key={index}
                    className="hour-card"
                  >

                    <h3>

                      {
                        hour.time.split(
                          " "
                        )[1]
                      }

                    </h3>

                    <img
                      src={
                        hour.condition.icon
                      }
                      alt="weather"
                    />

                    <h2>

                      {hour.temp_c}°C

                    </h2>

                    <p>

                      ☁ {
                        hour.condition.text
                      }

                    </p>

                    <div>

                      💧 {
                        hour.humidity
                      }%

                    </div>

                  </div>

                )
              )}

            </div>

          </>

        )}

      </div>

    </Layout>

  );

}