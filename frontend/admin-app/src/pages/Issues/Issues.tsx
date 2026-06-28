import { useEffect, useState } from "react";
import axios from "axios";
import "./Issues.css";
import API_BASE_URL from "../../config/api";

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  latitude?: number;
  longitude?: number;
  assignedWorker?: string;
  resolutionNote?: string;
}

interface IssueDetail extends Issue {
  imageUrl?: string;
  proofImage?: string;
}
interface Worker {
  id: number;
  name: string;
  phone: string;
  department: string;
  area: string;
  active: boolean;
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
  "Reported": { label: "Reported", cls: "reported" },
  "In Progress": { label: "In Progress", cls: "progress" },
  "Resolved": { label: "Resolved", cls: "resolved" },
};

const ALL = "All";

function Issues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(ALL);
  const [filterCategory, setFilterCategory] = useState(ALL);
  const [selectedIssue, setSelectedIssue] = useState<IssueDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  // loadingDetail tracks when a full issue detail (with images) is being fetched
  const [worker, setWorker] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const fetchIssues = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/issues`)
      .then((r) => { setIssues(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchIssues();
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/workers`);
      setWorkers(response.data);
    } catch (err) {
      console.error("Failed to fetch workers", err);
    }
  };

  // Show all active workers — no department filtering to avoid mismatch bugs
  const availableWorkers = workers.filter((w) => w.active);

  const assignWorker = async () => {
    if (!selectedIssue || !worker) {
      alert("Please select a worker");
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/api/issues/${selectedIssue.id}/assign`, {
        workerName: worker,
      });
      fetchIssues();
      setSelectedIssue((prev) =>
        prev ? { ...prev, assignedWorker: worker, status: "In Progress" } : null
      );
      alert("Worker assigned successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to assign worker");
    }
  };

  const resolveIssue = async () => {
    if (!selectedIssue) return;
    try {
      const formData = new FormData();
      formData.append("resolutionNote", resolutionNote);
      if (proofImage) formData.append("proofImage", proofImage);
      await axios.put(
        `${API_BASE_URL}/api/issues/${selectedIssue.id}/resolve-with-proof`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      fetchIssues();
      setSelectedIssue(null);
      alert("Issue resolved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to resolve issue");
    }
  };

  const categories = [ALL, ...Array.from(new Set(issues.map((i) => i.category)))];
  const statuses = [ALL, "Reported", "In Progress", "Resolved"];

  const filtered = issues.filter((issue) => {
    const matchSearch =
      (issue.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (issue.location ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === ALL || issue.status === filterStatus;
    const matchCategory = filterCategory === ALL || issue.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const counts = {
    total: issues.length,
    reported: issues.filter((i) => i.status === "Reported").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };

  const deleteIssue = async (id: number) => {
    if (!window.confirm("Delete this issue permanently?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/issues/${id}`);
      setIssues((prev) => prev.filter((i) => i.id !== id));
      setSelectedIssue(null);
    } catch (err) {
      console.error("Failed to delete issue", err);
    }
  };

  const openMap = (issue: Issue) => {
    if (issue.latitude != null && issue.longitude != null) {
      window.open(`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps?q=${encodeURIComponent(issue.location)}`, "_blank");
    }
  };

  const sc_selected = selectedIssue
    ? (statusConfig[selectedIssue.status] ?? { label: selectedIssue.status, cls: "reported" })
    : null;

  return (
    <div className="admin-issues-page">

      {/* Header */}
      <div className="issues-header">
        <div className="issues-header-text">
          <h1>Issues Management</h1>
          <p>View, manage and resolve all citizen-reported issues</p>
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
            placeholder="Search by title or location"
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

      {/* Table */}
      {loading ? (
        <div className="issues-table-wrap">
          {[1, 2, 3, 4].map((n) => <div key={n} className="skeleton-row" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="issues-empty">
          <span>No results</span>
          <p>No issues match your filters.</p>
          <button onClick={() => { setSearch(""); setFilterStatus(ALL); setFilterCategory(ALL); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="issues-table-wrap">
          <table className="issues-table">
            <thead>
              <tr>
                <th>ID</th>
                <th></th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue) => {
                const sc = statusConfig[issue.status] ?? { label: issue.status, cls: "reported" };
                return (
                  <tr key={issue.id}>
                    <td className="cell-id">#{issue.id}</td>
                    <td>
                      <img
                        src="/placeholder.jpg"
                        alt={issue.title}
                        className="table-thumb"
                      />
                    </td>
                    <td>
                      <div className="cell-title">{issue.title}</div>
                      <div className="cell-desc">{issue.description}</div>
                    </td>
                    <td>
                      <div className="issue-cat-badge">
                        <span>{categoryIcon[issue.category] ?? "•"}</span>
                        <span>{issue.category}</span>
                      </div>
                    </td>
                    <td className="cell-location">{issue.location}</td>
                    <td>
                      <span className={`issue-status ${sc.cls}`}>{sc.label}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="action-btn view-btn"
                          onClick={() => {
                            setSelectedIssue(issue as IssueDetail);
                            setWorker(issue.assignedWorker || "");
                            setResolutionNote(issue.resolutionNote || "");
                            setProofImage(null);
                            setLoadingDetail(true);
                            axios.get(`${API_BASE_URL}/api/issues/${issue.id}`)
                              .then((r) => setSelectedIssue(r.data))
                              .catch(() => {})
                              .finally(() => setLoadingDetail(false));
                          }}
                        >
                          View
                        </button>
                        <button className="action-btn delete-btn" onClick={() => deleteIssue(issue.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal: light, single-column, professional ── */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal-shell" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="modal-id-tag">#{selectedIssue.id}</span>
                <span className={`issue-status ${sc_selected?.cls}`}>{sc_selected?.label}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedIssue(null)}>✕</button>
            </div>

            <div className="modal-body">

              {/* Top: image + summary side by side */}
              <div className="modal-summary-row">
                {loadingDetail ? (
                  <div className="modal-thumb" style={{display:"flex",alignItems:"center",justifyContent:"center",background:"#f3f4f6",color:"#6b7280",fontSize:"0.85rem"}}>Loading…</div>
                ) : (
                  <img
                    src={selectedIssue.imageUrl?.startsWith("data:") ? selectedIssue.imageUrl : "/placeholder.jpg"}
                    alt={selectedIssue.title}
                    className="modal-thumb"
                  />
                )}
                <div className="modal-summary-text">
                  <div className="modal-cat-row">
                    <span>{categoryIcon[selectedIssue.category] ?? "•"}</span>
                    <span>{selectedIssue.category}</span>
                  </div>
                  <h2 className="modal-issue-title">{selectedIssue.title}</h2>
                  <p className="modal-issue-desc">{selectedIssue.description}</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="modal-meta-row">
                <div className="meta-item">
                  <span className="meta-key">Location</span>
                  <span className="meta-val">{selectedIssue.location}</span>
                </div>
                {selectedIssue.assignedWorker && (
                  <div className="meta-item">
                    <span className="meta-key">Worker</span>
                    <span className="meta-val">{selectedIssue.assignedWorker}</span>
                  </div>
                )}
                <button className="btn-map" onClick={() => openMap(selectedIssue)}>
                  Open on Map
                </button>
              </div>

              {selectedIssue.resolutionNote && (
                <div className="modal-resolution-box">
                  <span className="resolution-label">Resolution Notes</span>
                  <p>{selectedIssue.resolutionNote}</p>
                </div>
              )}

              <hr className="modal-divider" />

              {/* Proof images */}
              {(proofImage || selectedIssue.proofImage) && (
                <div className="action-block">
                  <p className="action-label">Proof Image</p>
                  {proofImage && (
                    <img src={URL.createObjectURL(proofImage)} alt="Proof Preview" className="proof-preview" />
                  )}
                  {selectedIssue.proofImage && !proofImage && (
                    <img src={selectedIssue.proofImage?.startsWith("data:") ? selectedIssue.proofImage : "/placeholder.jpg"} alt="Saved Proof" className="proof-preview" />
                  )}
                </div>
              )}

              {/* Assign Worker */}
              <div className="action-block">
                <p className="action-label">
                  Assign Worker
                  {availableWorkers.length === 0 && (
                    <span className="no-workers-hint"> — No active workers found</span>
                  )}
                </p>
                <div className="action-row">
                  <select
                    className="modal-select"
                    value={worker}
                    onChange={(e) => setWorker(e.target.value)}
                    disabled={selectedIssue.status !== "Reported"}
                  >
                    <option value="">Select a worker…</option>
                    {availableWorkers.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name} — {w.department} ({w.area})
                      </option>
                    ))}
                  </select>
                  <button
                    className="action-primary-btn"
                    disabled={selectedIssue.status !== "Reported"}
                    onClick={assignWorker}
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* Resolution */}
              <div className="action-block">
                <p className="action-label">Resolution Note</p>
                <textarea
                  className="modal-textarea"
                  placeholder="Describe what was done to fix the issue…"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  disabled={selectedIssue.status !== "In Progress"}
                />
              </div>

              {/* Proof upload */}
              <div className="action-block">
                <p className="action-label">Upload Proof Image</p>
                <label className="file-upload-label">
                  <span>Choose image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { if (e.target.files?.length) setProofImage(e.target.files[0]); }}
                  />
                </label>
                {proofImage && <span className="file-name-hint">{proofImage.name}</span>}
              </div>

            </div>

            {/* Bottom actions */}
            <div className="modal-bottom-actions">
              <button
                className="btn-resolve"
                disabled={selectedIssue.status !== "In Progress"}
                onClick={resolveIssue}
              >
                Mark Resolved
              </button>
              <button className="btn-danger" onClick={() => deleteIssue(selectedIssue.id)}>
                Delete Issue
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


export default Issues;