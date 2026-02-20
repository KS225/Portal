import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [loginType, setLoginType] = useState("user"); // user | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (loginType === "admin") {
    // For now keep admin static until we build admin auth
    localStorage.setItem("role", "admin");
    navigate("/admin/dashboard");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // STORE TOKEN HERE
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "user");

    navigate("/dashboard");

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
          </div>

          <div className="login-divider"></div>
        </div>

        <h2>
          {loginType === "admin"
            ? "Administrator Login"
            : "Company Login"}
        </h2>

        <form onSubmit={handleSubmit}>
          {loginType === "admin" ? (
            <input
              type="text"
              placeholder="Admin Username"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          ) : (
            <input
              type="email"
              placeholder="Official Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign In</button>
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
