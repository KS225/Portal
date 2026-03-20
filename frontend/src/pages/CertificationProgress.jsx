import { useEffect, useState } from "react";
import "../styles/certificationProgress.css";

function CertificationProgress() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/certification/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  const getStepIndex = (status) => {
    switch (status) {
      case "Pending":
        return 1;

      case "Auditor Assigned":
        return 2;

      case "Under Audit": // auditor approved
        return 3;

      case "Approved": // final admin approval
        return 4;

      case "Changes Requested": // auditor rejected
        return 3;

      case "Rejected":
        return -1;

      default:
        return 0;
    }
  };

  return (
    <div className="progress-container">
      <h2>Certification Progress</h2>

      {applications.length === 0 && (
        <p>No applications submitted yet.</p>
      )}

      {applications.map(app => {
        const currentStep = getStepIndex(app.status);

        return (
          <div key={app._id} className="progress-card">

            <h3>{app.businessType} Application</h3>
            <p>
              <strong>Submitted On:</strong>{" "}
              {new Date(app.createdAt).toLocaleDateString()}
            </p>

            {/* ❌ ADMIN REJECT */}
            {app.status === "Rejected" ? (
              <div className="rejected-box">
                <p><strong>Status:</strong> Rejected by Admin</p>
             
              </div>
            ) : (
              <>
                {/* ✅ TIMELINE */}
                <div className="timeline">

                  <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                    <div className="circle"></div>
                    <p>Pending</p>
                  </div>

                  <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                    <div className="circle"></div>
                    <p>Auditor Assigned</p>
                  </div>

                  <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                    <div className="circle"></div>
                    <p>Auditor Decision</p>
                  </div>

                  <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
                    <div className="circle"></div>
                    <p>Final Approval</p>
                  </div>

                </div>

                {/* ✅ AUDITOR DECISION */}
                {app.auditorDecision && (
                  <div className="audit-feedback">
                    <p>
                      <strong>Auditor Decision:</strong>{" "}
                      {app.auditorDecision === "Approved"
                        ? "Approved"
                        : "Changes Requested"}
                    </p>

                    
                  </div>
                )}

                {/* ✅ FINAL APPROVAL */}
                {app.status === "Approved" && (
                  <div className="approved-box">
                    <p>✅ Final Approval by Admin</p>
                  </div>
                )}
              </>
            )}

            {/* ✅ AUDITOR INFO */}
            {app.assignedAuditor && (
              <p className="auditor-info">
                <strong>Assigned Auditor:</strong>{" "}
                {app.assignedAuditor.email}
              </p>
            )}

          </div>
        );
      })}
    </div>
  );
}

export default CertificationProgress;