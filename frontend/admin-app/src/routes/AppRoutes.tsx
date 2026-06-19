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
import Login from "../pages/Login/Login";

import AdminLayout from "../layouts/AdminLayout";

function AppRoutes() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Admin Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Admin Pages */}
        <Route element={<AdminLayout />}>

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

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;