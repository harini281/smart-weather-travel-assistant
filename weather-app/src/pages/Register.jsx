import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");

const navigate = useNavigate();

  const handleRegister = () => {

    alert("Account Created Successfully!");

    navigate("/");

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>
          🌩 Create Account
        </h1>

        <p>
          Join the Weather Platform
        </p>

<input

  type="text"

  placeholder="Username"

  value={username}

  onChange={(e) =>
    setUsername(e.target.value)
  }
/>
        <input
          type="email"
          placeholder="Enter email"
        />

        <input
          type="password"
          placeholder="Enter password"
        />

        <button

  onClick={() => {

    localStorage.setItem(
      "username",
      username
    );

    navigate("/");

  }}
>

  Create Account

</button>

        <p className="auth-text">
          Already have an account?
        </p>

        <Link to="/">
          Back To Login
        </Link>

      </div>

    </div>

  );

}

export default Register;