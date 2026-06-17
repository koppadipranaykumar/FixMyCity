import { useEffect, useState } from "react";
import axios from "axios";
import "./Workers.css";
import API_BASE_URL from "../../config/api";

interface Worker {
  id: number;
  name: string;
  phone: string;
  department: string;
  area: string;
  active: boolean;
}

const departments = [
  "Roads",
  "Garbage",
  "Street Lights",
  "Water Leakage",
  "Traffic Signals",
  "Public Property",
];

// Maps each department to a CSS class for its accent color + icon
const deptMeta: Record<string, { icon: string; cls: string }> = {
  "Roads":            { icon: "🛣️", cls: "dept-roads" },
  "Garbage":          { icon: "🗑️", cls: "dept-garbage" },
  "Street Lights":    { icon: "💡", cls: "dept-lights" },
  "Water Leakage":    { icon: "🚰", cls: "dept-water" },
  "Traffic Signals":  { icon: "🚦", cls: "dept-traffic" },
  "Public Property":  { icon: "🌳", cls: "dept-property" },
};

function getInitials(name: string | null | undefined) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [area, setArea] = useState("");

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/workers`);
      setWorkers(response.data);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const addWorker = async () => {
    if (!name || !phone || !department || !area) {
      setFormError("Fill in every field before adding a worker.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/api/workers`, {
        name,
        phone,
        department,
        area,
      });

      setName("");
      setPhone("");
      setDepartment("");
      setArea("");

      fetchWorkers();
    } catch (err) {
      console.error("Failed to add worker:", err);
      setFormError("Could not add worker. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteWorker = async (id: number) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/api/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      console.error("Failed to delete worker:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredWorkers = workers.filter((w) => {
    const query = search.toLowerCase();

    const matchesSearch =
      (w.name ?? "").toLowerCase().includes(query) ||
      (w.area ?? "").toLowerCase().includes(query) ||
      (w.phone ?? "").includes(search);

    const matchesDept =
      filterDept === "All" || w.department === filterDept;

    return matchesSearch && matchesDept;
  });

  const activeCount = workers.filter((w) => w.active).length;

  return (
    <div className="workers-page">

      {/* Header */}
      <header className="wk-header">
        <div>
          <h1>Worker Management</h1>
          <p className="wk-subtitle">
            Assign and track field staff across departments
          </p>
        </div>

        <div className="wk-stats">
          <div className="wk-stat">
            <span className="wk-stat-value">{workers.length}</span>
            <span className="wk-stat-label">Total</span>
          </div>
          <div className="wk-stat wk-stat--active">
            <span className="wk-stat-value">{activeCount}</span>
            <span className="wk-stat-label">Active</span>
          </div>
        </div>
      </header>

      {/* Add worker form */}
      <section className="wk-form-card">
        <h2 className="wk-form-title">Add a worker</h2>

        <div className="wk-form-grid">

          <div className="wk-field">
            <label>Name</label>
            <input
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="wk-field">
            <label>Phone Number</label>
            <input
              placeholder="e.g. 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="wk-field">
            <label>Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {deptMeta[d].icon} {d}
                </option>
              ))}
            </select>
          </div>

          <div className="wk-field">
            <label>Area</label>
            <input
              placeholder="e.g. Ward 12, Sector 5"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <button
            className="wk-add-btn"
            onClick={addWorker}
            disabled={submitting}
          >
            {submitting ? "Adding..." : "+ Add Worker"}
          </button>

        </div>

        {formError && <div className="wk-form-error">{formError}</div>}
      </section>

      {/* Toolbar: search + filter */}
      <div className="wk-toolbar">
        <input
          className="wk-search"
          placeholder="Search by name, area, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="wk-filter-chips">
          <button
            className={`wk-chip ${filterDept === "All" ? "wk-chip--active" : ""}`}
            onClick={() => setFilterDept("All")}
          >
            All
          </button>

          {departments.map((d) => (
            <button
              key={d}
              className={`wk-chip ${filterDept === d ? "wk-chip--active" : ""}`}
              onClick={() => setFilterDept(d)}
            >
              {deptMeta[d].icon} {d}
            </button>
          ))}
        </div>
      </div>

      {/* Worker list */}
      <section className="wk-table-card">

        {loading ? (
          <div className="wk-empty">
            <span className="wk-spinner" />
            Loading workers...
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="wk-empty">
            <span className="wk-empty-icon">🧑‍🔧</span>
            <p>
              {workers.length === 0
                ? "No workers added yet. Add your first worker above."
                : "No workers match your search or filter."}
            </p>
          </div>
        ) : (
          <table className="worker-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Area</th>
                <th>Status</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>

            <tbody>
              {filteredWorkers.map((worker) => {
                const meta = deptMeta[worker.department] ?? {
                  icon: "🔧",
                  cls: "dept-default",
                };

                return (
                  <tr key={worker.id}>
                    <td>
                      <div className="wk-name-cell">
                        <span className={`wk-avatar ${meta.cls}`}>
                          {getInitials(worker.name)}
                        </span>
                        <div className="wk-name-text">
                          <span className="wk-name">{worker.name ?? "Unnamed"}</span>
                          <span className="wk-id">#{worker.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="wk-phone">{worker.phone ?? "—"}</td>

                    <td>
                      <span className={`wk-dept-badge ${meta.cls}`}>
                        {meta.icon} {worker.department}
                      </span>
                    </td>

                    <td>{worker.area ?? "—"}</td>

                    <td>
                      <span
                        className={`wk-status ${
                          worker.active ? "wk-status--active" : "wk-status--inactive"
                        }`}
                      >
                        <span className="wk-status-dot" />
                        {worker.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="wk-delete-btn"
                        onClick={() => deleteWorker(worker.id)}
                        disabled={deletingId === worker.id}
                      >
                        {deletingId === worker.id ? "Removing..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
}

export default Workers;