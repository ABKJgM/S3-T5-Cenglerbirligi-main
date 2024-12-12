import React, { useState } from "react";
import ApplyForTour from "./ApplyForTour"; // Okul Turu Formu
import IndividualTourApplication from "./IndividualTourApplication"; // Bireysel Turu Formu
import "./TourSelectionPage.css";

const TourSelectionPage = () => {
  const [selectedTourType, setSelectedTourType] = useState("school"); // Varsayılan okul turu

  return (
    <div>
      {/* Seçim Menüsü */}
      <div className="tour-type-selector">
        <button
          className={selectedTourType === "school" ? "active" : ""}
          onClick={() => setSelectedTourType("school")}
        >
          Okul Turu
        </button>
        <button
          className={selectedTourType === "individual" ? "active" : ""}
          onClick={() => setSelectedTourType("individual")}
        >
          Bireysel Turu
        </button>
      </div>

      {/* Seçime Göre Form */}
      <div className="tour-form">
        {selectedTourType === "school" && <ApplyForTour />}
        {selectedTourType === "individual" && <IndividualTourApplication />}
      </div>
    </div>
  );
};

export default TourSelectionPage;
