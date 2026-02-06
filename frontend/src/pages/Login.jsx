import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [loginType, setLoginType] = useState("user"); // user | admin
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loginType === "admin") {
      console.log("Admin Login:", { username, password });
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
    } else {
      console.log("Company Login:", { email, password });
      localStorage.setItem("role", "user");
      localStorage.setItem("status", "pending");
      navigate("/dashboard");
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
              onChange={(e) => setUsername(e.target.value)}
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
