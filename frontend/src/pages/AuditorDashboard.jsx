import { useEffect, useState, useCallback } from "react";
import "../styles/auditorDashboard.css";

function AuditorDashboard() {
  const [applications, setApplications] = useState([]);
  const [remarks, setRemarks] = useState({});
  const token = localStorage.getItem("token");

  const fetchAssignedApplications = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/certification/auditor-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchAssignedApplications();
  }, [fetchAssignedApplications]);

  const submitAudit = async (id, decision) => {
    if (!remarks[id]?.trim()) {
      alert("Please enter remarks before submitting");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/certification/auditor-review/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            remarks: remarks[id],
            decision,
          }),
        }
      );

      const data = await res.json();
      alert(data.message);

      setRemarks({ ...remarks, [id]: "" });
      fetchAssignedApplications();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auditor-container">
      <h2>Auditor Dashboard</h2>

      {applications.length === 0 && (
        <p>No applications assigned to you</p>
      )}

      {applications.map((app) => (
        <div key={app._id} className="application-card">

          <h3>{app.company?.companyName}</h3>
          <p><strong>Email:</strong> {app.company?.email}</p>

          <hr />

          {/* ✅ FULL FORM DATA */}
          <p><strong>Business Type:</strong> {app.businessType}</p>
          <p><strong>Products:</strong> {app.productsAndServices}</p>
          <p><strong>Years:</strong> {app.yearsInOperation}</p>
          <p><strong>Customers:</strong> {app.numberOfCustomers}</p>

          <hr />

          <p><strong>Organisation Structure:</strong> {app.organisationStructure}</p>
          <p><strong>Roles:</strong> {app.rolesResponsibilities}</p>
          <p><strong>Sales/Delivery:</strong> {app.salesDeliverySeparation}</p>
          <p><strong>Escalation:</strong> {app.escalationFramework}</p>
          <p><strong>Management Review:</strong> {app.managementReview}</p>

          <hr />

          <p><strong>Product Defined:</strong> {app.productServiceDefinition}</p>
          <p><strong>Revenue Transparency:</strong> {app.revenueMixTransparency}</p>
          <p><strong>Scope Defined:</strong> {app.implementationScopeDefined}</p>
          <p><strong>Warranty:</strong> {app.warrantySupportClarity}</p>
          <p><strong>Third Party:</strong> {app.thirdPartyDependencies}</p>

          <hr />

          <p><strong>SDLC:</strong> {app.sdlcDefined}</p>
          <p><strong>Version Control:</strong> {app.versionControl}</p>
          <p><strong>Release:</strong> {app.releaseManagement}</p>
          <p><strong>Defect:</strong> {app.defectTracking}</p>
          <p><strong>Roadmap:</strong> {app.productRoadmap}</p>
          <p><strong>EOL:</strong> {app.eolPolicy}</p>

          <hr />

          <p><strong>Security:</strong> {app.securityPolicy}</p>
          <p><strong>Risk:</strong> {app.riskAssessment}</p>
          <p><strong>Access:</strong> {app.accessControl}</p>
          <p><strong>Encryption:</strong> {app.encryptionUsed}</p>
          <p><strong>Backup:</strong> {app.backupRecovery}</p>
          <p><strong>Incident:</strong> {app.incidentManagement}</p>

          <hr />

          <p><strong>Status:</strong> {app.status}</p>

          {/* ✅ FIXED BUTTON LOGIC */}
          {app.status === "Auditor Assigned" ? (
            <div className="audit-box">

              <label>Audit Remarks *</label>

              <textarea
                value={remarks[app._id] || ""}
                onChange={(e) =>
                  setRemarks({
                    ...remarks,
                    [app._id]: e.target.value,
                  })
                }
              />

              <div className="audit-buttons">
                <button onClick={() => submitAudit(app._id, "Approved")}>
                   Approve
                </button>

                <button onClick={() => submitAudit(app._id, "Changes Requested")}>
                  Request Changes
                </button>
              </div>

            </div>
          ) : (
            <div className="audit-result">
              <p><strong>Decision:</strong> {app.auditorDecision}</p>
              <p><strong>Remarks:</strong> {app.auditorRemarks || "No remarks"}</p>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default AuditorDashboard;