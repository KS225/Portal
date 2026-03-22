import { useNavigate } from "react-router-dom";
import "../../../styles/superadmin.css";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="sa-container">
      <h1>Super Admin Dashboard</h1>

      <div className="sa-grid">
        <div
          className="sa-card"
          onClick={() => navigate("/internal/superadmin/create-user")}
        >
          <h3>Create User</h3>
          <p>Add new internal team members</p>
        </div>

        <div
          className="sa-card"
          onClick={() => navigate("/internal/superadmin/users")}
        >
          <h3>User Management</h3>
          <p>View, reset, deactivate users</p>
        </div>
      </div>
    </div>
  );
}