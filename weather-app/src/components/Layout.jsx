import { useState } from "react";

import {
  Link
} from "react-router-dom";

export default function Layout({
  children
}) {

  const [open,
    setOpen] =
    useState(false);

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #000b2e, #1a1b4b)",
        color: "white",
      }}
    >

      {/* HEADER */}

      <header
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          padding: "20px",
          background: "#10182f",
        }}
      >

        <h1>
          ☁️ WeatherAI
        </h1>

        <button
          onClick={() =>
            setOpen(!open)
          }
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >

          ☰

        </button>

      </header>

      {/* SIDEBAR */}

      {open && (

        <div
          style={{
            background: "#111a35",
            padding: "20px",
            display: "flex",
            flexDirection:
              "column",
            gap: "15px",
          }}
        >

          <Link to="/">
            Home
          </Link>

          <Link to="/travel">
            Travel
          </Link>

          <Link to="/agent">
            Agent
          </Link>

          <Link to="/maps">
            Maps
          </Link>

          <Link to="/forecast">
            Forecast
          </Link>

        </div>
      )}

      {/* CONTENT */}

      <main
        style={{
          padding: "20px",
        }}
      >

        {children}

      </main>

    </div>
  );
}