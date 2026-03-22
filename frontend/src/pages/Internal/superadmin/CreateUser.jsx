import { useState } from "react";
import API from "../../../services/api";
import "../../../styles/superadmin.css";

export default function CreateUser() {
  const [form, setForm] = useState({
    username: "",
    role: "",
  });

  const [auto, setAuto] = useState(true);
  const [generated, setGenerated] = useState(null);

  const generateUsername = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `user_${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let username = form.username;

      if (auto) {
        username = generateUsername();
      }

      const res = await API.post("/admin/create-user", {
        username,
        role: form.role,
      });

      setGenerated(res.data);

    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="sa-container">
      <h2>Create Internal User</h2>

      <form className="sa-form" onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            checked={auto}
            onChange={() => setAuto(!auto)}
          />
          Auto-generate username
        </label>

        {!auto && (
          <input
            placeholder="Enter username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />
        )}

        <select
          required
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="OPERATIONS">Operations</option>
        </select>

        <button>Create User</button>
      </form>

      {generated && (
        <div className="credentials">
          <h3>Credentials</h3>
          <p><b>Username:</b> {generated.username}</p>
          <p><b>Password:</b> {generated.tempPassword}</p>
          <p><b>Login:</b> /internal-login</p>
        </div>
      )}
    </div>
  );
}