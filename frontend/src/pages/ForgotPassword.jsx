import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/auth.css";
import "../styles/forgetpassword.css";

function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Something went wrong");
      return;
    }

    setMessage("Password reset link sent to your email.");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          {role ? role.toUpperCase() : "Account"} Password Reset
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter registered email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>
        </form>

        {message && <p className="success-message">{message}</p>}

        <div className="back-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;