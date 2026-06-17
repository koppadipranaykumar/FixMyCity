import { useEffect, useState } from "react";
import axios from "axios";
import "./Assignments.css";
import API_BASE_URL from "../../config/api";
interface Issue {
  id: number;
  title: string;
  category: string;
  location: string;
  status: string;
  assignedWorker?: string;
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
  "Reported":   { label: "Reported",    cls: "reported" },
  "In Progress":{ label: "In Progress", cls: "progress" },
  "Resolved":   { label: "Resolved",    cls: "resolved" },
};

// Steps: Reported → In Progress → Resolved
// Returns array of CSS class for each of 3 lifecycle dots
function getLifecycleDots(status: string): string[] {
  if (status === "Reported")   return ["done", "", ""];
  if (status === "In Progress") return ["done", "active-progress", ""];
  if (status === "Resolved")   return ["done", "done", "active-resolved"];
  return ["", "", ""];
}

const ALL = "All";

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// Deterministic avatar color per worker name
const AVATAR_COLORS = [
  "#1d4ed8", "#7c3aed", "#0891b2", "#059669",
  "#d97706", "#dc2626", "#db2777",
];
function avatarColor(name: string | undefined) {
  if (!name) return "#64748b";
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Assignments() {
  const [assignments, setAssignments] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(ALL);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/issues`);
      const assignedIssues = response.data.filter(
        (issue: Issue) => issue.assignedWorker
      );
      setAssignments(assignedIssues);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((issue) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (issue.title ?? "").toLowerCase().includes(query) ||
      (issue.assignedWorker ?? "").toLowerCase().includes(query) ||
      (issue.location ?? "").toLowerCase().includes(query);
    const matchesStatus =
      filterStatus === ALL || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total:      assignments.length,
    inProgress: assignments.filter((a) => a.status === "In Progress").length,
    resolved:   assignments.filter((a) => a.status === "Resolved").length,
  };

  const statuses = [ALL, "Reported", "In Progress", "Resolved"];

  return (
    <div className="assignments-page">

      {/* ── Header ── */}
      <div className="asg-header">
        <h1>Assignments</h1>
        <p>Issues currently assigned to field workers</p>
      </div>

      {/* ── Stats ── */}
      <div className="asg-stats">
        <div className="asg-stat-pill total">
          <span className="asg-stat-num">{counts.total}</span>
          <span className="asg-stat-lbl">Total Assigned</span>
        </div>
        <div className="asg-stat-pill progress">
          <span className="asg-stat-num">{counts.inProgress}</span>
          <span className="asg-stat-lbl">In Progress</span>
        </div>
        <div className="asg-stat-pill resolved">
          <span className="asg-stat-num">{counts.resolved}</span>
          <span className="asg-stat-lbl">Resolved</span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="asg-filters">
        <div className="asg-search-box">
          <span className="asg-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search worker, issue or area…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="asg-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <div className="asg-filter-chips">
          {statuses.map((s) => (
            <button
              key={s}
              className={`asg-chip ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="asg-results-count">
        {loading
          ? "Loading…"
          : `${filteredAssignments.length} assignment${filteredAssignments.length !== 1 ? "s" : ""} found`}
      </p>

      {/* ── Content ── */}
      {loading ? (
        <div className="asg-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="asg-skeleton-card" />
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="asg-empty">
          <div className="asg-empty-icon">📋</div>
          <span>No results</span>
          <p>
            {assignments.length === 0
              ? "No issues have been assigned to a field worker yet."
              : "No assignments match your current search or filter."}
          </p>
        </div>
      ) : (
        <div className="asg-grid">
          {filteredAssignments.map((issue) => {
            const sc = statusConfig[issue.status] ?? { label: issue.status, cls: "reported" };
            const dots = getLifecycleDots(issue.status);
            const color = avatarColor(issue.assignedWorker);

            return (
              <div className="asg-card" key={issue.id}>

                {/* Top row: lifecycle bar + category */}
                <div className="asg-card-top">
                  <div className="asg-lifecycle">
                    {dots.map((cls, i) => (
                      <div key={i} className={`asg-lifecycle-step ${cls}`} />
                    ))}
                  </div>
                  <div className="asg-cat-badge">
                    <span>{categoryIcon[issue.category] ?? "•"}</span>
                    <span>{issue.category}</span>
                  </div>
                </div>

                {/* Body: title + location */}
                <div className="asg-card-body">
                  <div className="asg-card-title">{issue.title ?? "Untitled Issue"}</div>
                  <div className="asg-card-meta">
                    <span>📍</span>
                    <span>{issue.location ?? "Location not specified"}</span>
                  </div>
                </div>

                {/* Footer: worker + status */}
                <div className="asg-card-footer">
                  <div className="asg-worker-cell">
                    <span className="asg-avatar" style={{ background: color }}>
                      {getInitials(issue.assignedWorker)}
                    </span>
                    <span className="asg-worker-name">
                      {issue.assignedWorker ?? "Unassigned"}
                    </span>
                  </div>
                  <span className={`asg-status ${sc.cls}`}>{sc.label}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default Assignments;