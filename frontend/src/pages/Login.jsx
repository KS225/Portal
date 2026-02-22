import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";


function Login() {
  const [loginType, setLoginType] = useState("user"); // user | admin | auditor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Store token & role from backend
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    // Redirect based on role
  if (data.user.role === "admin") {
  navigate("/admin/dashboard");
} else if (data.user.role === "auditor") {
  navigate("/auditor/dashboard");
} else {
  navigate("/dashboard");
}

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

  return (
    <div className="login-container">
      <div className="login-inner">

        {/* Role selector */}
        <div className="login-header">
          <div className="login-switch">
            <button
              type="button"
              className={loginType === "user" ? "active" : ""}
              onClick={() => setLoginType("user")}
            >
              Company
            </button>

            <button
              type="button"
              className={loginType === "admin" ? "active" : ""}
              onClick={() => setLoginType("admin")}
            >
              Admin
            </button>

            <button
  type="button"
  className={loginType === "auditor" ? "active" : ""}
  onClick={() => setLoginType("auditor")}
>
  Auditor
</button>

          </div>

          <div className="login-divider"></div>
        </div>

        <h2>
  {loginType === "admin"
    ? "Administrator Login"
    : loginType === "auditor"
    ? "Auditor Login"
    : "Company Login"}
</h2>

        <form onSubmit={handleSubmit}>
          <input
  type="email"
  placeholder={
    loginType === "admin"
      ? "Admin Email"
      : "Official Email"
  }
  onChange={(e) => setEmail(e.target.value)}
  required
/>

          

<div style={{ position: "relative", marginBottom: "15px" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={{ width: "95%" }}
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

          <button type="submit">Sign In</button>
          <div className="forgot-password">
  <Link to={`/forgot-password?role=${loginType}`}>
    Forgot Password?
  </Link>
</div>
        </form>

         {/* Register redirect (Company only) */}
        {loginType === "user" && (
          <div className="login-footer">
            <span>New to Granuler Certification?</span>
            <Link to="/register">Register your company</Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;
