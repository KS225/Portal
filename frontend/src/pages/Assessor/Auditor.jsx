import { useEffect, useState } from "react";

function AuditorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auditor/applications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to fetch applications");
          return;
        }

        setApplications(data);
      } catch (err) {
        console.error(err);
        alert("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const startReview = (applicationId) => {
    // Navigate to the review page or open modal
    alert(`Start review for application: ${applicationId}`);
  };

  if (loading) return <div>Loading applications...</div>;
  if (!applications.length) return <div>No applications allocated.</div>;

  return (
    <div className="application-container">
      <h2>Applications Allocated to You (Auditor)</h2>
      <table className="application-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Company Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.applicationId}>
              <td>{app.applicationId}</td>
              <td>{app.companyName}</td>
              <td>
                <button onClick={() => startReview(app.applicationId)}>
                  Start Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditorApplications;