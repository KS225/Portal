import { useEffect, useState } from "react";
import "../styles/invitationhistory.css";


function InvitationHistory() {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/invitations", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setInvitations(data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
     
  <div className="admin-invitation-container">
    <h2>Invitation History</h2>

    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Status</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.email}</td>
              <td>{inv.username}</td>
              <td>
                <span className={`status-badge ${inv.status.toLowerCase()}`}>
                  {inv.status}
                </span>
              </td>
              <td>{new Date(inv.expiresAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
    </div>
  );
}

export default InvitationHistory;