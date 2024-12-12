import React from "react";
import { Link } from "react-router-dom";
import "./LifeInTheCampus.css";

const LifeInTheCampus = () => {
  return (
    <div className="campus-page">
      <header className="campus-header">
      <Link to="/" className="home-button">🏠 Home</Link>
        <h1>Life in the Campus</h1>
      </header>
      <div className="campus-container">
        <section className="campus-section">
          <h2 className="campus-title">A Dynamic and Enriching Environment</h2>
          <p className="campus-text">
            Bilkent University provides a dynamic environment for students to develop intellectually, emotionally, and socially. The campus is designed to support a balanced lifestyle, offering facilities and services that cater to a wide range of interests and needs.
          </p>
        </section>
        <section className="campus-section">
          <h2 className="campus-title">Sports and Recreation</h2>
          <p className="campus-text">
            For sports enthusiasts, Bilkent offers comprehensive facilities for exercise, practice, and competition. Students can participate in various sports activities, ensuring a healthy and active lifestyle.
          </p>
        </section>
        <section className="campus-section">
          <h2 className="campus-title">Clubs and Organizations</h2>
          <p className="campus-text">
            The university hosts numerous student clubs and organizations, providing platforms for students to engage in cultural, social, and professional activities. These groups regularly organize talks, panels, concerts, exhibitions, and festivals, enriching the campus experience.
          </p>
        </section>
        <section className="campus-section">
          <h2 className="campus-title">Arts and Culture</h2>
          <p className="campus-text">
            Bilkent is a leader in music and performing arts in Turkey. The Bilkent Symphony Orchestra performs regularly at the University Concert Hall, and the Performing Arts Department hosts scheduled performances, offering students ample opportunities to engage with the arts.
          </p>
        </section>
        <section className="campus-section">
          <h2 className="campus-title">Support Services</h2>
          <p className="campus-text">
            The campus is inviting, friendly, and safe, with residential and dining services, academic and personal assistance, counseling, and many other programs dedicated to providing an enriching and enjoyable experience for students.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LifeInTheCampus;
