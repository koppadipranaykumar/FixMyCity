import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const userEmail = localStorage.getItem("userEmail");

  const logout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  const avatarLetter = userEmail?.charAt(0).toUpperCase() || "U";
  const displayName = userEmail?.split("@")[0] || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="FixMyCity" className="logo-img" />
        </Link>
      </div>

      {/* Nav Links */}
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/issues"
          className={`nav-link ${isActive("/issues") ? "active" : ""}`}
        >
          Issues
        </Link>

        <Link
          to="/report"
          className={`nav-link nav-link--highlight ${
            isActive("/report") ? "active" : ""
          }`}
        >
          <span className="plus-icon">+</span>
          Report Issue
        </Link>

        {userEmail && (
          <Link
            to="/my-reports"
            className={`nav-link ${
              isActive("/my-reports") ? "active" : ""
            }`}
          >
            My Reports
          </Link>
        )}

        <Link
          to="/contact"
          className={`nav-link ${isActive("/contact") ? "active" : ""}`}
        >
          Contact
        </Link>
      </div>

      {/* Right Section */}
      {!userEmail ? (
        <div className="auth-buttons">
          <button
            className="btn-ghost"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      ) : (
        <div className="user-section" ref={dropdownRef}>
          {/* Status Badge */}
          <div className="status-badge">
            <span className="status-dot" />
            Active
          </div>

          {/* User Pill */}
          <button
            className={`user-pill ${dropdownOpen ? "open" : ""}`}
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
          >
            <div className="avatar">{avatarLetter}</div>

            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-email">{userEmail}</span>
            </div>

            <svg
              className={`chevron ${dropdownOpen ? "rotate" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-avatar">{avatarLetter}</div>

                <div>
                  <p className="dropdown-name">{displayName}</p>
                  <p className="dropdown-email">{userEmail}</p>
                </div>
              </div>

              <div className="dropdown-divider" />

              <Link
                to="/my-reports"
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                My Reports
              </Link>

              <Link
                to="/report"
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Report an Issue
              </Link>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item danger"
                onClick={logout}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;