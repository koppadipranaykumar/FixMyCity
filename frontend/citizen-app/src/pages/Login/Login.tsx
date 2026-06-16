import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
		const response = await axios.post(
		  "http://localhost:8080/api/auth/login",
		  {
		    email,
		    password
		  }
		);

		const result = response.data;

		if (result === "Login Successful") {

		  localStorage.setItem(
		    "userEmail",
		    email
		  );

		  window.location.href = "/";
		}
		else if (result === "User not found") {

		  setMessage(
		    "Account not found. Please register first."
		  );

		  setIsError(true);

		  setTimeout(() => {
		    navigate("/register");
		  }, 2000);
		}
		else {

		  setMessage(result);
		  setIsError(true);
		}
    } catch {
      setMessage("Invalid email or password. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <span className="auth-brand-icon">📍</span>
            <span className="auth-brand-name">FixMyCity</span>
          </div>
          <h2>Making cities better,<br />together.</h2>
          <p>Join thousands of citizens actively reporting and resolving civic issues across Hyderabad.</p>
          <div className="auth-stats">
            <div className="auth-stat"><strong>500+</strong><span>Issues Reported</span></div>
            <div className="auth-stat"><strong>320+</strong><span>Resolved</span></div>
            <div className="auth-stat"><strong>1K+</strong><span>Citizens</span></div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <div className="auth-card-header">
            <h1>Welcome back</h1>
            <p>Sign in to your FixMyCity account</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {message && (
            <div className={`auth-message ${isError ? "error" : "success"}`}>
              {isError ? "⚠ " : "✓ "}{message}
            </div>
          )}

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;