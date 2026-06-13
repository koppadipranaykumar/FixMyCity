// src/components/Topbar/Topbar.tsx

import "./Topbar.css";

function Topbar() {
  return (
    <div className="topbar">
      <h3>Admin Dashboard</h3>

      <button className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Topbar;