import React, { useEffect, useState } from "react";
import "./Usercss.css";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/users/projects", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProjects(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <h2 className="loading">Loading Projects...</h2>;
  }

  return (
    <div className="projects-page">
      <h1 className="title">🚀 Projects Available</h1>

      <img
        src="https://images.unsplash.com/photo-1531482615713-2afd69097998"
        alt="projects banner"
        className="banner"
      />

      <div className="projects-container">
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            
            <h2>{project.domain.toUpperCase()} PROJECT</h2>

            <p className="description">
              {project.projectDescription}
            </p>

            <div className="tech">
              <span>🧠 Skills Needed: {project.skillsNeeded}</span>
            </div>

            <p className="owner">
              👤 Admin: <b>{project.adminName}</b>
            </p>

            <p className="meta">
              🏫 Department: {project.department} | Branch: {project.branch}
            </p>

            <p className="meta">
              🏆 Competitions: {project.competitions}
            </p>

            <button className="join-btn">View / Join</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
