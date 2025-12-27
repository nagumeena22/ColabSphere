import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Projectview from "./Projectview";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import ProjectForm from "./ProjectForm";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Projectuser from "./User/Projectuser.jsx";
// Admin Pages (create these components)
import Projects from "./Admin/Projects";
import Collaborations from "./Admin/Collaborations";
import Tasks from "./Admin/Tasks";
import Insights from "./Admin/Insights.jsx";
import Settings from "./Settings";
import ProjectsList from "./ProjectsList";
import JoinRequests from "./Admin/JoinRequests";
import "./App.css";
import Main from "./Main.jsx";
function App() {
  return (
    <Router>
      <NavBar />
      <div className="main-content">
        <Routes>
          {/* Default */}
          <Route path="/" element={<Login />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User */}
          <Route path="/home" element={<Home />} />
          <Route path="/view" element={<Projectview />} />
          <Route path="/ProjectForm" element={<ProjectForm />} />
         <Route path="/main" element={<Main />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/users/projectuser" element={< Projectuser/>} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/collaborations" element={<Collaborations />} />
          <Route path="/admin/tasks" element={<Tasks />} />
          <Route path="/admin/insights" element={<Insights />} />
          <Route path="/admin/join-requests" element={<JoinRequests />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/Home" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
