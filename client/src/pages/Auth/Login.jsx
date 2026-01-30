import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateLoginForm } from "../../utils/validation";
import "./login.css";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative background elements */}
      <div className="bg-glow"></div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Trading<span>Platform</span></h1>
            <p>Welcome back! Please enter your details.</p>
          </div>

          {serverError && (
            <div className="error-banner">
              <span className="icon">⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-password">Forgot?</Link>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Sign In"}
            </button>
          </form>

          <div className="switch-auth">
            <p>Don't have an account? <Link to="/signup">Create account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}