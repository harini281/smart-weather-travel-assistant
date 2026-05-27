import { useState } from "react";

export default function Agent() {

  const [city, setCity] = useState("");
  const [response, setResponse] = useState("");

  const analyzeCity = () => {

    const place = city.toLowerCase();

    if (place.includes("malabe")) {

      setResponse(
        "🌤️ Malabe is a calm suburban area with warm weather and moderate traffic. Great for education and residential travel."
      );

    }

    else if (place.includes("colombo")) {

      setResponse(
        "🏙️ Colombo is a busy city with hot weather and heavy traffic. Best travel time is morning or evening."
      );

    }

    else if (place.includes("kandy")) {

      setResponse(
        "⛰️ Kandy has cooler weather and beautiful mountain views. Carry a light jacket for evenings."
      );

    }

    else if (place.includes("galle")) {

      setResponse(
        "🏖️ Galle is a coastal tourist city with sunny weather and relaxing beaches."
      );

    }

    else {

      setResponse(
        "❌ No travel information available for this location."
      );

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #020024, #090979, #000000)",
        padding: "40px",
        color: "white",
        fontFamily: "Arial"
      }}
    >

      {/* Title */}
      <div style={{ marginBottom: "30px" }}>

        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px"
          }}
        >
          🤖 AI Travel Agent
        </h1>

        <p
          style={{
            color: "#cfcfcf",
            fontSize: "18px"
          }}
        >
          Smart travel assistant for weather and city insights
        </p>

      </div>

      {/* Search Box */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px"
        }}
      >

        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            flex: 1,
            padding: "18px",
            borderRadius: "15px",
            border: "none",
            outline: "none",
            fontSize: "18px",
            background: "#1e1e2f",
            color: "white"
          }}
        />

        <button
          onClick={analyzeCity}
          style={{
            padding: "18px 30px",
            borderRadius: "15px",
            border: "none",
            background:
              "linear-gradient(to right, #7b2ff7, #f107a3)",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Analyze
        </button>

      </div>

      {/* Response Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: "30px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
        }}
      >

        <h2
          style={{
            marginBottom: "15px"
          }}
        >
          ✨ AI Response
        </h2>

        <p
          style={{
            fontSize: "20px",
            lineHeight: "1.8",
            color: "#f1f1f1"
          }}
        >
          {response || "No AI response yet."}
        </p>

      </div>

    </div>
  );
}