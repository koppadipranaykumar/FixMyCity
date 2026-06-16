import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ReportIssue from "../pages/ReportIssue/ReportIssue";
import Issues from "../pages/Issues/Issues";
import MyReports from "../pages/MyReports/MyReports";
import CitizenLayout from "../layouts/CitizenLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default redirect (optional) */}
		<Route element={<CitizenLayout />}>
		  <Route path="/" element={<Home />} />
		  <Route path="/report" element={<ReportIssue />} />
		  <Route path="/issues" element={<Issues />} />
		</Route>

        {/* Citizen layout (navbar applied here) */}
        <Route element={<CitizenLayout />}>
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/issues" element={<Issues />} />
		<Route path="/my-reports"element={<MyReports />}/>
        </Route>
        {/* Auth pages (no navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;