import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Nested routes and navigation
import AdvisorSideBar from "./AdvisorSideBar";
import "./Advisor.css";

const AdvisorLayout = () => {
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
          if (data.role === "advisor") {
            setIsAuthorized(true); // User is an advisor
          } else {
            navigate("/login"); // Redirect non-advisor users to login
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

  return (
    <div className="outer">
      <AdvisorSideBar />
      <div className="content">
        <Outlet /> {/* Display nested routes */}
      </div>
    </div>
  );
};

export default AdvisorLayout;

