// services/mapService.js

export const getLocation = () => {
  return new Promise((resolve) => {

    // Check browser support
    if (!navigator.geolocation) {
      resolve({
        success: false,
        type: "error",
        message:
          "🌍 Your browser does not support location services.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(

      // Success
      (position) => {
        resolve({
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          type: "success",
          message:
            "📍 Location detected successfully.",
        });
      },

      // Error
      (error) => {
        let aiMessage = "";

        switch (error.code) {

          case error.PERMISSION_DENIED:
            aiMessage =
              "🧭 Location access was denied. You can still search for a destination manually.";
            break;

          case error.POSITION_UNAVAILABLE:
            aiMessage =
              "🌍 Unable to detect your location right now. Please try again later.";
            break;

          case error.TIMEOUT:
            aiMessage =
              "⏳ Location request timed out. Retry or search manually.";
            break;

          default:
            aiMessage =
              "⚠️ Something went wrong while accessing your location.";
        }

        resolve({
          success: false,
          type: "warning",
          message: aiMessage,
        });
      }
    );
  });
};