import "./Home.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    icon: "🕳️",
    label: "Potholes",
    desc: "Road surface damage",
  },
  {
    icon: "🗑️",
    label: "Garbage",
    desc: "Waste & dumping sites",
  },
  {
    icon: "💡",
    label: "Street Lights",
    desc: "Lighting outages",
  },
  {
    icon: "🚰",
    label: "Water Leakage",
    desc: "Pipe & supply issues",
  },
  {
    icon: "🚦",
    label: "Traffic Signals",
    desc: "Signal malfunctions",
  },
  {
    icon: "🌳",
    label: "Public Property",
    desc: "Infrastructure damage",
  },
];

const stats = [
  {
    value: "500+",
    label: "Issues Reported",
  },
  {
    value: "320+",
    label: "Issues Resolved",
  },
  {
    value: "75+",
    label: "Workers Assigned",
  },
  {
    value: "1K+",
    label: "Citizens Registered",
  },
];

const issues = [
  {
    title: "Pothole at Kukatpally Main Road",
    location: "Kukatpally, Hyderabad",
    status: "progress",
    label: "In Progress",
  },
  {
    title: "Garbage Dumping Near Bus Stop",
    location: "Ameerpet, Hyderabad",
    status: "reported",
    label: "Reported",
  },
  {
    title: "Streetlight Out on NH-65",
    location: "Miyapur, Hyderabad",
    status: "resolved",
    label: "Resolved",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img
            src={logo}
            alt="FixMyCity"
            className="logo-img"
          />
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/issues">Issues</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

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
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          Smart Civic Reporting Platform
        </div>

        <h1>
          Making Cities <em>Better</em>
          <br />
          Together
        </h1>

        <p>
          Report potholes, garbage dumps, streetlight failures,
          water leaks and other public issues — straight to the
          people who fix them.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/report")}
          >
            Report an Issue →
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/issues")}
          >
            View Issues
          </button>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        {stats.map((s) => (
          <div
            className="stat-item"
            key={s.label}
          >
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="categories">
        <p className="section-label">
          What can you report?
        </p>

        <h2 className="section-title">
          Issue Categories
        </h2>

        <div className="category-grid">
          {categories.map((c) => (
            <div
              className="card"
              key={c.label}
            >
              <div className="card-icon">
                {c.icon}
              </div>

              <div>
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Issues */}
      <section className="recent-issues">
        <div className="issues-header">
          <div>
            <p className="section-label">
              Live updates
            </p>

            <h2
              className="section-title"
              style={{ marginBottom: 0 }}
            >
              Recent Issues
            </h2>
          </div>

          <a
            href="/issues"
            className="view-all-link"
          >
            View all issues →
          </a>
        </div>

        <div className="issues-list">
          {issues.map((issue) => (
            <div
              className="issue-card"
              key={issue.title}
            >
              <div className="issue-info">
                <span
                  className={`issue-dot ${issue.status}`}
                />

                <div>
                  <div className="issue-title">
                    {issue.title}
                  </div>

                  <div className="issue-meta">
                    {issue.location}
                  </div>
                </div>
              </div>

              <span
                className={`status-badge status-${issue.status}`}
              >
                {issue.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        © 2026 <strong>FixMyCity</strong> — Smart Civic
        Reporting Platform
      </footer>
    </div>
  );
}

export default Home;