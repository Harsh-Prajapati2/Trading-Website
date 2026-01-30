import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="bg-glow"></div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Trading<span>Platform</span></h1>
            <p>Reset your password</p>
          </div>

          {submitted ? (
            <div className="auth-form">
              <div className="success-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Check your email</h3>
                <p style={{ color: '#a0aec0' }}>
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              <Link to="/login" className="auth-button" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="error-banner">
                  <span className="icon">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className={error ? "input-error" : ""}
                  />
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? <div className="spinner"></div> : "Send Reset Link"}
                </button>
              </form>

              <div className="switch-auth">
                <p>Remember your password? <Link to="/login">Back to Login</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}