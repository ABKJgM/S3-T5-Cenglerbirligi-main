import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./WelcomePage.css";

const WelcomePage = () => {
    //const navigate = useNavigate(); // React Router navigation hook
        const navigate = useNavigate();
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [isLoading, setIsLoading] = useState(true); // To handle loading state
      
        useEffect(() => {
          const checkAuthorization = async () => {
            try {
              const response = await fetch("http://localhost:8080/authorization", {
                credentials: "include", // Ensure cookies (session) are sent with the request
              });
      
              if (response.ok) {
                const data = await response.json();
                if (data.role === "admin") {
                  setIsAuthorized(true); // User is an admin
                } else {
                  navigate("/login"); // Redirect non-admin users to login
                }
              } else {
                navigate("/login"); // Redirect if not authenticated
              }
            } catch (error) {
              console.error("Authorization error:", error);
              navigate("/login"); // Redirect on error
            } finally {
              setIsLoading(false); // Stop loading
            }
          };
      
          checkAuthorization();
        }, [navigate]);
      
        if (isLoading) {
          // Optional loading state
          return <div>Loading...</div>;
        }
      
        if (!isAuthorized) {
          // Prevent rendering if not authorized
          return null;
        }
      

    const handleGetStarted = () => {
        navigate("/admin/applications-and-tours"); // Replace with the actual route to Applications and Tours
    };

    return (
        <div className="welcome-page">
            <h1>Welcome to the Admin Dashboard</h1>
            <p>Manage your information system efficiently.</p>
            <button className="cta-button" onClick={handleGetStarted}>
                Get Started
            </button>
        </div>
    );
};

export default WelcomePage;
