import "../App.css";

function WeatherCard({ weather }) {

  return (

    <div className="weather-card">

      <h2>
        {weather.location.name}
      </h2>

      <img
        src={weather.current.condition.icon}
        alt="weather icon"
      />

      <p>
        {weather.current.temp_c}°C
      </p>

      <p>
        {weather.current.condition.text}
      </p>

      <p>
        Humidity: {weather.current.humidity}%
      </p>

      <p>
        Wind Speed: {weather.current.wind_kph} kph
      </p>

      <p>
        Feels Like: {weather.current.feelslike_c}°C
      </p>

    </div>

  );

}

export default WeatherCard;