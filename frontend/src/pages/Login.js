import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState(""); // Username state
  const [password, setPassword] = useState(""); // Password state
  const [email, setEmail] = useState(""); // Email for forgot password
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Forgot password toggle
  const [message, setMessage] = useState(""); // Message state

  const navigate = useNavigate(); // React Router's navigation hook

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include", // Include cookies for session-based authentication
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");

        // Save user details in local storage
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("surname", data.surname);
        localStorage.setItem("ID", data._id); // guideId ya da kullanıcı ID'sini kaydet
        

        // Redirect based on role
        if (data.role === "guide") {
          navigate("/Guide");
        } else if (data.role === "admin") {
          navigate("/Admin");
        } else if (data.role === "advisor") {
          navigate("/Advisor");
        } else if (data.role === "coordinator") {
          navigate("/Coordinator")
        }
        else {
          navigate("/dashboard");
        }
      } else {
        setMessage(data.error || "Invalid credentials.");
      }
    } catch (error) {
      setMessage("An error occurred while logging in.");
      console.error("Error during login:", error);
    }
  };

  // Handle Forgot Password Submission
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset instructions sent to your email.");
      } else {
        setMessage(data.error || "Error sending reset instructions.");
      }
    } catch (error) {
      setMessage("An error occurred while resetting the password.");
      console.error("Error during password reset:", error);
    }
  };

  return (
    <div className="container">

      <div className="form-container">

        {!isForgotPassword ? (
          <div className="sign-in-form">
            <h1>Log in to BIP</h1>
            <form onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <p>Username</p>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <p>Password</p>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="sign-in-btn">
                Sign In
              </button>
              <Link to="/" className="home">
                🏠Home
              </Link>
            </form>
          </div>
        ) : (
          <div className="reset-password-form">
            <h2>Forgot/Reset Password</h2>
            <p>Enter your email to receive your password:</p>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="sign-in-btn">
                Send Email
              </button>
            </form>
          </div>
        )}
        {message && <p className="message">{message}</p>}
      </div>
      <div className="info-container">
        {!isForgotPassword ? (
          <div>
            <h2>Hello, Friend!</h2>
            <p>Enter your personal details and start your journey with us</p>
            <button
              className="forgot-password-btn"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot/Reset Password
            </button>
          </div>
        ) : (
          <div>
            <h2>Did you forget your password?</h2>
            <button
              className="back-btn"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
