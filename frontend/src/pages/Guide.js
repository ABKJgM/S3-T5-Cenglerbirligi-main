import React, { useState, useEffect }  from "react";
import { Outlet } from "react-router-dom"; // For nested routes
import GuideSidebar from "./GuideSidebar";
import "./Guide.css";
import logo from "../indir.jpg";
import { useNavigate } from 'react-router-dom';

const Guide = () => {
  var name;
  var surname;
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
          if (data.role === "guide") {
            name = data.name;
            surname = data.surname;
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
    <div className="outer">
      <GuideSidebar /> {/* Sidebar is always visible */}
      <div className="content">
        <Outlet /> {/* Nested routes will be displayed here */}
      </div>
    </div>
  );
};

export default Guide;
