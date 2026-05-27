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


// FIX LEAFLET MARKER ICON

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

});


// AUTO CENTER MAP

function ChangeMapView({ center }) {

  const map = useMap();

  map.setView(center, 8);

  return null;
}


export default function Maps() {

  // STATES

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


  // API KEY

  const apiKey =
  "596e8629dc6604ff3ad22867e61e0667";

  // GET CURRENT LOCATION

  useEffect(() => {

    if (!navigator.geolocation) {

      setError(
        "Geolocation not supported"
      );

      return;
    }

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

        setError(
          "Location permission denied"
        );

      }

    );

  }, []);


  // SEARCH DESTINATION

  const searchLocation =
    async () => {

      if (!destination.trim()) {

        setError(
          "Please enter destination"
        );

        return;
      }

      setLoading(true);

      setError("");

      try {

        const query =
          `${destination},Sri Lanka`;

        const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${apiKey}&units=metric`
);

        const data =
          await response.json();

        console.log(data);

        if (!response.ok) {

          throw new Error(

            data.message ||
            "Unable to find location"

          );
        }

        // DESTINATION COORDS

        setDestinationCoords([

          data.coord.lat,

          data.coord.lon

        ]);

        // WEATHER DATA

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

        setError(err.message);

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
            View travel routes and destination weather
          </p>

        </div>


        {/* SEARCH */}

        <div className="maps-search">

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
              ? "⏳ Loading..."
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


            {/* CURRENT LOCATION */}

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


        {/* WEATHER CARD */}

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

              ☁ {travelWeather.condition}

            </div>

            <div className="travel-details">

              <div>

                💧 Humidity:
                {" "}
                {travelWeather.humidity}%

              </div>

              <div>

                🌬 Wind:
                {" "}
                {travelWeather.wind} km/h

              </div>

            </div>

          </div>

        )}

      </div>

    </Layout>
  );
}