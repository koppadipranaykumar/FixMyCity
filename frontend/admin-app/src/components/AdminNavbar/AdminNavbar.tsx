import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./AdminNavbar.css";

function AdminNavbar() {
  const location = useLocation();

  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Issues", path: "/issues" },
    { name: "Workers", path: "/workers" },
    { name: "Assignments", path: "/assignments" },
    { name: "Analytics", path: "/analytics" },
  ];

  const handleLogout = () => {

    localStorage.removeItem(
      "adminLoggedIn"
    );

    window.location.href =
      "/login";
  };

  return (
    <nav className="admin-navbar">
      {/* Logo Section */}
      <Link to="/dashboard" className="admin-logo">
        <img
          src={logo}
          alt="FixMyCity Logo"
          className="admin-logo-img"
        />

        <span className="admin-logo-text">
          Admin
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="admin-links">
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`admin-link ${
              location.pathname === menu.path ? "active" : ""
            }`}
          >
            {menu.name}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <button
        className="admin-logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;