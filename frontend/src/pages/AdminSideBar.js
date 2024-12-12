import React from "react";
import "./AdminSideBar.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import logo from "../indir.jpg";
import { Link } from "react-router-dom";

const AdminSideBar = () => {
  const name = localStorage.getItem("name");
  const surname = localStorage.getItem("surname");
  const navigate = useNavigate(); // Initialize navigation hook


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include", // Include session cookies
      });
  
      if (response.ok) {
        // Clear local storage after a successful logout
        localStorage.removeItem("name");
        localStorage.removeItem("surname");
        localStorage.removeItem("username");
  
        // Redirect to the login page
        navigate("/login");
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="sidebar">
      {/* Profile Section */}
      <div className="profile-section">
        <h2 className="brand-name">BIP</h2>
        <p>Bilkent Information Portal</p>
      </div>
      <img src={logo} alt="Logo" className="logo" />
      <h3 className="profile-name">{name} {surname}</h3>
      <p className="Guidename">Admin</p>
      {/* Navigation Menu */}
      <ul className="nav-menu">
        <li className="nav-item">
          <span className="icon">👤</span>
          <Link to="staff-adjustments">
            Staff Adjustments
          </Link>
        </li>
        <li className="nav-item">
          <span className="icon">📚</span>
          <Link to="data-page">
          Records Visiting System
          </Link>
        </li>
        <li className="nav-item">
          <span className="icon">📋</span>
          <Link to="applications-and-tours">
            Applications and Tours
          </Link>
        </li>
        {/* Logout Section */}
      <div className="logout-section">
        <li className="logout" onClick={handleLogout}>
          <span className="icon">🔓</span>
          Logout
        </li>
      </div>
      </ul>
    </div>
  );
};

export default AdminSideBar;
