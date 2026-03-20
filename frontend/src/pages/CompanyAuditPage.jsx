import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/companyAudit.css";

function CompanyAuditPage() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  /* =============================
     FETCH DATA
  ============================= */
  const fetchApplications = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/certification/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* =============================
     REAPPLY → OPEN FORM (FIXED)
  ============================= */
  const handleReapply = (app) => {
    // ✅ Store FULL application (not just ID)
    localStorage.setItem("editApplication", JSON.stringify(app));

    navigate("/dashboard/apply");
  };

  const filteredApps = applications.filter(
    app =>
      app.status === "Rejected" ||
      app.status === "Changes Requested"
  );

  return (
    <div className="audit-container">
      <h2>Audit Status</h2>

      {filteredApps.length === 0 && (
        <p>No rejected or change-requested applications.</p>
      )}

      {filteredApps.map(app => (
        <div key={app._id} className="audit-card">

          <h3>{app.businessType || "N/A"}</h3>

          {app.assignedAuditor ? (
            <p>
              <strong>Assigned Auditor:</strong>{" "}
              {app.assignedAuditor.username || app.assignedAuditor.email}
            </p>
          ) : (
            <p><strong>Auditor:</strong> Not assigned yet</p>
          )}

          <hr />

          <h4>Submitted Application</h4>

          <p><strong>Products/Services:</strong> {app.productsAndServices || "N/A"}</p>
          <p><strong>Customers:</strong> {app.numberOfCustomers || "N/A"}</p>
          <p><strong>Years:</strong> {app.yearsInOperation || "N/A"}</p>

          <p><strong>Organisation Structure:</strong> {app.organisationStructure || "N/A"}</p>
          <p><strong>Roles:</strong> {app.rolesResponsibilities || "N/A"}</p>
          <p><strong>Escalation:</strong> {app.escalationFramework || "N/A"}</p>

          <p><strong>SDLC Defined:</strong> {app.sdlcDefined || "N/A"}</p>
          <p><strong>Version Control:</strong> {app.versionControl || "N/A"}</p>

          <p><strong>Security Policy:</strong> {app.securityPolicy || "N/A"}</p>

          <hr />

          {app.auditorDecision && (
            <div className="audit-result">
              <p>
                <strong>Auditor Decision:</strong>{" "}
                {app.auditorDecision === "Approved"
                  ? "✅ Approved"
                  : "❌ Changes Requested"}
              </p>

              <p>
                <strong>Auditor Remarks:</strong>{" "}
                {app.auditorRemarks || "No remarks"}
              </p>
            </div>
          )}

          <p className={`status ${app.status?.toLowerCase().replace(" ", "-")}`}>
            Status: {app.status}
          </p>
          {app.status === "Rejected" && (
  <p className="rejection-reason">
    <strong>Reason:</strong> {app.rejectionReason || "No reason provided"}
  </p>
)}

          <div className="action-buttons">
            <button
              className="btn-reapply"
              onClick={() => handleReapply(app)}
            >
              Reapply Certification
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

export default CompanyAuditPage;