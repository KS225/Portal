import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/auth.css";

function AuditorSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔍 Verify token on page load
  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/auditor/verify-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);
        } else {
          setError(data.message || "Invalid or expired link");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Server error");
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auditor/complete-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      alert("Account created successfully. Please login.");
      navigate("/login");

    } catch (err) {
      setError("Server error");
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Verifying link...</h2>;

  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  return (
    <div className="auth-container">
      <div className="auth-inner">
        <h2>Auditor Account Setup</h2>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            readOnly
          />

          <label>Set Password</label>
<div style={{ position: "relative", marginBottom: "15px" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={{ width: "100%", paddingRight: "60px" }}
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "13px",
      color: "#3f51b5",
      fontWeight: "500"
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </span>
</div>

<label>Confirm Password</label>
<div style={{ position: "relative", marginBottom: "15px" }}>
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
     style={{ width: "95%" }}
  />
  <span
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "13px",
      color: "#3f51b5",
      fontWeight: "500"
    }}
  >
    {showConfirmPassword ? "Hide" : "Show"}
  </span>
</div>

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default AuditorSetup;