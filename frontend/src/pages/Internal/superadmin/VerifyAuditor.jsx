import { useEffect, useState } from "react";
import API from "../../../services/api";

export default function VerifyAuditors() {
  const [auditors, setAuditors] = useState([]);
  const [credentials, setCredentials] = useState(null);

  // 🔥 Convert buffer → string path
  const bufferToString = (bufferObj) => {
    if (!bufferObj?.data) return null;
    return new TextDecoder().decode(new Uint8Array(bufferObj.data));
  };

  // ✅ FETCH AUDITORS
  const fetchAuditors = async () => {
    try {
      const res = await API.get("/admin/auditors/pending");
      setAuditors(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchAuditors();
  }, []);

  // ✅ VERIFY
  const handleVerify = async (id) => {
    try {
      const res = await API.post(`/admin/auditors/verify/${id}`);
      setCredentials(res.data.credentials); // 🔥 triggers modal
      fetchAuditors();
    } catch (err) {
      console.error("VERIFY ERROR:", err);
    }
  };

  // ✅ COPY FUNCTION
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Verify Auditors</h1>

      {/* 🔥 MODAL */}
      {credentials && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Credentials Generated ✅</h2>

            <p><b>Email:</b> {credentials?.email || "N/A"}</p>
<p><b>Password:</b> {credentials?.password || "N/A"}</p>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => copyToClipboard(credentials.email)}>
                Copy Email
              </button>

              <button onClick={() => copyToClipboard(credentials.password)}>
                Copy Password
              </button>
            </div>

            <button
              style={{ marginTop: "15px" }}
              onClick={() => setCredentials(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      {auditors.length === 0 ? (
        <p>No auditors found</p>
      ) : (
        auditors.map((a) => {
          const resumePath = bufferToString(a.resume);
          const companyPath = bufferToString(a.company_profile);

          return (
            <div key={a.id} className="auditor-card">
              <h3>{a.full_name}</h3>
              <p><b>Email:</b> {a.email}</p>
              <p><b>Phone:</b> {a.phone}</p>
              <p><b>Specialization:</b> {a.specialization}</p>

              {/* FILES */}
              {resumePath && (
                <a
                  href={`http://localhost:5000/${resumePath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume
                </a>
              )}

              {companyPath && (
                <a
                  href={`http://localhost:5000/${companyPath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Company Profile
                </a>
              )}

              <br /><br />

              <button onClick={() => handleVerify(a.id)}>
                Verify
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}