import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const userEmail =
    localStorage.getItem("userEmail");

  const logout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
    window.location.reload();
  };

  const avatarLetter =
    userEmail?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="navbar">

      <div className="logo-container">
        <Link to="/">
          <img
            src={logo}
            alt="FixMyCity"
            className="logo-img"
          />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/issues">Issues</Link>

        {userEmail && (
          <Link to="/my-reports">
            My Reports
          </Link>
        )}

        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {!userEmail ? (

        <div className="auth-buttons">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      ) : (

        <div className="user-section">

          <div className="user-avatar">
            {avatarLetter}
          </div>

          <span className="user-email">
            {userEmail}
          </span>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      )}

    </nav>
  );
}

export default Navbar;