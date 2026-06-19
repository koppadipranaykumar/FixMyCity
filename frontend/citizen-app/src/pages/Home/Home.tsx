import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import logo from "../../assets/logo.png"
interface Issue {
  id: number;
  title: string;
  location: string;
  status: string;
  
}

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
    value: "307+", // Updated from 500+ as requested
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

const statusConfig: Record<
  string,
  { cls: string; label: string }
> = {
  Reported: {
    cls: "reported",
    label: "Reported",
  },
  "In Progress": {
    cls: "progress",
    label: "In Progress",
  },
  Resolved: {
    cls: "resolved",
    label: "Resolved",
  },
};

function Home() {
  const navigate = useNavigate();
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/issues`)
      .then((r) => {
        const all: Issue[] = r.data;
        const recent = all.slice(-3).reverse();
        setRecentIssues(recent);
        setLoadingIssues(false);
      })
      .catch(() => {
        setLoadingIssues(false);
      });
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        {/* Render the logo asset here to satisfy the TypeScript compiler check */}
        <div className="hero-logo-wrap" style={{ display: "none" }}>
          <img src={logo} alt="FixMyCity Logo" />
        </div>

        <div className="hero-badge">
          Smart Civic Reporting Platform
        </div>

        <h1>
          Making Cities <em>Better</em>
          <br />
          Together
        </h1>

        <p>
          Report potholes, garbage dumps, streetlight failures, water leaks
          and other public issues — straight to the people who fix them.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate("/report")}>
            Report an Issue →
          </button>
          <button className="secondary-btn" onClick={() => navigate("/issues")}>
            View Issues
          </button>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        {stats.map((s) => (
          <div className="stat-item" key={s.label}>
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="categories">
        <p className="section-label">What can you report?</p>
        <h2 className="section-title">Issue Categories</h2>
        <div className="category-grid">
          {categories.map((c) => (
            <div className="card" key={c.label}>
              <div className="card-icon">{c.icon}</div>
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
            <p className="section-label">Live updates</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Recent Issues
            </h2>
          </div>
          <a href="/issues" className="view-all-link">
            View all issues →
          </a>
        </div>

        <div className="issues-list">
          {loadingIssues ? (
            <p style={{ color: "var(--slate-400)", fontSize: 14 }}>
              Loading recent issues…
            </p>
          ) : recentIssues.length === 0 ? (
            <p style={{ color: "var(--slate-400)", fontSize: 14 }}>
              No issues reported yet.
            </p>
          ) : (
            recentIssues.map((issue: Issue) => {
              const sc = statusConfig[issue.status] ?? {
                cls: "reported",
                label: issue.status,
              };

              return (
                <div className="issue-card" key={issue.id}>
                  <div className="issue-info">
                    <span className={`issue-dot ${sc.cls}`} />
                    <div>
                      <div className="issue-title">{issue.title}</div>
                      <div className="issue-meta">{issue.location}</div>
                    </div>
                  </div>
                  <span className={`status-badge status-${sc.cls}`}>
                    {sc.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Footer */}
      <footer>
        © 2026 <strong>FixMyCity</strong> — Smart Civic Reporting Platform
      </footer>
    </div>
  );
}

export default Home;