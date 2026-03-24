import { useEffect, useState } from "react";
import "../../styles/companyprofile.css";

function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          return;
        }

        setCompany(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/profile/company", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Updated successfully");
    setCompany(formData);
    setEditMode(false);

  } catch (err) {
    console.error(err);
  }
};

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!company) return <div className="profile-container">No data found</div>;

  return (
    <div className="profile-container">
      <h2>Company Profile</h2>

      <div className="profile-card">

        {!editMode ? (
          <>
            <div className="profile-row">
              <span>Company Name</span>
              <p>{company.companyName}</p>
            </div>

            <div className="profile-row">
              <span>CIN</span>
              <p>{company.registrationNumber}</p>
            </div>

            <div className="profile-row">
              <span>Industry</span>
              <p>{company.industry || "N/A"}</p>
            </div>

            <div className="profile-row">
              <span>Contact Person</span>
              <p>{company.contactPerson}</p>
            </div>

            <div className="profile-row">
              <span>Designation</span>
              <p>{company.designation || "N/A"}</p>
            </div>

            <div className="profile-row">
              <span>Email</span>
              <p>{company.email}</p>
            </div>

            <div className="profile-row">
              <span>Phone</span>
              <p>{company.phone || "N/A"}</p>
            </div>

            <button className="profile-btn" onClick={() => setEditMode(true)}>
              Edit Details
            </button>
          </>
        ) : (
          <>
            <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
            <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="CIN" />
            <input name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" />
            <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Contact Person" />
            <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />

            <div className="btn-group">
              <button className="profile-btn" onClick={handleUpdate}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CompanyProfile;