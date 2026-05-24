import { useState } from "react";

import "../App.css";

export default function SearchBar({

  onSearch,

  onLocationClick,

  placeholder = "Search city, zip code, landmark...",

  loading = false,

  locLoading = false,

}) {

  const [input, setInput] =
    useState("");

  const [error, setError] =
    useState("");

  // SUBMIT

  const handleSubmit = (e) => {

    e.preventDefault();

    // VALIDATION

    if (!input.trim()) {

      setError(
        "Please enter a location"
      );

      return;

    }

    setError("");

    onSearch(input.trim());

  };

  return (

    <div className="searchbar-wrapper">

      {/* SEARCH FORM */}

      <form
        onSubmit={handleSubmit}
        className="searchbar-form"
      >

        {/* INPUT */}

        <div className="search-input-container">

          <span className="search-icon">

            🔍

          </span>

          <input

            value={input}

            onChange={(e) =>
              setInput(e.target.value)
            }

            placeholder={placeholder}

            disabled={loading}

            className="search-input"
          />

        </div>

        {/* SEARCH BUTTON */}

        <button

          type="submit"

          disabled={
            loading || !input.trim()
          }

          className="search-btn"
        >

          {loading
            ? "⏳ Loading..."
            : "Search"}

        </button>

        {/* LOCATION BUTTON */}

        {onLocationClick && (

          <button

            type="button"

            onClick={onLocationClick}

            disabled={locLoading}

            className="location-btn"
          >

            {locLoading
              ? "⏳"
              : "📍"}

          </button>

        )}

      </form>

      {/* ERROR */}

      {error && (

        <div className="search-error">

          ❌ {error}

        </div>

      )}

    </div>

  );

}