import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import "../App.css";

export default function History() {

  // STATES

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({

      city: "",

      temperature: "",

      condition: ""

    });

  // FETCH HISTORY

  const fetchHistory = async () => {

    try {

      const response =
        await fetch(
          "http://127.0.0.1:8000/weather"
        );

      if (!response.ok) {

        throw new Error(
          "Failed to fetch history"
        );

      }

      const data =
        await response.json();

      setHistory(data);

    } catch (err) {

      setError(
        err.message
      );

    }

    setLoading(false);

  };

  // INITIAL LOAD

  useEffect(() => {

    fetchHistory();

  }, []);

  // DELETE RECORD

  const deleteHistory =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this weather history?"
        );

      if (!confirmDelete) return;

      try {

        await fetch(

          `http://127.0.0.1:8000/weather/${id}`,

          {

            method: "DELETE"

          }

        );

        // REFRESH

        fetchHistory();

      } catch (err) {

        alert(
          "Delete failed"
        );

      }

    };

  // START EDIT

  const startEdit = (item) => {

    setEditingId(item.id);

    setEditData({

      city: item.city,

      temperature:
        item.temperature,

      condition:
        item.condition

    });

  };

  // UPDATE RECORD

  const updateHistory =
    async (id) => {

      // VALIDATION

      if (
        !editData.city ||
        !editData.temperature ||
        !editData.condition
      ) {

        alert(
          "All fields required"
        );

        return;

      }

      try {

        await fetch(

          `http://127.0.0.1:8000/weather/${id}?city=${editData.city}&temperature=${editData.temperature}&condition=${editData.condition}`,

          {

            method: "PUT"

          }

        );

        setEditingId(null);

        fetchHistory();

      } catch (err) {

        alert(
          "Update failed"
        );

      }

    };

  return (

    <Layout>

      <div className="history-page">

        {/* HEADER */}

        <div className="history-header">

          <h1>

            🕘 Weather History

          </h1>

          <p>

            View, update and delete
            previous weather searches

          </p>

        </div>

        {/* ERROR */}

        {error && (

          <div className="history-error">

            ❌ {error}

          </div>

        )}

        {/* LOADING */}

        {loading && (

          <div className="history-loading">

            ⏳ Loading history...

          </div>

        )}

        {/* HISTORY GRID */}

        <div className="history-grid">

          {history.map((item) => (

            <div
              key={item.id}
              className="history-card"
            >

              {/* EDIT MODE */}

              {editingId === item.id ? (

                <>

                  <input

                    value={editData.city}

                    onChange={(e) =>
                      setEditData({

                        ...editData,

                        city:
                          e.target.value

                      })
                    }

                    placeholder="City"

                  />

                  <input

                    value={
                      editData.temperature
                    }

                    onChange={(e) =>
                      setEditData({

                        ...editData,

                        temperature:
                          e.target.value

                      })
                    }

                    placeholder="Temperature"

                  />

                  <input

                    value={
                      editData.condition
                    }

                    onChange={(e) =>
                      setEditData({

                        ...editData,

                        condition:
                          e.target.value

                      })
                    }

                    placeholder="Condition"

                  />

                  <div className="history-actions">

                    <button
                      className="save-btn"
                      onClick={() =>
                        updateHistory(
                          item.id
                        )
                      }
                    >

                      💾 Save

                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        setEditingId(null)
                      }
                    >

                      ❌ Cancel

                    </button>

                  </div>

                </>

              ) : (

                <>

                  {/* WEATHER INFO */}

                  <h2>

                    📍 {item.city}

                  </h2>

                  <h1>

                    🌡 {item.temperature}°C

                  </h1>

                  <p>

                    ☁ {item.condition}

                  </p>

                  {/* ACTIONS */}

                  <div className="history-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        startEdit(item)
                      }
                    >

                      ✏ Edit

                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteHistory(
                          item.id
                        )
                      }
                    >

                      🗑 Delete

                    </button>

                  </div>

                </>

              )}

            </div>

          ))}

        </div>

      </div>

    </Layout>

  );

}