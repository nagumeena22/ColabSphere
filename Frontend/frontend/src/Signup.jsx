import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    department: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert numeric fields
    const dataToSend = {
      ...formData,
      regNo: parseInt(formData.regNo, 10),
      age: parseInt(formData.age, 10)
    };

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful");
      navigate("/login");

    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input name="regNo" placeholder="Registration Number" onChange={handleChange} required />
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" onChange={handleChange} required />

          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input name="department" placeholder="Department" onChange={handleChange} required />

          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Create Account</button>
        </form>

        <p className="link-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
