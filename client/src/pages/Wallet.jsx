import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getWallet, creditWallet, withdrawWallet, initWallet } from "../api/wallet.api";
import "../styles/Wallet.css";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [walletNotFound, setWalletNotFound] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositError, setDepositError] = useState("");
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    bankName: "",
    accountNo: "",
    ifsc: ""
  });
  const [withdrawError, setWithdrawError] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const data = await getWallet();
      setBalance(data.balance || 0);
      setError("");
      setWalletNotFound(false);
    } catch (err) {
      const errorMsg = err.error || "Failed to load wallet";
      if (errorMsg.includes("Wallet not found") || errorMsg.includes("404")) {
        setWalletNotFound(true);
        setError("Wallet not initialized. Tap the button below to activate your wallet.");
      } else {
        setError(errorMsg);
        setWalletNotFound(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    setDepositError("");
    const amount = parseFloat(depositAmount);

    if (!depositAmount || amount <= 0) {
      setDepositError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      await creditWallet(amount, "bank");
      setDepositAmount("");
      setShowDepositModal(false);
      await fetchWalletData();
    } catch (err) {
      const errorMsg = typeof err === 'object' ? err.error || JSON.stringify(err) : err;
      setDepositError(errorMsg || "Failed to deposit funds");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawError("");
    const amount = parseFloat(withdrawData.amount);

    if (!withdrawData.amount || amount <= 0) {
      setWithdrawError("Please enter a valid amount");
      return;
    }

    if (!withdrawData.bankName || !withdrawData.accountNo || !withdrawData.ifsc) {
      setWithdrawError("All bank details are required");
      return;
    }

    if (amount > balance) {
      setWithdrawError("Insufficient balance");
      return;
    }

    try {
      setLoading(true);
      await withdrawWallet(
        amount,
        withdrawData.bankName,
        withdrawData.accountNo,
        withdrawData.ifsc,
        "bank"
      );
      setWithdrawData({
        amount: "",
        bankName: "",
        accountNo: "",
        ifsc: ""
      });
      setShowWithdrawModal(false);
      await fetchWalletData();
    } catch (err) {
      const errorMsg = typeof err === 'object' ? err.error || JSON.stringify(err) : err;
      setWithdrawError(errorMsg || "Failed to withdraw funds");
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeWallet = async () => {
    try {
      setLoading(true);
      await initWallet();
      setWalletNotFound(false);
      setError("");
      await fetchWalletData();
    } catch (err) {
      setError(err.error || "Failed to initialize wallet");
    } finally {
      setLoading(false);
    }
  };

  if (loading && balance === 0) {
    return (
      <div className="wallet">
        <Navbar />
        <div className="wallet-loading">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="wallet">
      <Navbar />

      <div className="wallet-container">
        <header className="wallet-header">
          <h1>My Wallet</h1>
          <p>Manage your funds and deposits</p>
        </header>

        {error && (
          <div className={walletNotFound ? "wallet-warning" : "wallet-error"}>
            <p>{error}</p>
            {walletNotFound && (
              <button
                className="btn-initialize"
                onClick={handleInitializeWallet}
                disabled={loading}
              >
                {loading ? "Initializing..." : "✓ Activate Wallet"}
              </button>
            )}
          </div>
        )}

        {!walletNotFound && (
          <>
            <div className="wallet-card">
              <div className="wallet-balance-section">
                <div className="balance-info">
                  <p className="balance-label">Available Balance</p>
                  <h2 className="balance-amount">₹{balance.toFixed(2)}</h2>
                </div>
              </div>

              <div className="wallet-actions">
                <button
                  className="btn-deposit"
                  onClick={() => setShowDepositModal(true)}
                  disabled={loading}
                >
                  💳 Add Funds
                </button>
                <button
                  className="btn-withdraw"
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={loading}
                >
                  🏦 Withdraw
                </button>
              </div>
            </div>
          </>
        )}

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Funds to Wallet</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowDepositModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="input-group">
                  <label>Enter Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g., 1000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="1"
                    step="100"
                  />
                </div>

                {depositError && <p className="error-message">{depositError}</p>}

                <div className="quick-amounts">
                  <p className="quick-label">Quick amounts:</p>
                  <div className="amount-buttons">
                    <button
                      onClick={() => setDepositAmount("1000")}
                      className="amount-btn"
                    >
                      ₹1k
                    </button>
                    <button
                      onClick={() => setDepositAmount("5000")}
                      className="amount-btn"
                    >
                      ₹5k
                    </button>
                    <button
                      onClick={() => setDepositAmount("10000")}
                      className="amount-btn"
                    >
                      ₹10k
                    </button>
                    <button
                      onClick={() => setDepositAmount("50000")}
                      className="amount-btn"
                    >
                      ₹50k
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => setShowDepositModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleDeposit}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Deposit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Withdraw Funds</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="input-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g., 1000"
                    value={withdrawData.amount}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, amount: e.target.value })
                    }
                    min="1"
                    step="100"
                  />
                </div>

                <div className="input-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g., State Bank of India"
                    value={withdrawData.bankName}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, bankName: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g., 1234567890"
                    value={withdrawData.accountNo}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, accountNo: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g., SBIN0001234"
                    value={withdrawData.ifsc}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, ifsc: e.target.value })
                    }
                  />
                </div>

                {withdrawError && <p className="error-message">{withdrawError}</p>}
              </div>

              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleWithdraw}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
