import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Use Link for navigation
import "./GuideSidebar.css";
import logo from "../indir.jpg"; // Ensure the path is correct

const Sidebar = () => {
  const name = localStorage.getItem("name") || "Guest";
  const surname = localStorage.getItem("surname") || "";
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include", // Include session cookies
      });

      if (response.ok) {
        localStorage.clear(); // Clear all local storage items
        navigate("/login"); // Redirect to login
      } else {
        alert("Failed to log out. Please try again."); // Notify the user
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout. Please try again later.");
    }
  };

  return (
    <div className="sidebar">
      {/* Profile Section */}
      <div className="profile-section">
        <h2 className="brand-name">BIP</h2>
        <p>Bilkent Information Portal</p>
        <img src={logo} alt="Logo" className="logo" />
        <h3 className="profile-name">
          {name} {surname}
        </h3>
        <p className="guidename">Guide</p>
      </div>

      {/* Navigation Menu */}
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="proposals" className="nav-link">
            <span className="icon">🏠</span>
            View Proposals
          </Link>
        </li>
        <li className="nav-item">
          <span className="icon">📊</span>
          <Link to="update-available-sessions" className="nav-link">
            Update Available Sessions
          </Link>
        </li>
        <li className="nav-item">
          <span className="icon">📅</span>
          <Link to="ApprovedTours" className="nav-link">
            View Duties
          </Link>
        </li>
      </ul>

      {/* Logout Section */}
      <button className="logout" onClick={handleLogout}>
        <span className="icon">🔓</span>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
