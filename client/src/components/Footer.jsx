import { useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <div className="footer-brand">
              <span className="brand-icon">📈</span>
              <span className="brand-text">TradeHub</span>
            </div>
            <p className="brand-description">
              Your modern trading platform for stocks and investments. Trade smart, invest wisely.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Twitter" className="social-icon">𝕏</a>
              <a href="#" aria-label="Facebook" className="social-icon">f</a>
              <a href="#" aria-label="LinkedIn" className="social-icon">in</a>
              <a href="#" aria-label="Instagram" className="social-icon">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              </li>
              <li>
                <button onClick={() => navigate("/stocks")}>Markets</button>
              </li>
              <li>
                <button onClick={() => navigate("/wallet")}>Wallet</button>
              </li>
              <li>
                <button onClick={() => navigate("/stock-transactions")}>Trade History</button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Documentation</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2026 TradeHub. All rights reserved. Made with 💚 for traders.
          </p>
          <button className="scroll-to-top" onClick={scrollToTop} title="Back to top">
            ↑ Top
          </button>
        </div>
      </div>
    </footer>
  );
}
