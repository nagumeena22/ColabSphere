import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [joinRequestsCount, setJoinRequestsCount] = useState(0);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchUserRole();
    if (userRole === 'admin') {
      fetchJoinRequestsCount();
    }
  }, [userRole]);

  const fetchUserRole = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchJoinRequestsCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/admin/join-requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const requests = await response.json();
        const pendingCount = requests.filter(req => req.status === 'pending').length;
        setJoinRequestsCount(pendingCount);
      }
    } catch (error) {
      console.error('Error fetching join requests count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Hide nav on login/signup
  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-logo">🚀 ColabSphere</div>
      <ul className="nav-links">
        <li><button onClick={() => navigate("/home")}>🏠 Home</button></li>
        <li><button onClick={() => navigate("/projects")}>📋 Projects</button></li>
        <li><button onClick={() => navigate("/ProjectForm")} className="add-project-tab">➕ Add Project</button></li>
        <li><button onClick={() => navigate("/admin/collaborations")}>🤝 Collaborations</button></li>
        <li><button onClick={() => navigate("/admin/insights")}>📊 Insights</button></li>
        {userRole === 'admin' && (
          <li>
            <button onClick={() => navigate("/admin/dashboard")}>
              👑 Admin
              {joinRequestsCount > 0 && (
                <span className="nav-badge">{joinRequestsCount}</span>
              )}
            </button>
          </li>
        )}
        <li><button onClick={handleLogout}>🔓 Logout</button></li>
      </ul>
    </nav>
  );
}

export default NavBar;