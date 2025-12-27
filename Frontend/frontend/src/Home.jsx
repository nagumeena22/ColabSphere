import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./Carousel.css";
import Projects from "./Admin/Projects";
import Collaborations from "./Admin/Collaborations";
import Tasks from "./Admin/Tasks";
import ProjectForm from "./ProjectForm";
import Insights from "./Admin/Insights";
import Settings from "./Settings";
import { Link } from "react-router-dom";
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

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>🚀 Welcome to ColabSphere</h1>
          <p>Discover, Learn, and Collaborate in Style!</p>
          <button className="cta-button" onClick={() => navigate("/projects")}>
            🌟 Explore All Features
          </button>
        </div>

        <div className="carousel-container">
          <img src={images[currentIndex]} alt="slide" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>✨ Our Amazing Features</h2>

        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate("/projects")}>
            <div className="feature-icon">📋</div>
            <h3>Projects</h3>
            <p>Submit ideas & collaborate seamlessly</p>
            <button className="feature-btn">Explore Now 🚀</button>
          </div>

          <div className="feature-card" onClick={() => navigate("/admin/collaborations")}>
            <div className="feature-icon">🤝</div>
            <h3>Collaborations</h3>
            <p>Work with others in real-time</p>
            <button className="feature-btn">Join Now 👥</button>
          </div>

          <div className="feature-card" onClick={() => navigate("/admin/insights")}>
            <div className="feature-icon">📊</div>
            <h3>Insights</h3>
            <p>Analytics & usage insights</p>
            <button className="feature-btn">View Stats 📈</button>
          </div>

          <div className="feature-card" onClick={() => navigate("/admin/settings")}>
            <div className="feature-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Customize your experience</p>
            <button className="feature-btn">Configure 🔧</button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 All Features</h2>
            <button onClick={() => navigate("/projects")}>📋 Projects</button>
            <button onClick={() => navigate("/admin/collaborations")}>🤝 Collaborations</button>
            <button onClick={() => setShowModal(false)}>❌ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
