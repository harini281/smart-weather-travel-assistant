import "./WeatherCard.css";

function WeatherCard({ weather }) {

  if (!weather) {

    return null;

  }

  return (

    <div className="weather-card">

      {/* LOCATION */}

      <div className="weather-header">

        <h2>
          📍 {weather.location.name}
        </h2>

        <p>
          {weather.location.country}
        </p>

      </div>

      {/* WEATHER ICON */}

      <div className="weather-icon-section">

        <img
          src={weather.current.condition.icon}
          alt="weather icon"
        />

        <h1>
          {weather.current.temp_c}°C
        </h1>

      </div>

      {/* CONDITION */}

      <div className="condition-box">

        <h3>
          ☁ {weather.current.condition.text}
        </h3>

      </div>

      {/* WEATHER DETAILS */}

      <div className="weather-details">

        <div className="detail-card">

          <span>
            💧 Humidity
          </span>

          <h4>
            {weather.current.humidity}%
          </h4>

        </div>

        <div className="detail-card">

          <span>
            🌬 Wind
          </span>

          <h4>
            {weather.current.wind_kph} kph
          </h4>

        </div>

        <div className="detail-card">

          <span>
            🌡 Feels Like
          </span>

          <h4>
            {weather.current.feelslike_c}°C
          </h4>

        </div>

        <div className="detail-card">

          <span>
            🕒 Local Time
          </span>

          <h4>
            {weather.location.localtime}
          </h4>

        </div>

      </div>

    </div>

  );

}

export default WeatherCard;