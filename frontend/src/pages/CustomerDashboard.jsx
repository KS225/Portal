import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function CompanyDashboard() {
  const navigate = useNavigate();
  
  return (
   
     <div className="dashboard-wrapper">
        <h2>Company Dashboard</h2>
        <div className="dashboard-grid">
          <div className="dashboard-box" onClick={() => navigate("/profile")}>
            <div className="icon">👤</div>
            <h3>Profile</h3>
            <p>View and update company details</p>
          </div>

          <div
            className="dashboard-box"
            onClick={() => navigate("/dashboard/apply")}
          >
            <div className="icon">📜</div>
            <h3>Apply for Certification</h3>
            <p>Submit application for CIO verification</p>
          </div>

          <div
            className="dashboard-box"
            onClick={() => navigate("/dashboard/progress")}
          >
            <div className="icon">📊</div>
            <h3>Certification Progress</h3>
            <p>Track verification stages</p>
          </div>

          <div
            className="dashboard-box"
            onClick={() => navigate("/dashboard/audit")}
          >
            <div className="icon">🔍</div>
            <h3>Assigned Audit</h3>
            <p>View assigned auditor details</p>
          </div>
          <div
            className="dashboard-box"
            onClick={() => navigate("/dashboard/certificates")}
          >
            <div className="icon">🏆</div>
            <h3>My Certificates</h3>
            <p>View all approved Certificates</p>
          </div>
          
        </div>
      </div>
   
  );
}

export default CompanyDashboard;
