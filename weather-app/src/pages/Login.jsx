import { Link, useNavigate } from "react-router-dom";

import "../App.css";

function Login() {

  const navigate = useNavigate();

  const handleLogin = () => {

    alert("Login Successful 🚀");

    navigate("/dashboard");

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>
          ☁ Weather Platform
        </h1>

        <p>
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Enter email"
        />

        <input
          type="password"
          placeholder="Enter password"
        />

        <button
          onClick={handleLogin}
        >
          Login
        </button>

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

  );

}

export default Login;