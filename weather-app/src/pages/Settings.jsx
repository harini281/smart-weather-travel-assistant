import {

  useState,
  useEffect

} from "react";

import Layout from "../components/Layout";

import "../App.css";

export default function Settings() {

  // STATES

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

  // SAVE SETTINGS

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

  // SAVE PROFILE

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

            ⚙ Settings

          </h1>

          <p>

            Manage your profile,
            language, theme and
            weather preferences

          </p>

        </div>

        {/* PROFILE CARD */}

        <div className="settings-card">

          <h2>

            👤 Profile Settings

          </h2>

          <div className="settings-form">

            <input

              type="text"

              placeholder="Username"

              value={username}

              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }

            />

            <input

              type="email"

              placeholder="Email"

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

            🎨 Theme Settings

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

            🌐 Language

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

            🔔 Notifications

          </h2>

          <div className="toggle-group">

            <div className="toggle-item">

              <span>

                Weather Notifications

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

                Travel Alerts

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

          💾 Save Settings

        </button>

      </div>

    </Layout>

  );

}