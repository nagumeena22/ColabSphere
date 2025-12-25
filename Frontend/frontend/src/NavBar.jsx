import { useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide nav on login/signup
  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-logo">🚀 ColabSphere</div>
      <ul className="nav-links">
        <li><button onClick={() => navigate("/home")}>🏠 Home</button></li>
        <li><button onClick={() => navigate("/ProjectForm")}>📋 Projects</button></li>
        <li><button onClick={() => navigate("/admin/dashboard")}>👑 Admin</button></li>
        <li><button onClick={() => navigate("/login")}>🔓 Logout</button></li>
      </ul>
    </nav>
  );
}

export default NavBar;