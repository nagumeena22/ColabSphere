import React, { useEffect, useState } from "react";

import axios from "axios";

const Projectuser = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token

        const res = await axios.get("http://localhost:5000/projects", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProjects(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
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
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <h2>{project.title}</h2>
            <p className="description">{project.description}</p>

            <div className="tech">
              <span>🛠 {project.techStack}</span>
            </div>

            <p className="owner">
              👤 Created by: <b>{project.createdBy}</b>
            </p>

            <button className="join-btn">View / Join</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projectuser;
