import {
  Link,
  useLocation
} from "react-router-dom";

import {
  useState
} from "react";

import "../App.css";

export default function Layout({
  children
}) {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const location =
    useLocation();

  return (

    <div className="layout-container">

      {/* SIDEBAR */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="sidebar-brand">

          <h1>☁️ WeatherAI</h1>

          <p>
            Smart Weather Platform
          </p>

        </div>

        {/* AI STATUS */}

        <div className="ai-status">

          🤖 AI System Active

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          {/* HOME */}

          <Link
            to="/home"
            className={
              location.pathname === "/home"
                ? "nav-link active-nav"
                : "nav-link"
            }
          >

            <span>🏠</span>
            Home

          </Link>

          {/* TRAVEL */}

          <Link
            to="/travel"
            className={
              location.pathname === "/travel"
                ? "nav-link active-nav"
                : "nav-link"
            }
          >

            <span>✈️</span>
            Travel

          </Link>

          {/* AGENT */}

          <Link
            to="/agent"
            className={
              location.pathname === "/agent"
                ? "nav-link active-nav"
                : "nav-link"
            }
          >

            <span>🤖</span>
            Agent

          </Link>

          {/* MAPS */}

          <Link
            to="/maps"
            className={
              location.pathname === "/maps"
                ? "nav-link active-nav"
                : "nav-link"
            }
          >

            <span>🗺️</span>
            Maps

          </Link>

          {/* FORECAST */}

          <Link
            to="/forecast"
            className={
              location.pathname === "/forecast"
                ? "nav-link active-nav"
                : "nav-link"
            }
          >

            <span>🌦️</span>
            Forecast

          </Link>

          {/* SETTINGS */}

          <Link
            to="/settings"
            className={
              location.pathname === "/settings"
                ? "nav-link active-nav"
                : "nav-link"
            }
          >

            <span>⚙️</span>
            Settings

          </Link>

        </nav>

        {/* LOGOUT */}

        <Link to="/">

          <button className="logout-btn">

            🚪 Logout

          </button>

        </Link>

      </aside>

      {/* MOBILE HEADER */}

      <div className="mobile-header">

        <h2>☁️ WeatherAI</h2>

        <button
          className="menu-btn"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >

          ☰

        </button>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="mobile-drawer">

          <div className="mobile-menu">

            <Link
              to="/home"
              className="nav-link"
            >
              🏠 Home
            </Link>

            <Link
              to="/travel"
              className="nav-link"
            >
              ✈️ Travel
            </Link>

            <Link
              to="/agent"
              className="nav-link"
            >
              🤖 Agent
            </Link>

            <Link
              to="/maps"
              className="nav-link"
            >
              🗺️ Maps
            </Link>

            <Link
              to="/forecast"
              className="nav-link"
            >
              🌦️ Forecast
            </Link>

            <Link
              to="/settings"
              className="nav-link"
            >
              ⚙️ Settings
            </Link>

          </div>

        </div>

      )}

      {/* MAIN CONTENT */}

      <main className="main-content">

        {children}

      </main>

      {/* MOBILE BOTTOM NAV */}

      <div className="mobile-bottom-nav">

        <Link to="/home">🏠</Link>

        <Link to="/travel">✈️</Link>

        <Link to="/agent">🤖</Link>

        <Link to="/maps">🗺️</Link>

        <Link to="/forecast">🌦️</Link>

      </div>

    </div>

  );

}