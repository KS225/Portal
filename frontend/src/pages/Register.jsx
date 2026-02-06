import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    industry: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    certificationType: "",
    startDate: "",
    endDate: "",
    password: "",
    confirmPassword: ""
  });

  /* Generic change handler */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* Text-only fields */
  const handleTextOnly = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setFormData({ ...formData, [e.target.name]: value });
  };

  /* Number-only fields */
  const handleNumberOnly = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, [e.target.name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    // Store email temporarily for OTP verification
    localStorage.setItem("pendingEmail", formData.email);

    alert("OTP sent to your registered email");
    navigate("/verify-otp");
  } catch (error) {
    console.error("Registration error:", error);
    alert("Server error. Please try again later.");
  }
};



  return (
    <div className="auth-container">
      <div className="auth-inner">
        <h2>Company Certification Application</h2>

        <form onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input
            name="companyName"
            placeholder="Enter company legal name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <label>Registration Number</label>
          <input
            name="registrationNumber"
            placeholder="Company registration / CIN number"
            value={formData.registrationNumber}
            onChange={handleNumberOnly}
            required
          />

          <label>Industry / Domain</label>
          <input
            name="industry"
            placeholder="e.g. Manufacturing, IT Services"
            value={formData.industry}
            onChange={handleTextOnly}
          />

          <label>Contact Person</label>
          <input
            name="contactPerson"
            placeholder="Authorized representative"
            value={formData.contactPerson}
            onChange={handleTextOnly}
            required
          />

          <label>Designation</label>
          <input
            name="designation"
            placeholder="e.g. Director, Compliance Officer"
            value={formData.designation}
            onChange={handleTextOnly}
          />

          <label>Official Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            name="phone"
            placeholder="Official contact number"
            value={formData.phone}
            onChange={handleNumberOnly}
            maxLength={10}
          />

          <label>Certification Type</label>
          <input
            name="certificationType"
            placeholder="Requested certification"
            value={formData.certificationType}
            onChange={handleChange}
            required
          />

          <label>Certification Period</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <label>Confirm Password</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit">Submit Application</button>
        </form>

        <div className="auth-helper">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
