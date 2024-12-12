import React, { useState } from "react";
import "./IndividualTourApplication.css";
import { Link } from "react-router-dom";

const IndividualTourApplication = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [major, setMajor] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleNextPage = () => {
    setCurrentPage(2);
  };

  const handleBackPage = () => {
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      tourDate,
      tourTime,
      userName,
      userEmail,
      userPhone,
      major,
    };

    try {
      const response = await fetch("http://localhost:8080/apply-individual-tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setTourDate("");
        setTourTime("");
        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setMajor("");
        setResponseMessage("Application submitted successfully!");
        setCurrentPage(1); // Reset to the first page
      } else {
        setResponseMessage(data.error || "An error occurred during submission.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setResponseMessage("An unexpected error occurred while submitting the application.");
    }
  };

  return (
    <div className="individual-tour-container">
    <Link to="/" className="home">
          🏠 Home
        </Link>
      {currentPage === 1 && (
        <>
          <h2>Individual Tour Application - Step 1</h2>
          <form>
            <label>
              Name:
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Phone:
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
              />
            </label>
            <button type="button" onClick={handleNextPage}>
              Next
            </button>
          </form>
          {responseMessage && <p>{responseMessage}</p>}
        </>
      )}

      {currentPage === 2 && (
        <>
          <h2>Individual Tour Application - Step 2</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Select a Day:
              <input
                type="date"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                required
              />
            </label>
            <label>
              Select Your Major of Interest:
              <select value={major} onChange={(e) => setMajor(e.target.value)} required>
                <option value="">Select a Major</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Industrial Engineering">Industrial Engineering</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Molecular Biology and Genetics">Molecular Biology and Genetics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Economics">Economics</option>
                <option value="International Relations">International Relations</option>
                <option value="Psychology">Psychology</option>
                <option value="Law">Law</option>
                <option value="Management">Management</option>
                <option value="Music">Music</option>
                <option value="Performing Arts">Performing Arts</option>
                <option value="American Culture and Literature">American Culture and Literature</option>
                <option value="Political Science and Public Administration">Political Science and Public Administration</option>
                <option value="Urban Design and Landscape Architecture">Urban Design and Landscape Architecture</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Fine Arts">Fine Arts</option>
                <option value="Interior Architecture and Environmental Design">Interior Architecture and Environmental Design</option>
                <option value="Communication and Design">Communication and Design</option>
                <option value="Architecture">Architecture</option>
                <option value="Information Systems and Technologies">Information Systems and Technologies</option>
                <option value="Tourism and Hotel Management">Tourism and Hotel Management</option>
              </select>
             
              <button type="button" onClick={handleBackPage}>
                Back
              </button>
              <button type="submit">Submit</button>
      
            </label>
            
          </form>
          {responseMessage && <p>{responseMessage}</p>}
        </>
      )}
    </div>
  );
};

export default IndividualTourApplication;
