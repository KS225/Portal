import { useEffect, useState } from "react";
import "../styles/adminDashboard.css";

function AdminAuditors() {
  const [auditors, setAuditors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAuditors = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/auditors",
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setAuditors(data);
    } catch (err) {
      console.error("Failed to fetch auditors", err);
    }
  };

  useEffect(() => {
    fetchAuditors();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/invite-auditor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setMessage("Invitation sent successfully!");
      setEmail("");

      setTimeout(() => {
        setShowModal(false);
        setMessage("");
        setError("");
      }, 1500);

    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="admin-dashboard-container">

      <div className="admin-auditors-header">
        <h2>Auditors</h2>
        <button onClick={() => setShowModal(true)}>
          + Invite Auditor
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Name</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {auditors.length === 0 ? (
            <tr>
              <td colSpan="4">No auditors registered yet.</td>
            </tr>
          ) : (
            auditors.map((auditor) => (
              <tr key={auditor._id}>
                <td>{auditor.username}</td>
                <td>{auditor.email}</td>
                <td>
                  {auditor.name
                    ? auditor.name
                    : "Auditor has not set name"}
                </td>
                <td>
                  {auditor.createdAt
  ? new Date(auditor.createdAt).toLocaleDateString()
  : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Invite Auditor</h3>

            <form onSubmit={handleInvite}>
              <input
                type="email"
                placeholder="Auditor Personal Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <button type="submit">
                Send Invitation
              </button>
            </form>

            {message && (
              <p style={{ color: "green" }}>
                {message}
              </p>
            )}

            {error && (
              <p style={{ color: "red" }}>
                {error}
              </p>
            )}

            <button
              className="modal-close"
              onClick={() => {
                setShowModal(false);
                setError("");
                setMessage("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAuditors;