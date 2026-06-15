import { useEffect, useState } from "react";
import axios from "axios";
import "./Issues.css";

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  assignedWorker?: string;
  resolutionNote?: string;
  proofImage?: string;
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
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [worker, setWorker] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);

  const workers = [
    { id: 1, name: "Ramesh" },
    { id: 2, name: "Suresh" },
    { id: 3, name: "Mahesh" },
  ];

  const fetchIssues = () => {
    setLoading(true);
    axios.get("http://localhost:8080/api/issues")
      .then((r) => { setIssues(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchIssues();
  }, []);
  const assignWorker = async () => {
    if (!selectedIssue || !worker) {
      alert("Please select a worker");
      return;
    }

    try {
		await axios.put(
		  `http://localhost:8080/api/issues/${selectedIssue.id}/assign`,
		  {
		    workerName: worker,
		  }
		);

		fetchIssues();

		setSelectedIssue((prev) =>
		  prev
		    ? {
		        ...prev,
		        assignedWorker: worker,
		        status: "In Progress",
		      }
		    : null
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

      formData.append(
        "resolutionNote",
        resolutionNote
      );

      if (proofImage) {
        formData.append(
          "proofImage",
          proofImage
        );
      }

      await axios.put(
        `http://localhost:8080/api/issues/${selectedIssue.id}/resolve-with-proof`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      fetchIssues();

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
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.location.toLowerCase().includes(search.toLowerCase());
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
      await axios.delete(`http://localhost:8080/api/issues/${id}`);
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

  return (
    <div className="admin-issues-page">

      {/* Header */}
      <div className="issues-header">
        <div>
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
          <span className="search-icon">🔍</span>
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

      {/* Table */}
      {loading ? (
        <div className="issues-table-wrap">
          {[1, 2, 3, 4].map((n) => <div key={n} className="skeleton-row" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="issues-empty">
          <span>🔎</span>
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
                <th>Image</th>
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
                        src={
                          issue.imageUrl
                            ? `http://localhost:8080/uploads/${issue.imageUrl}`
                            : "/placeholder.jpg"
                        }
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
                        <span>{categoryIcon[issue.category] ?? "📌"}</span>
                        <span>{issue.category}</span>
                      </div>
                    </td>
                    <td className="cell-location">📍 {issue.location}</td>
                    <td>
                      <span className={`issue-status ${sc.cls}`}>{sc.label}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn view-btn"					  onClick={() => {
					    setSelectedIssue(issue);

					    setWorker(issue.assignedWorker || "");

					    setResolutionNote(
					      issue.resolutionNote || ""
					    );

					    setProofImage(null); // ONLY clear upload preview
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

      {/* Details Modal */}
      {selectedIssue && (
        <div className="issue-modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedIssue.title}</h2>
              <button className="modal-close" onClick={() => setSelectedIssue(null)}>✕</button>
            </div>

            <img
              src={
                selectedIssue.imageUrl
                  ? `http://localhost:8080/uploads/${selectedIssue.imageUrl}`
                  : "/placeholder.jpg"
              }
              alt={selectedIssue.title}
              className="modal-image"
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
                <h4>Resolution Notes</h4>
                <p>{selectedIssue.resolutionNote}</p>
              </div>
            )}

			<div className="modal-section">
			  <h4>Assign Worker</h4>

			  <select
			    className="worker-select"
			    value={worker}
			    onChange={(e) => setWorker(e.target.value)}
			    disabled={selectedIssue.status !== "Reported"}
			  >
			    <option value="">
			      Select Worker
			    </option>

			    {workers.map((w) => (
			      <option
			        key={w.id}
			        value={w.name}
			      >
			        {w.name}
			      </option>
			    ))}
			  </select>

			  <button
			    className="modal-action-btn progress-btn"
			    disabled={
			      selectedIssue.status !== "Reported"
			    }
			    onClick={assignWorker}
			  >
			    Assign Worker
			  </button>
			</div>

			<div className="modal-section">
			  <h4>Resolution Note</h4>

			  <textarea
			    className="resolution-textarea"
			    placeholder="Enter resolution details..."
			    value={resolutionNote}
			    onChange={(e) =>
			      setResolutionNote(
			        e.target.value
			      )
			    }
			    disabled={
			      selectedIssue.status !== "In Progress"
			    }
			  />
			  <h4>Completion Proof Image</h4>

			  <input
			    type="file"
			    accept="image/*"
			    onChange={(e) => {
			      if (e.target.files?.length) {
			        setProofImage(e.target.files[0]);
			      }
			    }}
			  />
			</div>
			
			{proofImage && (
			  <img
			    src={URL.createObjectURL(proofImage)}
			    alt="Proof Preview"
			    style={{
			      width: "100%",
			      marginTop: "10px",
			      borderRadius: "10px"
			    }}
			  />
			)}
			{selectedIssue?.proofImage && (
			  <>
			    <h4>Saved Proof Image</h4>

			    <img
			      src={`http://localhost:8080/uploads/${selectedIssue.proofImage}`}
			      alt="Saved Proof"
			      style={{
			        width: "100%",
			        marginTop: "10px",
			        borderRadius: "10px"
			      }}
			    />
			  </>
			)}
			<div className="modal-status-actions">
			  <button
			    className="modal-action-btn resolve-btn"
			    disabled={
			      selectedIssue.status !== "In Progress"
			    }
			    onClick={resolveIssue}
			  >
			    Mark Resolved
			  </button>

			  <button
			    className="modal-action-btn delete-modal-btn"
			    onClick={() =>
			      deleteIssue(selectedIssue.id)
			    }
			  >
			    Delete Issue
			  </button>
			</div>

            <button className="modal-map-btn" onClick={() => openMap(selectedIssue)}>
              Open Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Issues;