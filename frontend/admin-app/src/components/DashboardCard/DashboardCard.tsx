// src/components/DashboardCard/DashboardCard.tsx

import "./DashboardCard.css";

interface Props {
  title: string;
  value: number;
  icon?: string;
  accent?: "total" | "" | "progress" | "resolved" | "workers";
}

function DashboardCard({
  title,
  value,
  icon,
  accent = "total",
}: Props) {
  return (
    <div className={`dashboard-card ${accent}`}>
      {icon && <div className="dashboard-card-icon">{icon}</div>}
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default DashboardCard;