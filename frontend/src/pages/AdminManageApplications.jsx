import { useEffect, useState, useCallback } from "react";
import "../styles/adminCompany.css";

function AdminManageApplications() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  /* =============================
     Fetch Applications
  ============================= */
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/certification/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      setApplications([]);
    }
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /* =============================
     Approve
  ============================= */
  const handleApprove = async (id) => {
    await fetch(
      `http://localhost:5000/api/certification/approve/${id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Application Approved");
    fetchApplications();
  };

  /* =============================
     Reject
  ============================= */
  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    await fetch(
      `http://localhost:5000/api/certification/reject/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      }
    );

    alert("Application Rejected");
    fetchApplications();
  };

  /* =============================
     Assign Auditor
  ============================= */
  const handleAssign = async (id) => {
    const username = prompt("Enter Auditor Username:");
    if (!username) return;

    await fetch(
      `http://localhost:5000/api/certification/assign/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      }
    );

    alert("Auditor Assigned");
    fetchApplications();
  };

  return (
    <div className="admin-applications-container">
      <h2>Manage Applications</h2>

      {applications.length === 0 && <p>No applications found.</p>}

      {applications.map((app) => (
        <div key={app._id} className="application-card">

          {/* COMPANY */}
          <h3>{app.company?.companyName || "N/A"}</h3>
          <p><strong>Email:</strong> {app.company?.email || "N/A"}</p>

          <hr />

          {/* BASIC INFO */}
          <p><strong>Business Type:</strong> {app.businessType}</p>
          <p><strong>Products / Services:</strong> {app.productsAndServices}</p>
          <p><strong>Years in Operation:</strong> {app.yearsInOperation}</p>
          <p><strong>Customers:</strong> {app.numberOfCustomers}</p>

          <hr />

          {/* GOVERNANCE */}
          <p><strong>Organisation Structure:</strong> {app.organisationStructure}</p>
          <p><strong>Roles & Responsibilities:</strong> {app.rolesResponsibilities}</p>
          <p><strong>Sales/Delivery Separation:</strong> {app.salesDeliverySeparation}</p>
          <p><strong>Escalation Framework:</strong> {app.escalationFramework}</p>
          <p><strong>Management Review:</strong> {app.managementReview}</p>

          <hr />

          {/* BUSINESS MODEL */}
          <p><strong>Product Defined:</strong> {app.productServiceDefinition}</p>
          <p><strong>Revenue Transparency:</strong> {app.revenueMixTransparency}</p>
          <p><strong>Scope Defined:</strong> {app.implementationScopeDefined}</p>
          <p><strong>Warranty Clarity:</strong> {app.warrantySupportClarity}</p>
          <p><strong>Third Party Dependencies:</strong> {app.thirdPartyDependencies}</p>

          <hr />

          {/* SDLC */}
          <p><strong>SDLC Defined:</strong> {app.sdlcDefined}</p>
          <p><strong>Version Control:</strong> {app.versionControl}</p>
          <p><strong>Release Management:</strong> {app.releaseManagement}</p>
          <p><strong>Defect Tracking:</strong> {app.defectTracking}</p>
          <p><strong>Product Roadmap:</strong> {app.productRoadmap}</p>
          <p><strong>EOL Policy:</strong> {app.eolPolicy}</p>

          <hr />

          {/* SECURITY */}
          <p><strong>Security Policy:</strong> {app.securityPolicy}</p>
          <p><strong>Risk Assessment:</strong> {app.riskAssessment}</p>
          <p><strong>Access Control:</strong> {app.accessControl}</p>
          <p><strong>Encryption:</strong> {app.encryptionUsed}</p>
          <p><strong>Backup & Recovery:</strong> {app.backupRecovery}</p>
          <p><strong>Incident Management:</strong> {app.incidentManagement}</p>

          <hr />

          {/* STATUS */}
          <p className={`status-badge ${app.status.toLowerCase().replace(" ", "-")}`}>
            Status: {app.status}
          </p>

          {/* REJECTION */}
          {app.status === "Rejected" && (
            <p className="rejection-reason">
              <strong>Reason:</strong> {app.rejectionReason}
            </p>
          )}

          {/* AUDITOR */}
          {app.assignedAuditor && (
            <p><strong>Auditor:</strong> {app.assignedAuditor.email}</p>
          )}

          {/* ACTIONS */}
<div className="application-actions">

  {/* ✅ Pending OR Rejected → full control */}
  {(app.status === "Pending" || app.status === "Rejected") && (
    <>
      <button onClick={() => handleApprove(app._id)}>Approve</button>
      <button onClick={() => handleReject(app._id)}>Reject</button>
      <button onClick={() => handleAssign(app._id)}>Assign Auditor</button>
    </>
  )}

  {/* ✅ Auditor reviewing */}
  {app.status === "Auditor Assigned" && (
    <p>Auditor Reviewing...</p>
  )}

  {/* ✅ Auditor finished → admin can act */}
  {app.status === "Under Audit" && (
    <>
      <button onClick={() => handleApprove(app._id)}>Approve</button>
      <button onClick={() => handleReject(app._id)}>Reject</button>
    </>
  )}

  {/* ✅ Approved → still allow actions if you want */}
  {app.status === "Approved" && (
    <>
      <button onClick={() => handleReject(app._id)}>Reject</button>
      <button onClick={() => handleAssign(app._id)}>Reassign Auditor</button>
    </>
  )}

</div>

        </div>
      ))}
    </div>
  );
}

export default AdminManageApplications;