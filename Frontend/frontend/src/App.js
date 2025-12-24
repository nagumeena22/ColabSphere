import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";

// Admin Pages (create these components)
import Projects from "./Admin/Projects";
import Collaborations from "./Admin/Collaborations";
import Tasks from "./Admin/Tasks";
import Insights from "./Admin/Insights.jsx";
import Settings from "./Settings";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Login />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User */}
        <Route path="/home" element={<Home />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/collaborations" element={<Collaborations />} />
        <Route path="/admin/tasks" element={<Tasks />} />
        <Route path="/admin/insights" element={<Insights />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
