import { useEffect, useState } from "react";
import API from "../../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paymentPending: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/dashboard-stats");
      setStats(res.data);
    } catch {
      alert("Failed to load stats");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Total Applications" value={stats.total} />
        <Card title="Pending Screening" value={stats.pending} />
        <Card title="Payment Pending" value={stats.paymentPending} />
        <Card title="Completed" value={stats.completed} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #eee",
      width: "200px"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}