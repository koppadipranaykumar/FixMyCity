// src/components/DashboardCard/DashboardCard.tsx

import "./DashboardCard.css";

interface Props {
  title: string;
  value: number;
}

function DashboardCard({
  title,
  value,
}: Props) {
  return (
    <div className="dashboard-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default DashboardCard;