import { useState, useEffect } from "react";

import Layout from "../components/Layout";

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

  // OPENWEATHER API KEY

  const apiKey =
    "596e8629dc6604ff3ad22867e61e0667";


  // FETCH FORECAST

  const fetchForecast = async (
    cityName
  ) => {

    setLoading(true);

    setError("");

    try {

      const response =
        await fetch(

          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`

        );

      if (!response.ok) {

        throw new Error(
          "Location not found"
        );

      }

      const data =
        await response.json();

      console.log(data);

      // FORECAST DATA

      setForecast(
        data.list.slice(0, 5)
      );

      // HOURLY DATA

      setHourly(
        data.list.slice(0, 8)
      );

      // CITY

      setCity(
        data.city.name
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


  // CURRENT LOCATION

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

        },

        () => {

          setError(
            "Location denied"
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

          placeholder="Search city..."

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


        {/* LOCATION */}

        {!loading && !error && (

          <div className="forecast-location">

            📍 {city}

          </div>

        )}


        {/* FORECAST */}

        {!loading && (

          <>

            <div className="section-title">

              📅 Forecast

            </div>

            <div className="forecast-grid">

              {forecast.map(
                (item, index) => (

                  <div
                    key={index}
                    className="forecast-card"
                  >

                    <h2>

                      {
                        item.dt_txt
                      }

                    </h2>

                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt="weather"
                    />

                    <h1>

                      {
                        Math.round(
                          item.main.temp
                        )
                      }°C

                    </h1>

                    <p>

                      ☁ {
                        item.weather[0]
                          .description
                      }

                    </p>

                    <div>

                      💧 Humidity:
                      {" "}
                      {
                        item.main
                          .humidity
                      }%

                    </div>

                    <div>

                      🌬 Wind:
                      {" "}
                      {
                        item.wind.speed
                      } km/h

                    </div>

                  </div>

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
                        hour.dt_txt.split(
                          " "
                        )[1]
                      }

                    </h3>

                    <img
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                      alt="weather"
                    />

                    <h2>

                      {
                        Math.round(
                          hour.main.temp
                        )
                      }°C

                    </h2>

                    <p>

                      ☁ {
                        hour.weather[0]
                          .description
                      }

                    </p>

                    <div>

                      💧 {
                        hour.main
                          .humidity
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