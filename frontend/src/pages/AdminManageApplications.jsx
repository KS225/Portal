import { useEffect, useState, useCallback } from "react";
import "../styles/adminCompany.css";

function AdminManageApplications() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  /* =============================
     Fetch All Applications
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
    } catch (error) {
      console.error("Fetch error:", error);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const auditorId = prompt("Enter Auditor ID:");
    if (!auditorId) return;

    await fetch(
      `http://localhost:5000/api/certification/assign/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ auditorId }),
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
          <h3>{app.company?.companyName}</h3>
          <p><strong>Email:</strong> {app.company?.email}</p>

          <hr />

          <p><strong>Business Type:</strong> {app.businessType}</p>
          <p><strong>Offering Type:</strong> {app.offeringType}</p>
          <p><strong>Business Description:</strong> {app.businessDescription}</p>
          <p><strong>Remark Description:</strong> {app.remarksDescription}</p>
          <p><strong>Number of Customers:</strong> {app.numberOfCustomers}</p>
          <p><strong>Years in Operation:</strong> {app.yearsInOperation}</p>
          <p><strong>Annual Turnover:</strong> {app.annualTurnover}</p>
          <p><strong>Other Businesses:</strong> {app.otherBusinesses || "N/A"}</p>

          {app.status === "Rejected" && (
            <p className="rejection-reason">
              <strong>Rejection Reason:</strong> {app.rejectionReason}
            </p>
          )}

          <p className={`status-badge ${app.status.replace(" ", "-").toLowerCase()}`}>
            {app.status}
          </p>

          <div className="application-actions">
            <button
              className="btn-approve"
              onClick={() => handleApprove(app._id)}
            >
              Approve
            </button>

            <button
              className="btn-reject"
              onClick={() => handleReject(app._id)}
            >
              Reject
            </button>

            <button
              className="btn-assign"
              onClick={() => handleAssign(app._id)}
            >
              Assign Auditor
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminManageApplications;