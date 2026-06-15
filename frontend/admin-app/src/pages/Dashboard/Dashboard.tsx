import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

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
              value={120}
              icon="📋"
              accent="total"
            />

            <DashboardCard
              title="Reported"
              value={50}
              icon="🆕"
              accent="reported"
            />

            <DashboardCard
              title="In Progress"
              value={40}
              icon="⚙️"
              accent="progress"
            />

            <DashboardCard
              title="Resolved"
              value={30}
              icon="✅"
              accent="resolved"
            />

            <DashboardCard
              title="Workers"
              value={12}
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