import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  // Hide footer on login/signup
  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ColabSphere</h3>
          <p>Discover, Learn, and Collaborate</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@colabsphere.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" className="social-icon">📘</a>
            <a href="#" className="social-icon">🐦</a>
            <a href="#" className="social-icon">📷</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 ColabSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;