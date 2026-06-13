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

        <div className="dashboard-content">

          <DashboardCard
            title="Total Issues"
            value={120}
          />

          <DashboardCard
            title="Reported"
            value={50}
          />

          <DashboardCard
            title="In Progress"
            value={40}
          />

          <DashboardCard
            title="Resolved"
            value={30}
          />

          <DashboardCard
            title="Workers"
            value={12}
          />

        </div>

      </div>

    </div>
  );
}

export default Dashboard;