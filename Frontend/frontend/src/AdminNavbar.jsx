import { NavLink } from "react-router-dom";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <h2 className="logo">AdminPanel</h2>

      <ul className="nav-links">
        <li>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/admin/projects">Projects</NavLink>
        </li>
        <li>
          <NavLink to="/admin/collaborations">Collaborations</NavLink>
        </li>
        <li>
          <NavLink to="/admin/tasks">Tasks</NavLink>
        </li>
        <li>
          <NavLink to="/admin/insights">Insights</NavLink>
        </li>
        <li>
          <NavLink to="/admin/settings">Settings</NavLink>
        </li>
      </ul>
    </nav>
  );
}
