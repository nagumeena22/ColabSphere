import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Login />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/home" element={<Home />} />
         <Route path="/adminDashboard" element={<AdminDashboard />} />
      
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
