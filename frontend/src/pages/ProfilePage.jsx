import { useEffect, useState } from "react";
import "../styles/profile.css";

function ProfilePage() {
  const [company, setCompany] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCompany(data);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/user/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contactPerson: company.contactPerson,
        designation: company.designation,
        phone: company.phone,
      }),
    });

    setEditing(false);
    alert("Profile updated successfully");
  };

  if (!company) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Company Profile</h2>

      <div className="profile-card">
        <label>Company Name</label>
        <input value={company.companyName} disabled />

        <label>CIN</label>
        <input value={company.registrationNumber} disabled />

        <label>Email</label>
        <input value={company.email} disabled />

        <label>Contact Person</label>
        <input
          name="contactPerson"
          value={company.contactPerson || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Designation</label>
        <input
          name="designation"
          value={company.designation || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Phone</label>
        <input
          name="phone"
          value={company.phone || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        {!editing ? (
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        ) : (
          <button onClick={handleSave}>Save Changes</button>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;