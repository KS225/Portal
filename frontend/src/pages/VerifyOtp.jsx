import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("pendingEmail");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Session expired. Please register again.");
      navigate("/register");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }

      // Cleanup
      localStorage.removeItem("pendingEmail");

      alert("Account verified successfully!");
      navigate("/login");
    } catch (error) {
      console.error("OTP verify error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-inner">
        <h2>Email Verification</h2>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          Enter the 6-digit OTP sent to your registered email address.
        </p>

        <form onSubmit={handleVerify} style={{ marginTop: "24px" }}>
          <label>OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
          />

          <button type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
