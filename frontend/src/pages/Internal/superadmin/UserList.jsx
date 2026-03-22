import { useEffect, useState } from "react";
import API from "../../../services/api";
import "../../../styles/superadmin.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
const currentUser = JSON.parse(localStorage.getItem("user"));
  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deactivate = async (id) => {
    await API.patch(`/admin/deactivate/${id}`);
    fetchUsers();
  };

  const resetPassword = async (id) => {
    const res = await API.post(`/admin/reset-password/${id}`);
    alert(`New Password: ${res.data?.tempPassword}`);
  };

  return (
    <div className="sa-container">
      <h2>Internal Users</h2>

      {users.map((u) => (
        <div key={u.id} className="user-card">
          <div>
            <h4>{u.username}</h4>
            <p>{u.role}</p>
            <p>Status: {u.is_active ? "Active" : "Inactive"}</p>
          </div>

         <div>
  {/* ✅ Allow reset only for OTHER users */}
  {currentUser?.id !== u.id && (
    <button onClick={() => resetPassword(u.id)}>
      Reset
    </button>
  )}

  {/* ✅ Prevent self deactivate */}
  {currentUser?.id !== u.id && (
    <button onClick={() => deactivate(u.id)}>
      Deactivate
    </button>
  )}
</div>
        </div>
      ))}
    </div>
  );
}