import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        fullName, email, phone, password,
      });
      setMessage(response.data);
      setIsError(false);
      if (response.data === "Registration Successful") {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch {
      setMessage("Registration failed. Please try again.");
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
          <h2>Report issues.<br />Drive change.</h2>
          <p>Create your account and start contributing to a cleaner, safer city for everyone.</p>
          <div className="auth-steps">
            <div className="auth-step"><span className="step-num">1</span><span>Create your account</span></div>
            <div className="auth-step"><span className="step-num">2</span><span>Report civic issues near you</span></div>
            <div className="auth-step"><span className="step-num">3</span><span>Track resolution progress</span></div>
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
            <h1>Create account</h1>
            <p>Join the FixMyCity community today</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="field-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {message && (
            <div className={`auth-message ${isError ? "error" : "success"}`}>
              {isError ? "⚠ " : "✓ "}{message}
            </div>
          )}

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;