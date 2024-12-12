import React from "react";
import { useNavigate } from "react-router-dom";
import "./VisualTour.css";

const VisualTour = () => {
  const navigate = useNavigate();

  return (
    <div className="visual-tour-container">
      <h2>Explore Bilkent University</h2>
      <div id="map-container">
        <gmp-map 
          center="39.86912155151367,32.748775482177734" 
          zoom="17" 
          map-id="DEMO_MAP_ID"
        >
          <gmp-advanced-marker 
            position="39.86912155151367,32.748775482177734" 
            title="Bilkent University"
          ></gmp-advanced-marker>
        </gmp-map>
      </div>
      <button className="back-button60" onClick={() => navigate("/")}>
        🏠 Home
      </button>
    </div>
  );
};

export default VisualTour;
