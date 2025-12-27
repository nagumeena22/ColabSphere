import { useState } from "react";
import axios from "axios";

export default function ProjectForm() {
  const [data, setData] = useState({
    department: "",
    branch: "",
    domain: "",
    skillsNeeded: "",
    projectDescription: "",
    competitions: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ get token stored during admin login
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/users/add", // ✅ CORRECT URL
        data,
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ REQUIRED
          }
        }
      );

      alert("Project Submitted Successfully ✅");

      // reset form
      setData({
        department: "",
        branch: "",
        domain: "",
        skillsNeeded: "",
        projectDescription: "",
        competitions: ""
      });

    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Unauthorized / Error");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add New Project</h2>

      <input
        name="department"
        placeholder="Department"
        value={data.department}
        onChange={handleChange}
        required
      />

      <input
        name="branch"
        placeholder="Branch"
        value={data.branch}
        onChange={handleChange}
        required
      />

      <input
        name="domain"
        placeholder="Domain"
        value={data.domain}
        onChange={handleChange}
        required
      />

      <input
        name="skillsNeeded"
        placeholder="Skills Needed"
        value={data.skillsNeeded}
        onChange={handleChange}
        required
      />

      <textarea
        name="projectDescription"
        placeholder="Project Description"
        value={data.projectDescription}
        onChange={handleChange}
        required
      />

      <input
        name="competitions"
        placeholder="Competitions (Optional)"
        value={data.competitions}
        onChange={handleChange}
      />

      <button type="submit">Submit Project</button>
    </form>
  );
}
