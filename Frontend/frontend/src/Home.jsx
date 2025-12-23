import { useEffect, useState } from "react";
import axios from "axios";
import ProjectForm from "./ProjectForm";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/admin/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setAdmin(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Unauthorized access");
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="container">

      <div className="hero">
        <h1>Welcome, {admin.name} 👋</h1>
        <p>Admin ID: {admin._id}</p>
      </div>

      <div className="gallery">
        <img src="https://source.unsplash.com/400x300/?coding" alt="coding" />
        <img src="https://source.unsplash.com/400x300/?technology" alt="tech" />
        <img src="https://source.unsplash.com/400x300/?hackathon" alt="hackathon" />
      </div>

      <ProjectForm />
    </div>
  );
}
