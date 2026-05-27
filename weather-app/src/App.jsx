import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import TravelPlanner from "./pages/TravelPlanner";
import Agent from "./pages/Agent";
import Maps from "./pages/Maps";
import Forecast from "./pages/Forecast";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Settings from "./pages/Settings";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/travel"
          element={<TravelPlanner />}
        />

        <Route
          path="/agent"
          element={<Agent />}
        />

        <Route
          path="/maps"
          element={<Maps />}
        />

        <Route
          path="/forecast"
          element={<Forecast />}
        />

        

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>

  );

}