import "../App.css";

function ForecastCard({ day }) {

  return (

    <div className="forecast-card">

      {/* DATE */}

      <div className="forecast-date">

        📅 {day.date}

      </div>

      {/* WEATHER ICON */}

      <div className="forecast-icon">

        <img
          src={day.day.condition.icon}
          alt="forecast icon"
        />

      </div>

      {/* TEMPERATURE */}

      <h1 className="forecast-temp">

        {day.day.avgtemp_c}°C

      </h1>

      {/* CONDITION */}

      <p className="forecast-condition">

        ☁ {day.day.condition.text}

      </p>

      {/* EXTRA DETAILS */}

      <div className="forecast-details">

        <div className="forecast-detail-box">

          💧 Humidity

          <span>
            {day.day.avghumidity}%
          </span>

        </div>

        <div className="forecast-detail-box">

          🌧 Rain

          <span>
            {day.day.daily_chance_of_rain}%
          </span>

        </div>

        <div className="forecast-detail-box">

          🌬 Wind

          <span>
            {day.day.maxwind_kph} kph
          </span>

        </div>

      </div>

    </div>

  );

}

export default ForecastCard;