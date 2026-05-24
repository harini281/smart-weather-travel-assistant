import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import TravelPlanner from "./pages/TravelPlanner";
import Agent from "./pages/Agent";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/travel"
          element={<TravelPlanner />}
        />

        <Route
          path="/agent"
          element={<Agent />}
        />

      </Routes>

    </BrowserRouter>
  );
}