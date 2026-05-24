// services/agentService.js

// HUGGING FACE TOKEN
// services/agentService.js

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;



export const generateTravelAdvice = async (weatherData) => {
  // ... rest of your code unchanged


    try {

      // SAFETY

      if (!weatherData) {

        return {

          success: false,

          message:
            "Weather data unavailable."
        };
      }

      // WEATHER DATA

      const city =
        weatherData?.name || "Unknown";

      const temp =
        weatherData?.main?.temp || 0;

      const condition =
        weatherData?.weather?.[0]
        ?.main || "Clear";

      // PROMPT

      const prompt = `

You are a smart AI travel assistant.

City: ${city}
Temperature: ${temp}°C
Weather: ${condition}

Give short travel advice
for travelers.

`;

      // API REQUEST

      const response =
        await fetch(

          "https://router.huggingface.co/v1/chat/completions",

          {

            method: "POST",

            headers: {

              Authorization:
                `Bearer ${HF_TOKEN}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              model:
                "swiss-ai/Apertus-8B-Instruct-2509:publicai",

              messages: [

                {
                  role: "user",

                  content: prompt,
                },
              ],
            }),
          }
        );

      // JSON

      const data =
        await response.json();

      console.log(data);

      // AI TEXT

      const text =

        data?.choices?.[0]
        ?.message?.content ||

        "Travel conditions look normal.";

      // RETURN

      return {

        success: true,

        message: text,
      };

    } catch (error) {

      console.log(
        "HF ERROR:",
        error
      );

      return {

        success: false,

        message:
          "🤖 AI analysis unavailable.",
      };
    }
};

// MAIN FUNCTION

export const generateTravelAdvice =
  async (weatherData) => {

    try {

      // SAFETY

      if (!weatherData) {

        return {

          success: false,

          message:
            "Weather data unavailable."
        };
      }

      // WEATHER DATA

      const city =
        weatherData?.name || "Unknown";

      const temp =
        weatherData?.main?.temp || 0;

      const condition =
        weatherData?.weather?.[0]
        ?.main || "Clear";

      // PROMPT

      const prompt = `

You are a smart AI travel assistant.

City: ${city}
Temperature: ${temp}°C
Weather: ${condition}

Give short travel advice
for travelers.

`;

      // API REQUEST

      const response =
        await fetch(

          "https://router.huggingface.co/v1/chat/completions",

          {

            method: "POST",

            headers: {

              Authorization:
                `Bearer ${HF_TOKEN}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              model:
                "swiss-ai/Apertus-8B-Instruct-2509:publicai",

              messages: [

                {
                  role: "user",

                  content: prompt,
                },
              ],
            }),
          }
        );

      // JSON

      const data =
        await response.json();

      console.log(data);

      // AI TEXT

      const text =

        data?.choices?.[0]
        ?.message?.content ||

        "Travel conditions look normal.";

      // RETURN

      return {

        success: true,

        message: text,
      };

    } catch (error) {

      console.log(
        "HF ERROR:",
        error
      );

      return {

        success: false,

        message:
          "🤖 AI analysis unavailable.",
      };
    }
};