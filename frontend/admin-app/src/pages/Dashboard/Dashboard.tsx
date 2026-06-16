import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [totalIssues, setTotalIssues] = useState(0);
  const [reportedIssues, setReportedIssues] = useState(0);
  const [inProgressIssues, setInProgressIssues] = useState(0);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [workers, setWorkers] = useState(0);

  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      const [issuesResponse, workersResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/issues"),
        axios.get("http://localhost:8080/api/workers"),
      ]);

      const issues = issuesResponse.data;

      setTotalIssues(issues.length);

      setReportedIssues(
        issues.filter((i: any) => i.status === "Reported").length
      );

      setInProgressIssues(
        issues.filter((i: any) => i.status === "In Progress").length
      );

      setResolvedIssues(
        issues.filter((i: any) => i.status === "Resolved").length
      );

      setWorkers(workersResponse.data.length);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (!loggedIn) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <div className="dashboard-page">
          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
              <p>Overview of civic issues and city operations</p>
            </div>
          </div>

          <div className="dashboard-content">
            <DashboardCard
              title="Total Issues"
              value={totalIssues}
              icon="📋"
              accent="total"
            />

            <DashboardCard
              title="Reported"
              value={reportedIssues}
              icon="🆕"
              accent="reported"
            />

            <DashboardCard
              title="In Progress"
              value={inProgressIssues}
              icon="⚙️"
              accent="progress"
            />

            <DashboardCard
              title="Resolved"
              value={resolvedIssues}
              icon="✅"
              accent="resolved"
            />

            <DashboardCard
              title="Workers"
              value={workers}
              icon="👷"
              accent="workers"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;