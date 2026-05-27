export const getLocation = () => {

  return new Promise((resolve) => {

    // CHECK BROWSER SUPPORT

    if (!navigator.geolocation) {

      resolve({

        success: false,

        type: "error",

        message:
          "🌍 Your browser does not support location services."

      });

      return;
    }


    // GET CURRENT POSITION

    navigator.geolocation.getCurrentPosition(

      // SUCCESS

      (position) => {

        resolve({

          success: true,

          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

          type: "success",

          message:
            "📍 Location detected successfully."

        });

      },


      // ERROR HANDLING

      (error) => {

        let aiMessage = "";


        switch (error.code) {

          case error.PERMISSION_DENIED:

            aiMessage =
              "🧭 Location access was denied. Please allow location permission.";

            break;


          case error.POSITION_UNAVAILABLE:

            aiMessage =
              "🌍 Unable to detect your location right now.";

            break;


          case error.TIMEOUT:

            aiMessage =
              "⏳ Location request timed out. Please try again.";

            break;


          default:

            aiMessage =
              "⚠️ Something went wrong while accessing location.";

        }


        resolve({

          success: false,

          type: "warning",

          message: aiMessage

        });

      },

      // OPTIONS

      {

        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0

      }

    );

  });

};