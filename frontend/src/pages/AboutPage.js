import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <Link to="/" className="home-button">🏠 Home</Link>
        <h1>About Bilkent</h1>
      </header>
      <div className="about-container">
        <p className="about-text">
          Established on October 20, 1984, by Professor İhsan Doğramacı, Bilkent University is Turkey's first private, nonprofit institution of higher education. The university's name, "Bilkent," is a portmanteau of "bilim kenti," meaning "city of science," symbolizing its mission to serve as a center of excellence in higher education and research.
        </p>
        <p className="about-text">
          Located approximately 12 kilometers west of Ankara's city center, Bilkent's sprawling campus spans over 300 hectares. This urban setting offers a dynamic environment for academic pursuits and extracurricular activities alike.
        </p>
        <h2 className="about-subtitle">Academic Programs</h2>
        <p className="about-text">
          Bilkent University provides a diverse range of programs across multiple faculties and schools, including:
        </p>
        <ul className="about-list">
          <li>Faculty of Art, Design, and Architecture</li>
          <li>Faculty of Business Administration</li>
          <li>Faculty of Engineering</li>
          <li>Faculty of Humanities and Letters</li>
          <li>Faculty of Science</li>
        </ul>
        <p className="about-text">
          With 33 undergraduate and 32 graduate programs, Bilkent fosters an interdisciplinary academic environment.
        </p>
        <h2 className="about-subtitle">Library and Research</h2>
        <p className="about-text">
          Bilkent University houses Turkey's largest university library, featuring an extensive collection of books, periodicals, and digital resources. This facility serves as a crucial hub for research and learning.
        </p>
        <h2 className="about-subtitle">Global Recognition</h2>
        <p className="about-text">
          Recognized for its academic excellence, Bilkent University has consistently ranked among the top universities in Turkey by the Times Higher Education World University Rankings, showcasing its dedication to quality education and research.
        </p>
        <p className="about-text">
          In essence, Bilkent University embodies a commitment to advancing knowledge and fostering innovation, upholding its mission to contribute to the global academic community.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
