// src/components/Sidebar/Sidebar.tsx

import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Issues", path: "/issues", icon: "📋" },
    { name: "Workers", path: "/workers", icon: "👷" },
    { name: "Assignments", path: "/assignments", icon: "📌" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">FixMyCity Admin</h2>

      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={
            location.pathname === item.path
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>{item.icon}</span>
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;