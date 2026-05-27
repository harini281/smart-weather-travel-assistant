import {
  useState,
  useEffect
} from "react";

import Layout from "../components/Layout";

import "../App.css";

export default function Settings() {

  /* STATES */

  const [theme, setTheme] =
    useState(
      localStorage.getItem("theme")
      || "dark"
    );

  const [language, setLanguage] =
    useState(
      localStorage.getItem("language")
      || "EN"
    );

  const [notifications,
    setNotifications] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "notifications"
        )
      ) ?? true
    );

  const [travelAlerts,
    setTravelAlerts] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "travelAlerts"
        )
      ) ?? true
    );

  const [username,
    setUsername] =
    useState(
      localStorage.getItem(
        "username"
      ) || "User"
    );

  const [email,
    setEmail] =
    useState(
      localStorage.getItem(
        "userEmail"
      ) || ""
    );

  /* TRANSLATIONS */

  const text = {

    EN: {

      title: "Settings",

      subtitle:
        "Manage your profile, language, theme and weather preferences",

      profile:
        "Profile Settings",

      theme:
        "Theme Settings",

      language:
        "Language",

      notifications:
        "Notifications",

      weatherNotify:
        "Weather Notifications",

      travelNotify:
        "Travel Alerts",

      save:
        "Save Settings",

      username:
        "Username",

      email:
        "Email"

    },

    TA: {

      title:
        "அமைப்புகள்",

      subtitle:
        "உங்கள் சுயவிவரம், மொழி மற்றும் தீம் அமைப்புகளை நிர்வகிக்கவும்",

      profile:
        "சுயவிவர அமைப்புகள்",

      theme:
        "தீம் அமைப்புகள்",

      language:
        "மொழி",

      notifications:
        "அறிவிப்புகள்",

      weatherNotify:
        "வானிலை அறிவிப்புகள்",

      travelNotify:
        "பயண எச்சரிக்கைகள்",

      save:
        "அமைப்புகளை சேமிக்கவும்",

      username:
        "பயனர் பெயர்",

      email:
        "மின்னஞ்சல்"

    },

    SI: {

      title:
        "සැකසුම්",

      subtitle:
        "ඔබගේ පැතිකඩ, භාෂාව සහ තේමාව කළමනාකරණය කරන්න",

      profile:
        "පැතිකඩ සැකසුම්",

      theme:
        "තේමා සැකසුම්",

      language:
        "භාෂාව",

      notifications:
        "දැනුම්දීම්",

      weatherNotify:
        "කාලගුණ දැනුම්දීම්",

      travelNotify:
        "ගමන් අනතුරු ඇඟවීම්",

      save:
        "සැකසුම් සුරකින්න",

      username:
        "පරිශීලක නාමය",

      email:
        "ඊමේල්"

    }

  };

  /* SAVE SETTINGS */

  useEffect(() => {

    localStorage.setItem(
      "theme",
      theme
    );

    localStorage.setItem(
      "language",
      language
    );

    localStorage.setItem(
      "notifications",
      notifications
    );

    localStorage.setItem(
      "travelAlerts",
      travelAlerts
    );

    document.body.className =
      theme;

  }, [

    theme,
    language,
    notifications,
    travelAlerts

  ]);

  /* SAVE PROFILE */

  const saveProfile = () => {

    localStorage.setItem(
      "username",
      username
    );

    localStorage.setItem(
      "userEmail",
      email
    );

    alert(
      "Settings Saved Successfully 🚀"
    );

  };

  return (

    <Layout>

      <div className="settings-page">

        {/* HEADER */}

        <div className="settings-header">

          <h1>

            ⚙ {text[language].title}

          </h1>

          <p>

            {text[language].subtitle}

          </p>

        </div>

        {/* PROFILE */}

        <div className="settings-card">

          <h2>

            👤 {text[language].profile}

          </h2>

          <div className="settings-form">

            <input

              type="text"

              placeholder={
                text[language].username
              }

              value={username}

              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }

            />

            <input

              type="email"

              placeholder={
                text[language].email
              }

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

            />

          </div>

        </div>

        {/* THEME */}

        <div className="settings-card">

          <h2>

            🎨 {text[language].theme}

          </h2>

          <div className="theme-buttons">

            <button

              className={
                theme === "dark"
                  ? "active-theme"
                  : ""
              }

              onClick={() =>
                setTheme("dark")
              }
            >

              🌙 Dark Mode

            </button>

            <button

              className={
                theme === "light"
                  ? "active-theme"
                  : ""
              }

              onClick={() =>
                setTheme("light")
              }
            >

              ☀ Light Mode

            </button>

          </div>

        </div>

        {/* LANGUAGE */}

        <div className="settings-card">

          <h2>

            🌐 {text[language].language}

          </h2>

          <div className="language-options">

            <button

              className={
                language === "EN"
                  ? "active-lang-btn"
                  : ""
              }

              onClick={() =>
                setLanguage("EN")
              }
            >

              🇺🇸 English

            </button>

            <button

              className={
                language === "TA"
                  ? "active-lang-btn"
                  : ""
              }

              onClick={() =>
                setLanguage("TA")
              }
            >

              🇱🇰 Tamil

            </button>

            <button

              className={
                language === "SI"
                  ? "active-lang-btn"
                  : ""
              }

              onClick={() =>
                setLanguage("SI")
              }
            >

              🇱🇰 Sinhala

            </button>

          </div>

        </div>

        {/* NOTIFICATIONS */}

        <div className="settings-card">

          <h2>

            🔔 {text[language].notifications}

          </h2>

          <div className="toggle-group">

            <div className="toggle-item">

              <span>

                {text[language].weatherNotify}

              </span>

              <label className="switch">

                <input

                  type="checkbox"

                  checked={notifications}

                  onChange={() =>
                    setNotifications(
                      !notifications
                    )
                  }

                />

                <span className="slider"></span>

              </label>

            </div>

            <div className="toggle-item">

              <span>

                {text[language].travelNotify}

              </span>

              <label className="switch">

                <input

                  type="checkbox"

                  checked={travelAlerts}

                  onChange={() =>
                    setTravelAlerts(
                      !travelAlerts
                    )
                  }

                />

                <span className="slider"></span>

              </label>

            </div>

          </div>

        </div>

        {/* SAVE */}

        <button
          className="save-settings-btn"
          onClick={saveProfile}
        >

          💾 {text[language].save}

        </button>

      </div>

    </Layout>

  );

}