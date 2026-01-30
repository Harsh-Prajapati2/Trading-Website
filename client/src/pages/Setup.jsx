import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUsername, getUserProfile } from "../api/setup.api";
import { initWallet, creditWallet } from "../api/wallet.api";
import { isValidName, isValidNumber } from "../utils/validation";
import "../styles/Setup.css";

export default function Setup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [fundError, setFundError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Step 1: Create Username
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setServerError("");

    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }

    if (!isValidName(username)) {
      setUsernameError("Username must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      await updateUsername(username);
      setSuccessMessage("Username created successfully!");
      setTimeout(() => {
        setCurrentStep(2);
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      setServerError(error.error || "Failed to create username");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Initialize Wallet
  const handleInitWallet = async () => {
    try {
      setLoading(true);
      await initWallet();
      setCurrentStep(3);
    } catch (error) {
      setServerError(error.error || "Failed to initialize wallet");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Add Funds
  const handleAddFunds = async (e) => {
    e.preventDefault();
    setFundError("");
    setServerError("");

    const amount = parseFloat(fundAmount);

    if (!fundAmount || !isValidNumber(fundAmount)) {
      setFundError("Please enter a valid amount (minimum ₹1)");
      return;
    }

    try {
      setLoading(true);
      await creditWallet(amount, "bank");
      setSuccessMessage("Funds added successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setServerError(error.error || "Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Skip to Dashboard
  const handleSkip = async () => {
    try {
      // Initialize empty wallet if not done
      await initWallet();
    } catch (error) {
      // Wallet might already exist
    }
    navigate("/dashboard");
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <h1>Welcome to TradeHub! 📈</h1>
          <p>Let's set up your account</p>
        </div>

        {serverError && <div className="error-message">{serverError}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* Step 1: Create Username */}
        {currentStep === 1 && (
          <div className="setup-step">
            <div className="step-indicator">
              <div className="step-number active">1</div>
              <span className="step-title">Create Username</span>
            </div>

            <form onSubmit={handleUsernameSubmit} className="setup-form">
              <div className="input-group">
                <label htmlFor="username">Choose a Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Your unique username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
                  className={usernameError ? "input-error" : ""}
                  minLength="2"
                />
                {usernameError && (
                  <span className="field-error">{usernameError}</span>
                )}
              </div>

              <p className="step-description">
                This username will be visible to other traders on the platform
              </p>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Username"}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Initialize Wallet */}
        {currentStep === 2 && (
          <div className="setup-step">
            <div className="step-indicator">
              <div className="step-number active">2</div>
              <span className="step-title">Initialize Wallet</span>
            </div>

            <div className="setup-info">
              <div className="info-box">
                <div className="info-icon">💳</div>
                <div className="info-content">
                  <h3>Create Your Wallet</h3>
                  <p>Initialize your trading wallet to start buying and selling stocks</p>
                </div>
              </div>

              <button
                onClick={handleInitWallet}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Initializing..." : "Initialize Wallet"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add Funds */}
        {currentStep === 3 && (
          <div className="setup-step">
            <div className="step-indicator">
              <div className="step-number active">3</div>
              <span className="step-title">Add Funds</span>
            </div>

            <form onSubmit={handleAddFunds} className="setup-form">
              <div className="input-group">
                <label htmlFor="amount">Amount to Add (₹)</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  value={fundAmount}
                  onChange={(e) => {
                    setFundAmount(e.target.value);
                    if (fundError) setFundError("");
                  }}
                  className={fundError ? "input-error" : ""}
                  min="1"
                  step="100"
                />
                {fundError && (
                  <span className="field-error">{fundError}</span>
                )}
              </div>

              <div className="preset-amounts">
                <p className="preset-label">Quick amounts:</p>
                <div className="preset-buttons">
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => setFundAmount("1000")}
                  >
                    ₹1,000
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => setFundAmount("5000")}
                  >
                    ₹5,000
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => setFundAmount("10000")}
                  >
                    ₹10,000
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => setFundAmount("50000")}
                  >
                    ₹50,000
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !fundAmount}
              >
                {loading ? "Processing..." : "Add Funds & Continue"}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="btn-secondary"
                disabled={loading}
              >
                Skip for Now
              </button>
            </form>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="setup-progress">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
            <span>1</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 2 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <span>2</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 3 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <span>3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
