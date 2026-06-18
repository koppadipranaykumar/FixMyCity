import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Issues.css";
import logo from "../../assets/logo.png";
import API_BASE_URL from "../../config/api";

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  assignedWorker?: string;
  resolutionNote?: string;
  proofImage?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}
const categoryIcon: Record<string, string> = {
  "Potholes":        "🕳️",
  "Garbage":         "🗑️",
  "Street Lights":   "💡",
  "Water Leakage":   "🚰",
  "Traffic Signals": "🚦",
  "Public Property": "🌳",
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  "Reported":    { label: "Reported",    cls: "reported" },
  "In Progress": { label: "In Progress", cls: "progress" },
  "Resolved":    { label: "Resolved",    cls: "resolved" },
};

const ALL = "All";

function Issues() {
  const navigate = useNavigate();
  const [issues, setIssues]           = useState<Issue[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState(ALL);
  const [filterCategory, setFilterCategory] = useState(ALL);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/issues`)
      .then((r) => { setIssues(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Helper utility function to parse dynamic file location paths properly
  const getFullImageUrl = (pathString: string | undefined) => {
    if (!pathString) return "https://placehold.co/600x400?text=No+Image+Available";
    if (pathString.startsWith("uploads/") || pathString.startsWith("/uploads/")) {
      const cleanPath = pathString.startsWith("/") ? pathString.substring(1) : pathString;
      return `${API_BASE_URL}/${cleanPath}`;
    }
    return `${API_BASE_URL}/uploads/${pathString}`;
  };

  const categories = [ALL, ...Array.from(new Set(issues.map((i) => i.category)))];
  const statuses   = [ALL, "Reported", "In Progress", "Resolved"];

  const filtered = issues.filter((issue) => {
    const matchSearch = (issue.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
                        (issue.location ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus   = filterStatus === ALL   || issue.status === filterStatus;
    const matchCategory = filterCategory === ALL || issue.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const counts = {
    total:      issues.length,
    reported:   issues.filter((i) => i.status === "Reported").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved:   issues.filter((i) => i.status === "Resolved").length,
  };

  const openMap = (issue: Issue) => {
    if (issue.latitude != null && issue.longitude != null) {
      window.open(`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps?q=${encodeURIComponent(issue.location)}`, "_blank");
    }
  };
  
  return (
    <div className="issues-page">

      {/* Header */}
      <div className="issues-header">
        <div>
          <h1>Civic Issues</h1>
          <p>Browse and track all reported issues across the city</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="issues-stats">
        <div className="stat-pill total">
          <span className="stat-num">{counts.total}</span>
          <span className="stat-lbl">Total</span>
        </div>
        <div className="stat-pill reported">
          <span className="stat-num">{counts.reported}</span>
          <span className="stat-lbl">Reported</span>
        </div>
        <div className="stat-pill progress">
          <span className="stat-num">{counts.inProgress}</span>
          <span className="stat-lbl">In Progress</span>
        </div>
        <div className="stat-pill resolved">
          <span className="stat-num">{counts.resolved}</span>
          <span className="stat-lbl">Resolved</span>
        </div>
      </div>

      {/* Filters */}
      <div className="issues-filters">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search by title or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="filter-chips">
          {statuses.map((s) => (
            <button
              key={s}
              className={`chip ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          className="category-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === ALL ? "All Categories" : `${categoryIcon[c] ?? ""} ${c}`}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="results-count">
        {loading ? "Loading…" : `${filtered.length} issue${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {/* Cards Grid */}
      {loading ? (
        <div className="issues-loading">
          {[1,2,3].map((n) => <div key={n} className="skeleton-card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="issues-empty">
          <span>🔍</span>
          <p>No issues match your filters.</p>
          <button onClick={() => { setSearch(""); setFilterStatus(ALL); setFilterCategory(ALL); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="issues-grid">
          {filtered.map((issue) => {
            const sc = statusConfig[issue.status] ?? { label: issue.status, cls: "reported" };
            return (
              <div className="issue-card" key={issue.id}>

                <img
                  src={getFullImageUrl(issue.imageUrl)}
                  alt={issue.title}
                  className="issue-image"
                  onError={(e) => { 
                    e.currentTarget.onerror = null; // ✨ Breaks infinite loop immediately
                    e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available"; 
                  }}
                />

                <div className="issue-card-top">
                  <div className="issue-cat-badge">
                    <span>{categoryIcon[issue.category] ?? "•"}</span>
                    <span>{issue.category}</span>
                  </div>
                  <span className={`issue-status ${sc.cls}`}>{sc.label}</span>
                </div>

                <h2 className="issue-title">{issue.title}</h2>
                <p className="issue-desc">{issue.description}</p>

                <div className="issue-meta">
                  <span className="issue-location">📍 {issue.location}</span>
                </div>

                <div className="issue-actions">
                  <button className="action-btn map-btn" onClick={() => openMap(issue)}>
                    🗺 View Map
                  </button>
                  <button
                    className="action-btn details-btn"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    Details →
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
           
      {/* ── Modal Details View ── */}
      {selectedIssue && (
        <div
          className="issue-modal-overlay"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="issue-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedIssue.title}
              </h2>

              <button
                className="modal-close"
                onClick={() => setSelectedIssue(null)}
              >
                ✕
              </button>
            </div>

            <img
              src={getFullImageUrl(selectedIssue.imageUrl)}
              alt={selectedIssue.title}
              className="modal-image"
              onError={(e) => { 
                e.currentTarget.onerror = null; // ✨ Breaks loop inside modal
                e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available"; 
              }}
            />

            <div className="modal-info">
              <div><span>Category</span>{selectedIssue.category}</div>
              <div><span>Status</span>{selectedIssue.status}</div>
              <div><span>Location</span>{selectedIssue.location}</div>
            </div>

            <div className="modal-section">
              <h4>Description</h4>
              <p>{selectedIssue.description}</p>
            </div>
            {selectedIssue.assignedWorker && (
              <div className="modal-section">
                <h4>Assigned Worker</h4>
                <p>{selectedIssue.assignedWorker}</p>
              </div>
            )}

            {selectedIssue.resolutionNote && (
              <div className="modal-section">
                <h4>Resolution Note</h4>
                <p>{selectedIssue.resolutionNote}</p>
              </div>
            )}
            {selectedIssue.proofImage && (
              <div className="modal-section">
                <h4>Completed Work Proof</h4>
                <img
                  src={getFullImageUrl(selectedIssue.proofImage)}
                  alt="Completed Work"
                  className="completed-proof-image"
                  onError={(e) => { 
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available"; 
                  }}
                />
              </div>
            )}

            <button
              className="modal-map-btn"
              onClick={() => openMap(selectedIssue)}
            >
              Open Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Issues;