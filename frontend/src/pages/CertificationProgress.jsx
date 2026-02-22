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
      case "Approved":
        return 2;
      case "Auditor Assigned":
        return 3;
      case "Completed":
        return 4;
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
            <p><strong>Submitted On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>

            {app.status === "Rejected" ? (
              <div className="rejected-box">
                <p><strong>Status:</strong> Rejected</p>
                <p><strong>Reason:</strong> {app.rejectionReason}</p>
              </div>
            ) : (
              <div className="timeline">

                <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                  <div className="circle"></div>
                  <p>Submitted</p>
                </div>

                <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                  <div className="circle"></div>
                  <p>Approved</p>
                </div>

                <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                  <div className="circle"></div>
                  <p>Auditor Assigned</p>
                </div>

                <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
                  <div className="circle"></div>
                  <p>Completed</p>
                </div>

              </div>
            )}

            {app.assignedAuditor && (
              <p className="auditor-info">
                <strong>Assigned Auditor:</strong> {app.assignedAuditor.email}
              </p>
            )}

          </div>
        );
      })}
    </div>
  );
}

export default CertificationProgress;