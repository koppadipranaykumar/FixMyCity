import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import UserMenu from '../components/UserMenu';
import ReportIssueForm from '../components/ReportIssueForm';
import ViewAllIssues from '../components/ViewAllIssues';
import logo from '../assets/logo.png';
import { FaSun, FaClipboardList } from 'react-icons/fa';
import API from '../api'; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) setUser(userData);

    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleIssueSubmit = async (formData) => {
    try {
        const response = await API.post('/issues', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Crucial for file uploads with FormData
            },
        });

        // Axios puts the response data in the 'data' property
        const data = response.data; 
        alert('Issue reported successfully!');
        // After submission, navigate back to the home page
        window.history.pushState({}, '', '/dashboard');
        setPath('/dashboard');
    } catch (error) {
        console.error('Failed to report issue:', error); // Log the actual error for better debugging
        // Provide more informative alert to the user
        alert('Fail to report issue: ' + (error.response?.data?.message || error.message || 'Please check console for details.'));
    }
};

  const navigate = (newPath) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
  };

  // ✅ New, more robust conditional rendering using a switch statement
  let renderView;
  switch (path) {
    case '/dashboard/report':
      renderView = (
        <ReportIssueForm
          onSubmit={handleIssueSubmit}
          onCancel={() => navigate('/dashboard')}
        />
      );
      break;
    case '/dashboard/view':
      renderView = <ViewAllIssues />;
      break;
    default: // This will handle all other cases, including '/dashboard' and any unexpected paths
      renderView = (
        <div className="dashboard-container">
          <h2>Welcome to FixMyCity 🏙️</h2>
          <p>What would you like to do today?</p>
          <button className="dashboard-button" onClick={() => navigate('/dashboard/report')}>
            ➕ Report an Issue
          </button>
          <button className="dashboard-button" onClick={() => navigate('/dashboard/view')}>
            📍 View All Issues
          </button>
        </div>
      );
      break;
  }

  return (
    <>
      {/* Navbar */}
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="FixMyCity" className="navbar-logo" />
          <span className="navbar-title">FixMyCity</span>
        </div>

        <div className="nav-actions">
          <button className="theme-btn" title="Toggle Theme">
            <FaSun />
          </button>
          <button className="status-btn" title="Status">
            <FaClipboardList />
          </button>
          <UserMenu user={user} updateUser={setUser} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main Body */}
      <div className="dashboard-body">
        {renderView}
      </div>
    </>
  );
};

export default Dashboard;