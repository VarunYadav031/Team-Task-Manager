import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      window.location.href = role === "admin" ? "/admin" : "/user";
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setResetCode(res.data.resetToken || "");
    } catch (err) {
      setError(err.response?.data?.msg || "Unable to generate reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      setError("Reset code and new password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/reset-password", {
        token: resetCode,
        password: newPassword,
      });
      setForgotMode(false);
      setResetCode("");
      setNewPassword("");
      setPassword("");
      setError("Password reset successfully. Login with your new password.");
    } catch (err) {
      setError(err.response?.data?.msg || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif",
      background: "#f7f8fc", alignItems: "center", justifyContent: "center",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Card */}
      <div style={{
        background: "#fff", borderRadius: 18, border: "0.5px solid #e2e8f0",
        padding: "40px 44px", width: "100%", maxWidth: 400,
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1a202c", marginBottom: 2 }}>
            Taskboard
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a202c", margin: "10px 0 4px" }}>
            {forgotMode ? "Reset password" : "Sign in"}
          </h1>
          <p style={{ fontSize: 13, color: "#a0aec0", margin: 0 }}>
            Welcome back — enter your credentials to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "0.5px solid #FECACA",
            borderRadius: 8, padding: "10px 14px", fontSize: 13,
            color: "#DC2626", marginBottom: 16, display: "flex", gap: 8, alignItems: "center",
          }}>
            <span>✕</span> {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#718096", display: "block", marginBottom: 6 }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%", padding: "11px 14px", border: "0.5px solid #e2e8f0",
              borderRadius: 10, fontSize: 14, color: "#1a202c", background: "#f7f8fc",
              outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#6B5FE4"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        {forgotMode && resetCode && (
          <div style={{
            background: "#EEF0FC", border: "0.5px solid #c7d2fe",
            borderRadius: 8, padding: "10px 14px", fontSize: 12,
            color: "#4338ca", marginBottom: 14, wordBreak: "break-all",
          }}>
            <strong>Reset code:</strong> {resetCode}
          </div>
        )}

        {/* Password */}
        {!forgotMode && (
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#718096", display: "block", marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "11px 42px 11px 14px", border: "0.5px solid #e2e8f0",
                borderRadius: 10, fontSize: 14, color: "#1a202c", background: "#f7f8fc",
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#6B5FE4"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "#a0aec0", padding: 0,
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        )}

        {forgotMode && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#718096", display: "block", marginBottom: 6 }}>
              New password
            </label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px", border: "0.5px solid #e2e8f0",
                borderRadius: 10, fontSize: 14, color: "#1a202c", background: "#f7f8fc",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Forgot */}
        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <span
            onClick={() => {
              setForgotMode((prev) => !prev);
              setError(null);
            }}
            style={{ fontSize: 12, color: "#6B5FE4", cursor: "pointer", fontWeight: 500 }}
          >
            {forgotMode ? "Back to login" : "Forgot password?"}
          </span>
        </div>

        {/* Submit */}
        <button
          onClick={forgotMode ? (resetCode ? handleResetPassword : handleForgotPassword) : handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "13px", borderRadius: 10, border: "none",
            background: loading ? "#a78bfa" : "#6B5FE4", color: "#fff",
            fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s", marginBottom: 20,
          }}
          onMouseEnter={e => { if (!loading) e.target.style.background = "#5849D0"; }}
          onMouseLeave={e => { if (!loading) e.target.style.background = "#6B5FE4"; }}
        >
          {loading ? "Signing in..." : "Sign in →"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: "0.5px", background: "#e2e8f0" }} />
          <span style={{ fontSize: 12, color: "#a0aec0" }}>or</span>
          <div style={{ flex: 1, height: "0.5px", background: "#e2e8f0" }} />
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: "center", fontSize: 13, color: "#718096", margin: 0 }}>
          Don't have an account?{" "}
          <a href="/" style={{ color: "#6B5FE4", fontWeight: 600, textDecoration: "none" }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
