import { useState } from "react";

function InviteAuditor() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost:5000/api/admin/invite-auditor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    setMessage("Invitation sent successfully!");
    setEmail("");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Invite Auditor</h2>

      <form onSubmit={handleInvite}>
        <input
          type="email"
          placeholder="Auditor Personal Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Invitation</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default InviteAuditor;