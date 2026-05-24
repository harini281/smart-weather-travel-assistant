import {

  useState

} from "react";

import {

  Link,
  useNavigate

} from "react-router-dom";

import "../App.css";

function Login() {

  const navigate =
    useNavigate();

  // STATES

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // LOGIN

  const handleLogin = async (
    e
  ) => {

    e.preventDefault();

    // VALIDATION

    if (
      !email ||
      !password
    ) {

      setError(
        "Please fill all fields"
      );

      return;

    }

    setLoading(true);

    setError("");

    // FAKE LOGIN DELAY

    setTimeout(() => {

      // SAVE USER

      localStorage.setItem(
        "username",
        email.split("@")[0]
      );

      localStorage.setItem(
        "userEmail",
        email
      );

      alert(
        "Login Successful 🚀"
      );

      navigate("/home");

      setLoading(false);

    }, 1500);

  };

  return (

    <div className="auth-container">

      {/* BACKGROUND */}

      <div className="auth-background">

        <div className="glow glow1"></div>

        <div className="glow glow2"></div>

      </div>

      {/* CARD */}

      <div className="auth-card">

        {/* LOGO */}

        <div className="auth-logo">

          ⛅

        </div>

        {/* TITLE */}

        <h1>

          WeatherAI Platform

        </h1>

        <p>

          Smart AI Travel Weather
          Assistant

        </p>

        {/* ERROR */}

        {error && (

          <div className="auth-error">

            ❌ {error}

          </div>

        )}

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          {/* EMAIL */}

          <input

            type="email"

            placeholder="Enter email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

          />

          {/* PASSWORD */}

          <input

            type="password"

            placeholder="Enter password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

          />

          {/* LOGIN BUTTON */}

          <button
            type="submit"
          >

            {loading
              ? "⏳ Logging in..."
              : "🚀 Login"}

          </button>

        </form>

        {/* LINKS */}

        <div className="auth-links">

          <Link
            to="/register"
            className="auth-link"
          >

            Don’t have an account?

          </Link>

          <Link
            to="/register"
            className="create-account-btn"
          >

            ✨ Create Account

          </Link>

        </div>

      </div>

    </div>

  );

}

export default Login;