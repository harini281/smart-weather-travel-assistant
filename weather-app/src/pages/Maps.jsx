import {
  useState,
  useEffect
} from "react";

import Layout from "../components/Layout";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "../App.css";

// FIX MARKER ICON

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

});

// AUTO CENTER

function ChangeMapView({ center }) {

  const map = useMap();

  map.setView(center, 8);

  return null;
}

export default function Maps() {

  // STATES

  const [currentLocation,
    setCurrentLocation] =
    useState("");

  const [destination,
    setDestination] =
    useState("");

  const [currentCoords,
    setCurrentCoords] =
    useState([6.9271, 79.8612]);

  const [destinationCoords,
    setDestinationCoords] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const [travelWeather,
    setTravelWeather] =
    useState(null);

  // WEATHER API KEY

  const apiKey =
    "596e8629dc6604ff3ad22867e61e0667";

  // GET LIVE LOCATION

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;

        setCurrentCoords([
          lat,
          lon
        ]);

      },

      () => {

        console.log(
          "Location permission denied"
        );
      }

    );

  }, []);

  // SEARCH LOCATION

  const searchLocation =
    async () => {

      if (!destination.trim()) {

        setError(
          "🧭 Please enter destination"
        );

        return;
      }

      setLoading(true);

      setError("");

      try {

        // ADD COUNTRY

        const query =
          `${destination},Sri Lanka`;

        // WEATHER API

        const response =
          await fetch(

            `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`

          );

        const data =
          await response.json();

        console.log(data);

        // ERROR

        if (!response.ok) {

          throw new Error(

            data.message ||

            "Unable to find location"
          );
        }

        // COORDS

        setDestinationCoords([

          data.coord.lat,

          data.coord.lon

        ]);

        // WEATHER

        setTravelWeather({

          city:
            data.name,

          country:
            data.sys.country,

          temp:
            Math.round(
              data.main.temp
            ),

          condition:
            data.weather[0]
              .description,

          humidity:
            data.main.humidity,

          wind:
            Math.round(
              data.wind.speed
            )

        });

      } catch (err) {

        setError(
          err.message
        );
      }

      setLoading(false);
    };

  return (

    <Layout>

      <div className="maps-page">

        {/* HEADER */}

        <div className="maps-header">

          <h1>

            🗺 Travel Weather Maps

          </h1>

          <p>

            View travel route,
            destination weather
            and smart travel analysis

          </p>

        </div>

        {/* SEARCH */}

        <div className="maps-search">

          <input

            type="text"

            placeholder="Current location"

            value={currentLocation}

            onChange={(e) =>
              setCurrentLocation(
                e.target.value
              )
            }

          />

          <input

            type="text"

            placeholder="Destination"

            value={destination}

            onChange={(e) =>
              setDestination(
                e.target.value
              )
            }

          />

          <button
            onClick={searchLocation}
          >

            {loading
              ? "⏳"
              : "Search Route"}

          </button>

        </div>

        {/* ERROR */}

        {error && (

          <div className="maps-error">

            ❌ {error}

          </div>

        )}

        {/* MAP */}

        <div className="map-wrapper">

          <MapContainer

            center={currentCoords}

            zoom={7}

            scrollWheelZoom={true}

            className="leaflet-map"
          >

            <TileLayer

              attribution='&copy; OpenStreetMap'

              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

            />

            {/* AUTO CENTER */}

            <ChangeMapView

              center={
                destinationCoords
                  || currentCoords
              }

            />

            {/* CURRENT */}

            <Marker
              position={currentCoords}
            >

              <Popup>

                📍 Current Location

              </Popup>

            </Marker>

            {/* DESTINATION */}

            {destinationCoords && (

              <>

                <Marker
                  position={
                    destinationCoords
                  }
                >

                  <Popup>

                    🧭 Destination

                  </Popup>

                </Marker>

                {/* ROUTE */}

                <Polyline

                  positions={[

                    currentCoords,

                    destinationCoords

                  ]}

                  pathOptions={{

                    color: "#7c3aed",

                    weight: 5

                  }}

                />

              </>

            )}

          </MapContainer>

        </div>

        {/* WEATHER */}

        {travelWeather && (

          <div className="travel-weather-card">

            <h2>

              🌦 Destination Weather

            </h2>

            <h1>

              📍 {travelWeather.city}

            </h1>

            <p>

              {travelWeather.country}

            </p>

            <div className="travel-temp">

              🌡 {travelWeather.temp}°C

            </div>

            <div className="travel-condition">

              ☁ {
                travelWeather.condition
              }

            </div>

            <div className="travel-details">

              <div>

                💧 Humidity:
                {" "}
                {
                  travelWeather.humidity
                }%

              </div>

              <div>

                🌬 Wind:
                {" "}
                {
                  travelWeather.wind
                } km/h

              </div>

            </div>

            {/* AI */}

            <div className="travel-ai-box">

              🤖 AI Travel Advice:
              Weather conditions look
              safe for travel. Carry
              essentials based on
              current conditions.

            </div>

          </div>

        )}

      </div>

    </Layout>

  );
}