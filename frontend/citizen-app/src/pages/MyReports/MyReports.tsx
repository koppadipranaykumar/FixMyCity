import { useEffect, useState } from "react";
import axios from "axios";
import "./MyReports.css";
import API_BASE_URL from "../../config/api";

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
}

const categoryIcon: Record<string, string> = {
  "Potholes": "🕳️",
  "Garbage": "🗑️",
  "Street Lights": "💡",
  "Water Leakage": "🚰",
  "Traffic Signals": "🚦",
  "Public Property": "🌳",
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  "Reported":    { label: "Reported",    cls: "reported" },
  "In Progress": { label: "In Progress", cls: "progress" },
  "Resolved":    { label: "Resolved",    cls: "resolved" },
};

function getLifecycleDots(status: string): string[] {
  if (status === "Reported")    return ["done", "", ""];
  if (status === "In Progress") return ["done", "active-progress", ""];
  if (status === "Resolved")    return ["done", "done", "active-resolved"];
  return ["", "", ""];
}

const ALL = "All";

function MyReports() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(ALL);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) { setLoading(false); return; }

    axios
      .get(`${API_BASE_URL}/api/issues/my-reports/${email}`)
      .then((res) => setIssues(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = issues.filter((issue) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (issue.title ?? "").toLowerCase().includes(q) ||
      (issue.description ?? "").toLowerCase().includes(q) ||
      (issue.location ?? "").toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === ALL || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total:      issues.length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved:   issues.filter((i) => i.status === "Resolved").length,
  };

  const statuses = [ALL, "Reported", "In Progress", "Resolved"];

  return (
    <div className="myreports-page">

      {/* ── Header ── */}
      <div className="mr-header">
        <h1>My Reports</h1>
        <p>Issues you've reported across the city</p>
      </div>

      {/* ── Stats ── */}
      <div className="mr-stats">
        <div className="mr-stat-pill total">
          <span className="mr-stat-num">{counts.total}</span>
          <span className="mr-stat-lbl">Total</span>
        </div>
        <div className="mr-stat-pill progress">
          <span className="mr-stat-num">{counts.inProgress}</span>
          <span className="mr-stat-lbl">In Progress</span>
        </div>
        <div className="mr-stat-pill resolved">
          <span className="mr-stat-num">{counts.resolved}</span>
          <span className="mr-stat-lbl">Resolved</span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="mr-filters">
        <div className="mr-search-box">
          <span className="mr-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search by title, description or area…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="mr-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <div className="mr-filter-chips">
          {statuses.map((s) => (
            <button
              key={s}
              className={`mr-chip ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="mr-results-count">
        {loading
          ? "Loading…"
          : `${filtered.length} report${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {/* ── Content ── */}
      {loading ? (
        <div className="mr-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="mr-skeleton-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mr-empty">
          <div className="mr-empty-icon">📝</div>
          <span>No reports yet</span>
          <p>
            {issues.length === 0
              ? "You haven't reported any issues yet. Help make your city better!"
              : "No reports match your current search or filter."}
          </p>
          {issues.length === 0 && (
            <button className="mr-empty-btn" onClick={() => window.location.href = "/report"}>
              + Report an Issue
            </button>
          )}
        </div>
      ) : (
        <div className="mr-grid">
          {filtered.map((issue) => {
            const sc = statusConfig[issue.status] ?? { label: issue.status, cls: "reported" };
            const dots = getLifecycleDots(issue.status);

            return (
              <div className="mr-card" key={issue.id}>

                {/* Top: category + status */}
                <div className="mr-card-top">
                  <div className="mr-cat-badge">
                    <span>{categoryIcon[issue.category] ?? "•"}</span>
                    <span>{issue.category ?? "General"}</span>
                  </div>
                  <span className={`mr-status ${sc.cls}`}>{sc.label}</span>
                </div>

                {/* Lifecycle bar */}
                <div className="mr-lifecycle">
                  {dots.map((cls, i) => (
                    <div key={i} className={`mr-lifecycle-step ${cls}`} />
                  ))}
                </div>

                {/* Body: title + description */}
                <div className="mr-card-body">
                  <div className="mr-card-title">{issue.title ?? "Untitled Issue"}</div>
                  {issue.description && (
                    <p className="mr-card-desc">{issue.description}</p>
                  )}
                </div>

                {/* Footer: location + ID */}
                <div className="mr-card-footer">
                  <div className="mr-card-meta">
                    <span>📍</span>
                    <span>{issue.location ?? "Location not specified"}</span>
                  </div>
                  <span className="mr-card-id">#{issue.id}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default MyReports;