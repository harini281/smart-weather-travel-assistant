// services/reportService.js

export const generateWeatherReport = (weatherData) => {

  // No data
  if (!weatherData) {
    return {
      type: "error",
      title: "Weather Report",
      summary:
        "⚠️ Unable to generate weather report right now.",
    };
  }

  const city = weatherData.name;
  const country = weatherData.sys.country;

  const temperature = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const humidity = weatherData.main.humidity;

  const windSpeed = weatherData.wind.speed;

  const condition = weatherData.weather[0].main;
  const description = weatherData.weather[0].description;

  // Risk analysis
  let riskLevel = "Low";
  let recommendation = "";

  if (
    condition === "Thunderstorm" ||
    condition === "Tornado"
  ) {
    riskLevel = "High";
    recommendation =
      "⛈️ Severe weather conditions detected. Avoid unnecessary travel.";
  }

  else if (
    condition === "Rain" ||
    condition === "Drizzle"
  ) {
    riskLevel = "Medium";
    recommendation =
      "🌧️ Wet weather expected. Carry rain protection.";
  }

  else if (temperature > 35) {
    riskLevel = "Medium";
    recommendation =
      "🔥 High temperatures detected. Stay hydrated during travel.";
  }

  else {
    recommendation =
      "☀️ Weather conditions look safe for travel activities.";
  }

  return {
    type: "success",

    title: `📊 Weather Report for ${city}, ${country}`,

    summary: `
🌡️ Temperature: ${temperature}°C
🤒 Feels Like: ${feelsLike}°C
💧 Humidity: ${humidity}%
💨 Wind Speed: ${windSpeed} m/s

🌤️ Condition: ${condition}
📝 Description: ${description}

⚠️ Risk Level: ${riskLevel}

🧭 Recommendation:
${recommendation}
    `,
  };
};