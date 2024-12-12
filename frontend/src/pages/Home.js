import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const backgroundStyle = {
    backgroundImage: 'url("/bilkentImage.png")', // Inline background image
    backgroundSize: "cover", // Ensures the image covers the full page
    backgroundPosition: "center", // Center the background image
    height: "800px", 
    width: "1600px",
    marginTop: "250px", // Pushes the image down
  };
  

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="navbar">
        <nav className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/apply">Apply for a Tour</Link>
          <Link to="/visual-tour">Make a Visual Tour</Link>
          <Link to="/About">About Bilkent</Link>
          <Link to="/CampusLife">Life in the Campus</Link>
        </nav>
      </div>

      {/* Background Section */}
      <div style={backgroundStyle}></div>
    </>
  );
};

export default Home;
