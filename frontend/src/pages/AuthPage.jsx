import { useState } from "react";
import api from "../api/axios";

export default function AuthPage() {
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    if (!form.email || !form.password) {
      setMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = res.data.user.role === "admin" ? "/admin" : "/user";
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const getResetCode = async () => {
    if (!form.email) {
      setMessage("Enter your email first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/forgot-password", {
        email: form.email,
      });
      setResetCode(res.data.resetToken || "");
      setMessage("Reset code generated. Enter a new password below.");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Unable to generate reset code.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!resetCode || !newPassword) {
      setMessage("Reset code and new password are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/reset-password", {
        token: resetCode,
        password: newPassword,
      });
      setForgotMode(false);
      setResetCode("");
      setNewPassword("");
      setForm({ ...form, password: "" });
      setMessage("Password reset successfully. Login with your new password.");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const toggleForgot = () => {
    setForgotMode((prev) => !prev);
    setMessage("");
    setResetCode("");
    setNewPassword("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#f8fafc",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        background: "#fff",
      }}>
        <div style={{ width: "100%", maxWidth: 390 }}>
          <h1 style={{ fontSize: 42, margin: "0 0 28px", color: "#111827" }}>
            {forgotMode ? "Reset Password" : "Sign In"}
          </h1>

          {message && (
            <div style={{
              background: message.includes("successfully") || message.includes("generated") ? "#ECFDF5" : "#FEF2F2",
              color: message.includes("successfully") || message.includes("generated") ? "#047857" : "#DC2626",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 14,
              fontSize: 14,
            }}>
              {message}
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "18px 22px",
              border: "1px solid #dbe1ea",
              borderRadius: 8,
              fontSize: 18,
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          />

          {!forgotMode && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "18px 22px",
                border: "1px solid #dbe1ea",
                borderRadius: 8,
                fontSize: 18,
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            />
          )}

          {forgotMode && resetCode && (
            <div style={{
              background: "#EEF2FF",
              color: "#3730A3",
              border: "1px solid #C7D2FE",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 16,
              fontSize: 13,
              wordBreak: "break-all",
            }}>
              <strong>Reset code:</strong> {resetCode}
            </div>
          )}

          {forgotMode && (
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "18px 22px",
                border: "1px solid #dbe1ea",
                borderRadius: 8,
                fontSize: 18,
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />
          )}

          {!forgotMode && (
            <button
              onClick={toggleForgot}
              style={{
                background: "transparent",
                border: "none",
                color: "#7C3AED",
                fontSize: 14,
                fontWeight: 700,
                margin: "0 0 20px",
                padding: 0,
              }}
            >
              Forgot password?
            </button>
          )}

          <button
            onClick={forgotMode ? (resetCode ? resetPassword : getResetCode) : login}
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: 8,
              background: loading ? "#86efac" : "#16A34A",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {loading
              ? "Please wait..."
              : forgotMode
                ? resetCode ? "Reset Password" : "Get Reset Code"
                : "Login"}
          </button>

          {forgotMode && (
            <button
              onClick={toggleForgot}
              style={{
                width: "100%",
                marginTop: 12,
                padding: "14px",
                border: "1px solid #dbe1ea",
                borderRadius: 8,
                background: "#fff",
                color: "#475569",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Back to Login
            </button>
          )}

          <p style={{ textAlign: "center", color: "#64748B", marginTop: 20, fontSize: 14 }}>
            Account access is created by your administrator.
          </p>
        </div>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        padding: 40,
        background: "linear-gradient(135deg, #7C3AED, #EC4899)",
      }}>
        <div>
          <h2 style={{ fontSize: 54, margin: "0 0 20px" }}>Hello Friend!</h2>
          <p style={{ fontSize: 24, margin: 0 }}>
            Sign in with the credentials shared by your admin.
          </p>
        </div>
      </div>
    </div>
  );
}
