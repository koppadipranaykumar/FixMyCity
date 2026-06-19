import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./AdminNavbar.css";

function AdminNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Issues", path: "/issues" },
    { name: "Workers", path: "/workers" },
    { name: "Assignments", path: "/assignments" },
    { name: "Analytics", path: "/analytics" },
  ];

  // Auto-collapse mobile tray panel when transitioning to another page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "/login";
  };

  return (
    <nav className="admin-navbar">
      {/* LEFT SECTION: Toggle Button & Branding Logo */}
      <div className="admin-navbar-left">
        <button
          className="admin-mobile-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

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
      </div>

      {/* CENTER SECTION: Navigation Links Panel */}
      <div className={`admin-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
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

      {/* RIGHT SECTION: Logout Button */}
      <div className="admin-navbar-right">
        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;