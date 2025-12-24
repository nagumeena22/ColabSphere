import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./Carousel.css";
import Projects from "./Admin/Projects";
import Collaborations from "./Admin/Collaborations";
import Tasks from "./Admin/Tasks";
import Insights from "./Admin/Insights.jsx";
import Settings from "./Settings";

import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";

export default function Home() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const images = [img1, img2, img3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">ColabSphere</div>
        <ul className="nav-links">
          <li><button onClick={() => navigate("/")}>Home</button></li>
          <li><button onClick={() => navigate("/features")}>Features</button></li>
          <li><button onClick={() => navigate("/about")}>About</button></li>
          <li><button onClick={() => navigate("/contact")}>Contact</button></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ColabSphere</h1>
          <p>Discover, Learn, and Collaborate</p>
          <button className="cta-button" onClick={() => navigate("/features")}>
            Explore All Features
          </button>
        </div>

        <div className="carousel-container">
          <img src={images[currentIndex]} alt="slide" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>Features</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Projects</h3>
            <p>Submit ideas & collaborate</p>
            <button onClick={() => navigate("/Projects")}>Explore</button>
          </div>

          <div className="feature-card">
            <h3>Collaborations</h3>
            <p>Work with others</p>
            <button onClick={() => navigate("/features")}>Explore</button>
          </div>

          <div className="feature-card">
            <h3>Insights</h3>
            <p>Analytics & usage</p>
            <button onClick={() => navigate("/features")}>Explore</button>
          </div>

          <div className="feature-card">
            <h3>Settings</h3>
            <p>Customize experience</p>
            <button onClick={() => navigate("/features")}>Explore</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 ColabSphere</p>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>All Features</h2>
            <button onClick={() => navigate("/projects")}>Projects</button>
            <button onClick={() => navigate("/features")}>Collaborations</button>
          </div>
        </div>
      )}
    </div>
  );
}
