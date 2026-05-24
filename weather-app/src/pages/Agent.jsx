import { useState } from "react";

export default function Agent() {

  const [city, setCity] =
    useState("");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // HUGGING FACE TOKEN

  const HF_TOKEN =import.meta.env.VITE_HF_TOKEN;
  


  // ANALYZE FUNCTION

  const handleAnalyze =
    async () => {

      if (!city) {

        setResponse(
          "Please enter a city."
        );

        return;
      }

      try {

        setLoading(true);

        setResponse("");

        // PROMPT

        const prompt = `

Give short travel advice
for visiting ${city}.

Mention clothing,
weather preparation,
and safety tips.

`;

        // API CALL

        const res =
          await fetch(

            "https://api-inference.huggingface.co/models/google/flan-t5-large",

            {

              method: "POST",

              headers: {

                Authorization:
                  `Bearer ${HF_TOKEN}`,

                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                inputs: prompt,

              }),
            }
          );

        // JSON RESPONSE

        const data =
          await res.json();

        console.log(data);

        // AI TEXT

        const text =

          data?.[0]
          ?.generated_text ||

          "AI response unavailable.";

        // SET RESPONSE

        setResponse(text);

      } catch (error) {

        console.log(error);

        setResponse(
          "AI request failed."
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right,#020617,#1e1b4b)",
        color: "white",
        padding: "40px",
      }}
    >

      <h1>
        🤖 AI Travel Agent
      </h1>

      <p>
        Open-source AI travel assistant
      </p>

      {/* INPUT AREA */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "30px",
        }}
      >

        <input

          type="text"

          placeholder="Enter city"

          value={city}

          onChange={(e) =>
            setCity(e.target.value)
          }

          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
          }}
        />

        <button

          onClick={handleAnalyze}

          style={{
            padding: "15px 25px",
            border: "none",
            borderRadius: "10px",
            background: "#7c3aed",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >

          {loading
            ? "Analyzing..."
            : "Analyze"}

        </button>

      </div>

      {/* RESPONSE */}

      {response && (

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "12px",
            background:
              "#1e1b4b",
            lineHeight: "1.8",
          }}
        >

          {response}

        </div>
      )}

    </div>
  );
}