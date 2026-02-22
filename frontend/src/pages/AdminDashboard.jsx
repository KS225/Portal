import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <h2>Access Denied</h2>;
  }

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-dashboard-grid">
        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/applications")}
        >
          <div className="admin-card-icon">📂</div>
          <h3>Manage Applications</h3>
          <p>Approve or reject company applications</p>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/auditors")}
        >
          <div className="admin-card-icon">🧾</div>
          <h3>Auditors</h3>
          <p>Manage and invite auditors</p>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/invitations")}
        >
          <div className="admin-card-icon">📜</div>
          <h3>Invitation History</h3>
          <p>View all sent invitations and status</p>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/companies")}
        >
          <div className="admin-card-icon">🏢</div>
          <h3>View All Companies</h3>
          <p>See registered companies</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
