import React, { useEffect, useState } from 'react';
import './ViewAllIssues.css';
import { FaTrash } from 'react-icons/fa';

const ViewAllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/issues');
        const data = await res.json();
        setIssues(data.reverse()); // latest first
      } catch (err) {
        console.error('❌ Failed to fetch issues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Delete an issue
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    const res = await fetch(`http://localhost:5000/api/issues/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setIssues(issues.filter(issue => issue._id !== id));
      alert('✅ Issue deleted successfully.');
    } else {
      alert('❌ Failed to delete issue.');
    }
  };

  return (
    <div className="issues-container">
      <h2>📍 All Reported Issues</h2>

      {loading ? (
        <p>Loading issues...</p>
      ) : issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        <div className="issues-grid">
          {issues.map((issue) => (
            <div key={issue._id} className="issue-card">
              {issue.photo && (
                <img
                  src={`http://localhost:5000/uploads/${issue.photo}`}
                  alt="Reported Issue"
                  className="issue-photo"
                />
              )}
              <h3>{issue.title}</h3>
              <p><strong>Description:</strong> {issue.description}</p>
              <p><strong>Location:</strong> {issue.location}</p>
              <p className="timestamp">
                📅 {new Date(issue.createdAt).toLocaleString()}
              </p>
              <button className="delete-btn" onClick={() => handleDelete(issue._id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllIssues;
