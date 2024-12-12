import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./GuideSidebar.css";
import logo from "../indir.jpg";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("name");
    localStorage.removeItem("surname");

    // Redirect to the login page
    navigate("/login");
  };

  const name = localStorage.getItem("name");
  const surname = localStorage.getItem("surname");

  return (
    <div className="sidebar">
      {/* Profile Section */}
      <div className="profile-section">
        <h2 className="brand-name">BIP</h2>
        <p>Bilkent Information Portal</p>
      </div>
      <img src={logo} alt="Logo" className="logo" />
      <h3 className="profile-name">{name} {surname}</h3>
      <p className="Guidename">Coordinator</p>
      {/* Navigation Menu */}
      <ul className="nav-menu">
        <li className="nav-item">
          <span className="icon">🏠</span>
          View Proposals
        </li>
        <li className="nav-item">
          <span className="icon">📊</span>
          Update Available Sessions
        </li>
        <li className="nav-item">
          <span className="icon">📅</span>
          View Assigned Duties
        </li>
      </ul>

      {/* Logout Section */}
      <div className="logout-section">
        <li className="logout" onClick={handleLogout}>
          <span className="icon">🔓</span>
          Logout
        </li>
      </div>
    </div>
  );
};

export default Sidebar;
