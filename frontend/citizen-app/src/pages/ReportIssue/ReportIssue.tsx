import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReportIssue.css";
import MapPicker from "../../components/MapPicker";
import API_BASE_URL from "../../config/api";

const categories = [
  { value: "Potholes",        icon: "🕳️", desc: "Damaged road surface"  },
  { value: "Garbage",         icon: "🗑️", desc: "Waste & littering"      },
  { value: "Street Lights",   icon: "💡", desc: "Broken or flickering"   },
  { value: "Water Leakage",   icon: "🚰", desc: "Pipe or drain issues"   },
  { value: "Traffic Signals", icon: "🚦", desc: "Signal malfunction"     },
  { value: "Public Property", icon: "🌳", desc: "Parks & infrastructure" },
];

function ReportIssue() {

  const [step, setStep]               = useState(1);
  const [category, setCategory]       = useState("");
  const [title, setTitle]             = useState("");
  const [location, setLocation]       = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage]             = useState<File | null>(null);
  const [latitude, setLatitude]       = useState<number | null>(null);
  const [longitude, setLongitude]     = useState<number | null>(null);
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) navigate("/login");
  }, []);

  const searchLocation = async (locationName: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/geocode`, { params: { q: locationName } });
      if (response.data?.lat && response.data?.lon) {
        setLatitude(parseFloat(response.data.lat));
        setLongitude(parseFloat(response.data.lon));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Location search failed:", error);
      return false;
    }
  };

  const selectedCat = categories.find((c) => c.value === category);

  const canNext = () => {
    if (step === 1) return category !== "";
    if (step === 2) return title.trim() !== "" && location.trim() !== "";
    if (step === 3) return description.trim() !== "";
    return false;
  };

  const handleStep2Continue = async () => {
    if (!title.trim() || !location.trim()) return;
    setLoading(true);
    setError("");
    try {
      if (latitude === null || longitude === null) {
        const found = await searchLocation(location);
        if (!found) {
          setError("Could not find coordinates for the entered location. Try being more specific, or drop a pin on the map.");
          return;
        }
      }
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const userEmail = localStorage.getItem("userEmail") ?? "";
      const formData = new FormData();
      formData.append("title",       title);
      formData.append("description", description);
      formData.append("category",    category);
      formData.append("location",    location);
      formData.append("userEmail",   userEmail);
      formData.append("reportedBy",  userEmail);
      if (latitude  !== null) formData.append("latitude",  latitude.toString());
      if (longitude !== null) formData.append("longitude", longitude.toString());
      if (image)              formData.append("image",     image);
      await axios.post(`${API_BASE_URL}/api/issues`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Submit Error:", err);
      setError(err.response?.data?.message || "Something went wrong while submitting the issue.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1); setCategory(""); setTitle(""); setLocation("");
    setDescription(""); setImage(null); setLatitude(null);
    setLongitude(null); setSubmitted(false); setError("");
  };

  if (submitted) {
    return (
      <div className="ri-success-page">
        <div className="ri-success-card">
          <div className="ri-success-icon">✓</div>
          <h2>Report Submitted Successfully!</h2>
          <p>Your issue has been registered and sent to the appropriate team.</p>
          <div className="ri-success-summary">
            <span className="ri-success-cat">{selectedCat?.icon} {category}</span>
            <strong>{title}</strong>
            <span>📍 {location}</span>
            {image && <span>📷 {image.name}</span>}
          </div>
          <div className="ri-success-actions">
            <button className="ri-btn-outline" onClick={() => navigate("/issues")}>View All Issues</button>
            <button className="ri-btn-primary" onClick={resetForm}>Report Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ri-page">

      {/* ── Wrapper: stepper + main side by side ── */}
      <div className="ri-content">

        {/* Stepper sidebar */}
        <div className="ri-stepper">
          {["Category", "Details", "Description"].map((label, i) => {
            const num   = i + 1;
            const state = num < step ? "done" : num === step ? "active" : "idle";
            return (
              <div key={num} className={`ri-step ri-step--${state}`}>
                <div className="ri-step-circle">
                  {state === "done" ? "✓" : num}
                </div>
                <span className="ri-step-label">{label}</span>
                {i < 2 && (
                  <div className={`ri-step-line ${state === "done" ? "ri-step-line--done" : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <main className="ri-main">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="ri-step-body">
              <div className="ri-step-heading">
                <span className="ri-step-tag">Step 1 of 3</span>
                <h1>What type of issue is it?</h1>
                <p>Pick the category that best describes the issue.</p>
              </div>
              <div className="ri-cat-grid">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`ri-cat-card ${category === c.value ? "ri-cat-card--selected" : ""}`}
                    onClick={() => setCategory(c.value)}
                  >
                    <span className="ri-cat-emoji">{c.icon}</span>
                    <span className="ri-cat-name">{c.value}</span>
                    <span className="ri-cat-desc">{c.desc}</span>
                    {category === c.value && <span className="ri-cat-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="ri-step-body">
              <div className="ri-step-heading">
                <span className="ri-step-tag">Step 2 of 3</span>
                <h1>Issue Details</h1>
              </div>
              <div className="ri-selected-badge">
                {selectedCat?.icon} {category}
              </div>
              <div className="ri-fields">
                <div className="ri-field">
                  <label>Issue Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="ri-field">
                  <label>Location</label>
                  <input
                    value={location}
                    placeholder="Enter issue location"
                    onChange={(e) => { setLocation(e.target.value); setLatitude(null); setLongitude(null); }}
                  />
                </div>
                <div className="ri-field">
                  <label>Select Location on Map</label>
                  <MapPicker
                    latitude={latitude}
                    longitude={longitude}
                    onLocationSelect={(lat, lng) => { setLatitude(lat); setLongitude(lng); }}
                  />
                  {latitude !== null && longitude !== null && (
                    <span className="ri-field-hint">📍 {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
                  )}
                </div>
                <div className="ri-field">
                  <label>Upload Image</label>
                  <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setImage(e.target.files[0]); }} />
                </div>
              </div>
              {error && <div className="ri-error">{error}</div>}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="ri-step-body">
              <div className="ri-step-heading">
                <span className="ri-step-tag">Step 3 of 3</span>
                <h1>Describe the problem</h1>
              </div>
              <div className="ri-summary-strip">
                <span>{selectedCat?.icon} {category}</span>
                <span className="ri-summary-divider">•</span>
                <span>{title}</span>
                <span className="ri-summary-divider">•</span>
                <span>📍 {location}</span>
              </div>
              <div className="ri-field">
                <label>Description</label>
                <textarea
                  placeholder="Describe the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {error && <div className="ri-error">{error}</div>}
            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="ri-footer">
        {step > 1 ? (
          <button className="ri-btn-ghost" onClick={() => { setError(""); setStep(step - 1); }}>← Back</button>
        ) : (
          <button className="ri-btn-ghost" onClick={() => navigate("/")}>Cancel</button>
        )}

        {step < 3 ? (
          <button
            className="ri-btn-primary"
            onClick={() => { if (step === 2) { handleStep2Continue(); } else { setStep(step + 1); } }}
            disabled={!canNext() || loading}
          >
            {loading ? "Loading..." : "Continue →"}
          </button>
		  
        ) : (
          <button className="ri-btn-primary" onClick={handleSubmit} disabled={!canNext() || loading}>
            {loading ? (<><span className="ri-spinner" /> Submitting...</>) : "Submit Report →"}
          </button>
        )}
      </footer>

    </div>
  );
}

export default ReportIssue;