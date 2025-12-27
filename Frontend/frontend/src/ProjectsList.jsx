import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectsList.css';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  const handleJoinProject = async (projectId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to join projects');
      return;
    }

    setJoining(projectId);
    try {
      const response = await axios.post(
        `http://localhost:5000/users/projects/${projectId}/join`,
        { message: 'I would like to join this project' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Join request submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit join request');
    } finally {
      setJoining(null);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="projects-list">
      <h1>Available Projects</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id || project.id} className="project-card">
            <div className="project-header">
              <h3>{project.domain || 'Project'}</h3>
              <span className="admin-badge">By {project.adminName}</span>
            </div>

            <div className="project-details">
              <p><strong>Department:</strong> {project.department}</p>
              <p><strong>Branch:</strong> {project.branch}</p>
              <p><strong>Skills Needed:</strong> {project.skillsNeeded}</p>
              <p><strong>Description:</strong> {project.projectDescription}</p>
              {project.competitions && (
                <p><strong>Competitions:</strong> {project.competitions}</p>
              )}
            </div>

            <button
              className="join-btn"
              onClick={() => handleJoinProject(project._id)}
              disabled={joining === project._id}
            >
              {joining === project._id ? 'Submitting...' : 'Join Project'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;