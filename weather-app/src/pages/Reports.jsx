import {

  Link,
  useNavigate

} from "react-router-dom";

import {

  useState

} from "react";

import "../App.css";

function Register() {

  const navigate =
    useNavigate();

  // STATES

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // REGISTER

  const handleRegister = (
    e
  ) => {

    e.preventDefault();

    // VALIDATION

    if (

      !username ||
      !email ||
      !password ||
      !confirmPassword

    ) {

      setError(
        "Please fill all fields"
      );

      return;

    }

    // PASSWORD CHECK

    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;

    }

    setError("");

    setLoading(true);

    // SAVE USER

    setTimeout(() => {

      localStorage.setItem(
        "username",
        username
      );

      localStorage.setItem(
        "userEmail",
        email
      );

      alert(
        "Account Created Successfully 🚀"
      );

      navigate("/");

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

          🌩

        </div>

        {/* TITLE */}

        <h1>

          Create Account

        </h1>

        <p>

          Join the AI Weather
          Travel Platform

        </p>

        {/* ERROR */}

        {error && (

          <div className="auth-error">

            ❌ {error}

          </div>

        )}

        {/* FORM */}

        <form
          onSubmit={handleRegister}
          className="auth-form"
        >

          {/* USERNAME */}

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

          {/* CONFIRM PASSWORD */}

          <input

            type="password"

            placeholder="Confirm password"

            value={confirmPassword}

            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }

          />

          {/* BUTTON */}

          <button
            type="submit"
          >

            {loading
              ? "⏳ Creating..."
              : "✨ Create Account"}

          </button>

        </form>

        {/* LOGIN */}

        <div className="auth-links">

          <p className="auth-text">

            Already have an account?

          </p>

          <Link
            to="/"
            className="create-account-btn"
          >

            🔐 Back To Login

          </Link>

        </div>

      </div>

    </div>

  );

}

export default Register;