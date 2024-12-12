import React, { useState } from "react";
import "./ApplyForTour.css";
import { Link } from "react-router-dom";
import cityData from "../output/final_data.json";
import DropdownWithDynamicSize from "./DropdownWithDynamicSize";


const ApplyForTour = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [school, setSchool] = useState("");
  const [customSchoolName, setCustomSchoolName] = useState("");
  const [website, setWebsite] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSurname, setTeacherSurname] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [classInfo, setClassInfo] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showCustomSchoolInput, setShowCustomSchoolInput] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);

    const filteredDistricts =
      cityData.find((c) => c.city === selectedCity)?.districts || [];
    setDistricts(filteredDistricts);
    setDistrict("");
    setSchools([]);
    setSchool("");
    setShowCustomSchoolInput(false);
    setCustomSchoolName("");
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);

    const filteredSchools =
      districts.find((d) => d.district === selectedDistrict)?.schools || [];
    setSchools(filteredSchools.map((schoolObj) => schoolObj.school)); // Extract school names
    setSchool("");
    setShowCustomSchoolInput(false);
    setCustomSchoolName("");
  };


  const handleSchoolChange = (e) => {
    const selectedSchool = e.target.value;
    setSchool(selectedSchool);

    if (selectedSchool === "Other") {
      setShowCustomSchoolInput(true);
      setCustomSchoolName("");
    } else {
      setShowCustomSchoolInput(false);
      setCustomSchoolName("");
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      city,
      district,
      schoolName: showCustomSchoolInput ? customSchoolName : school, // Explicitly set schoolName
      website,
      organizationEmail,
      teacherName,
      teacherSurname,
      teacherEmail,
      teacherPhone,
      groupSize,
      classInfo,
      tourDate,
      tourTime,
    };

    try {
      const response = await fetch("http://localhost:8080/apply-tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset all fields
        setCity("");
        setDistrict("");
        setSchool("");
        setCustomSchoolName("");
        setWebsite("");
        setOrganizationEmail("");
        setTeacherName("");
        setTeacherSurname("");
        setTeacherEmail("");
        setTeacherPhone("");
        setGroupSize("");
        setClassInfo("");
        setTourDate("");
        setTourTime("");
        setCurrentStep(1);
        setResponseMessage("Application submitted successfully!");
      } else {
        setResponseMessage(data.error || "An error occurred during submission.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setResponseMessage(
        "An unexpected error occurred while submitting the application."
      );
    }
  };

  return (
    <>
      <div className="container">
        <Link to="/" className="home">
          🏠 Home
        </Link>
        <div className="form-slider">
          {currentStep === 1 && (
            <div className="step">
              <label className="infos">
                City:
                <DropdownWithDynamicSize
                  value={city}
                  onChange={handleCityChange}
                  options={cityData.map((c) => c.city)}
                  placeholder="Select City"
                />
              </label>
              <label className="infos">
                District:
                <DropdownWithDynamicSize
                  value={district}
                  onChange={handleDistrictChange}
                  options={districts.map((d) => d.district)}
                  placeholder="Select District"
                  disabled={!city}
                />
              </label>
              <label className="infos">
                School:
                <DropdownWithDynamicSize
                  value={school}
                  onChange={handleSchoolChange}
                  options={[...schools, "Other"]}
                  placeholder="Select School"
                  disabled={!district}
                />
              </label>
              {showCustomSchoolInput && (
                <label className="infos">
                  School Name:
                  <input
                    type="text"
                    value={customSchoolName}
                    onChange={(e) => setCustomSchoolName(e.target.value)}
                    placeholder="Enter your school name"
                    required
                  />
                </label>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="step">
              <label className="infos">
                Official Website:
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  required
                />
              </label>
              <label className="infos">
                Organization Email:
                <input
                  type="email"
                  value={organizationEmail}
                  onChange={(e) => setOrganizationEmail(e.target.value)}
                  required
                />
              </label>
              <label className="infos">
                Group Size (Max: 50):
                <input
                  type="number"
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  max="50"
                  min="1"
                  required
                />
              </label>
              <label className="infos">
                Class Information:
                <input
                  type="text"
                  value={classInfo}
                  onChange={(e) => setClassInfo(e.target.value)}
                  required
                />
              </label>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step">
              <label className="infos">
                Teacher's Name:
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                />
              </label>
              <label className="infos">
                Teacher's Surname:
                <input
                  type="text"
                  value={teacherSurname}
                  onChange={(e) => setTeacherSurname(e.target.value)}
                  required
                />
              </label>
              <label className="infos">
                Teacher's Email:
                <input
                  type="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  required
                />
              </label>
              <label className="infos">
                Teacher Phone No:
                <input
                  type="tel"
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  required
                />
              </label>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step">
              <label className="infosDay">
                Select a Day:
                <input
                  type="date"
                  value={tourDate}
                  onChange={(e) => {
                    setTourDate(e.target.value);
                  }}
                  required
                />
              </label>
              <h3>Available Times</h3>
              <div className="time-slots">
                
                {["09:00", "11:00", "13:30", "16:00"].map((time) => (
                  <button
                    key={time}
                    className={`time-slot-btn ${tourTime === time ? "selected" : "available"
                      }`}
                    onClick={() => setTourTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="info-container">
          <h1 className="page-title">Bilkent Tour Application</h1>
          <p>Apply in 4 steps</p>
          {currentStep === 1 && <h1>Step 1: Location and School</h1>}
          {currentStep === 2 && <h1>Step 2: Organization Details</h1>}
          {currentStep === 3 && <h1>Step 3: Teacher and Group Details</h1>}
          {currentStep === 4 && (
            <div>
              <h1>Step 4: Select Tour Date and Time</h1>
              <p className="ava">🔵 available</p>
              <p className="notava">🔴 not available</p>
            </div>
          )}
          {responseMessage && (
            <div
              className={`response-message ${responseMessage.includes("Error") ? "error" : "success"
                }`}
            >
              <p>{responseMessage}</p>
            </div>
          )}
        </div>

        <div className="navigation-buttons">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="backk"
              disabled={currentStep === 1}
            >
              Back
            </button>
          )}
          {currentStep < 4 ? (
            <button onClick={handleNextStep} className="next-btn">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="submit-btn">
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplyForTour;
