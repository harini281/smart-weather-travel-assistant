import "../App.css";

function ForecastCard({ day }) {

  return (

    <div className="forecast-card">

      <h3>
        {day.date}
      </h3>

      <img
        src={day.day.condition.icon}
        alt="forecast icon"
      />

      <p>
        {day.day.avgtemp_c}°C
      </p>

      <p>
        {day.day.condition.text}
      </p>

    </div>

  );

}

export default ForecastCard;