import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/drawer.css";

export default function ProfileDrawer({ onClose }) {
  /* ================= PROFILE STATE ================= */
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= PASSWORD STATE ================= */
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setForm(res.data);
    } catch {
      alert("Failed to load profile");
    }
  };

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      setLoading(true);
      await API.put("/profile", form);
      alert("Profile updated");
    } catch {
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    try {
      setLoadingOtp(true);
      await API.post("/profile/send-otp");
      alert("OTP sent (check email/console)");
      setStep(2);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = async () => {
    try {
      await API.post("/profile/verify-otp", {
        otp,
        newPassword,
      });

      alert("Password updated successfully");

      setStep(1);
      setOtp("");
      setNewPassword("");
    } catch {
      alert("Invalid OTP or error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="profile-container">
      {/* 🔙 BACK */}
      <button className="back-btn" onClick={onClose}>
        ← Back
      </button>

      {/* 👤 HEADER */}
      <div className="profile-header">
        <div className="profile-avatar">
          {form.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <h3>{form.full_name || "Your Name"}</h3>
          <p>{form.email || "No email added"}</p>
        </div>
      </div>

      {/* ================= PROFILE CARD ================= */}
      <div className="profile-card">
        <h4>Profile Information</h4>

        <div className="form-group">
          <label>Full Name</label>
          <input
            name="full_name"
            value={form.full_name || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            name="department"
            value={form.department || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
  <label>Designation</label>
  <input
    name="designation"
    value={form.designation || ""}
    onChange={handleChange}
  />
</div>

        <button onClick={saveProfile} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ================= PASSWORD CARD ================= */}
      <div className="profile-card">
        <h4>Change Password</h4>

        {step === 1 && (
          <button onClick={sendOtp} disabled={loadingOtp}>
            {loadingOtp ? "Sending..." : "Send OTP"}
          </button>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}