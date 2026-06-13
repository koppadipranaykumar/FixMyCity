import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Issues from "../pages/Issues/Issues";
import Workers from "../pages/Workers/Workers";
import Assignments from "../pages/Assignments/Assignments";
import Analytics from "../pages/Analytics/Analytics";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
            />
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/issues"
          element={<Issues />}
        />

        <Route
          path="/workers"
          element={<Workers />}
        />

        <Route
          path="/assignments"
          element={<Assignments />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;