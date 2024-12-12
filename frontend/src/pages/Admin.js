import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Nested routes and navigation
import AdminSideBar from "./AdminSideBar";
import "./Admin.css";

const AdminLayout = () => {
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

  return (
    <div className="outer">
      <AdminSideBar />
      <div className="content">
        <Outlet /> {/* Display nested routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
