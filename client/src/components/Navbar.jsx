import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateTo = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
          <span className="brand-icon">📈</span>
          <span className="brand-text">TradeHub</span>
        </div>

        <div className="navbar-links">
          <button
            className="nav-link"
            onClick={() => navigateTo("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="nav-link"
            onClick={() => navigateTo("/stocks")}
          >
            Markets
          </button>
          <button
            className="nav-link"
            onClick={() => navigateTo("/wallet")}
          >
            Wallet
          </button>
          <button
            className="nav-link"
            onClick={() => navigateTo("/transactions")}
          >
            Transactions
          </button>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <div className="user-details">
              <p className="user-email">{user?.email}</p>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
