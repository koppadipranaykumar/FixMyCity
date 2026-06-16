import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

function CitizenLayout() {
  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default CitizenLayout;