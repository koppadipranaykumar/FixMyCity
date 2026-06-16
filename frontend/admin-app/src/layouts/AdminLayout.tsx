import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar/AdminNavbar";

function AdminLayout() {
  return (
    <>
      <AdminNavbar />

      <div style={{ paddingTop: "70px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;