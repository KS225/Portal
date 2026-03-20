import { useEffect, useState } from "react";
import "../styles/companyAudit.css";

function CertificatesPage() {
  const [applications, setApplications] = useState([]);

  /* =============================
     FETCH APPLICATIONS
  ============================= */
  useEffect(() => {
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
  }, []);

  /* =============================
     DOWNLOAD FUNCTION (FIXED)
  ============================= */
  const downloadCertificate = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/certification/download-certificate/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Download failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (err) {
      console.error(err);
    }
  };

  /* =============================
     FILTER APPROVED
  ============================= */
  const approvedApps = applications.filter(
    app => app.status === "Approved"
  );

  return (
    <div className="audit-container">
      <h2>My Certificates</h2>

      {approvedApps.length === 0 && (
        <p>No certificates available yet.</p>
      )}

      {approvedApps.map(app => (
        <div key={app._id} className="audit-card">

          <h3>{app.businessType || "N/A"}</h3>

          <p>
            <strong>Status:</strong> {app.status}
          </p>

          {/* ✅ BUTTON FIXED */}
          {app.certificateUrl ? (
            <button onClick={() => downloadCertificate(app._id)}>
              Download Certificate
            </button>
          ) : (
            <p>Certificate not generated yet</p>
          )}

        </div>
      ))}
    </div>
  );
}

export default CertificatesPage;