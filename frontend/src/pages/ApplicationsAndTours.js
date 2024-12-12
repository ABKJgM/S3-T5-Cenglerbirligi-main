import React, { useState, useEffect } from "react";
import "./ApplicationsAndTours.css";
import total from "../output/total.json";
import departmentsData from "../output/merged_output.json";
import RequestChangePopup from "./RequestChangePopup"; // Adjust the path as needed


const ApplicationsAndTours = () => {
  const [activeTab, setActiveTab] = useState("applied");
  const [appliedTours, setAppliedTours] = useState([]);
  const [verifiedTours, setVerifiedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [guides, setGuides] = useState([]);
  const [approvedTours, setApprovedTours] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [availableGuidesByTour, setAvailableGuidesByTour] = useState({});

  useEffect(() => {
    const fetchAvailableGuides = async () => {
      for (const tour of verifiedTours) {
        if (tour.tourDate && tour.tourTime) {
          try {
            const res = await fetch(
              `http://localhost:8080/get-available-guides?tourDate=${tour.tourDate}&tourTime=${tour.tourTime}`
            );
            const data = res.ok ? await res.json() : [];
            setAvailableGuidesByTour((prev) => ({ ...prev, [tour._id]: data }));
          } catch (error) {
            console.error("Error fetching available guides for a tour:", error);
          }
        } else {
          // If tour doesn't have a proper date/time, no guides are available
          setAvailableGuidesByTour((prev) => ({ ...prev, [tour._id]: [] }));
        }
      }
    };

    if (verifiedTours.length > 0) {
      fetchAvailableGuides();
    }
  }, [verifiedTours]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await fetch("http://localhost:8080/get-guides");
        if (!res.ok) {
          throw new Error(`Failed to fetch guides: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setGuides(data); // Update guides state
        } else {
          console.error("Unexpected format for guides data:", data);
        }
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };


    const fetchData = async () => {

      try {
        // Fetch applied tours
        const appliedRes = await fetch("http://localhost:8080/get-waiting-applications");
        const appliedData = appliedRes.ok ? await appliedRes.json() : [];
        const sortedApplications = sortApplications(Array.isArray(appliedData) ? appliedData : []);
        setAppliedTours(sortedApplications);

        // Fetch verified tours
        const verifiedRes = await fetch("http://localhost:8080/get-verified-tours");
        const verifiedData = verifiedRes.ok ? await verifiedRes.json() : [];
        setVerifiedTours(Array.isArray(verifiedData) ? verifiedData : []);

        setApprovedTours(Array.isArray(verifiedData) ? verifiedData : []);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchGuides();
    fetchData();
  }, []);

  const sortApplications = (applications) => {
    return applications.sort((a, b) => {
      // 1. Compare by number of students who came (Descending order)
      const totalA = getTotalPeople(a.schoolName) || 0;
      const totalB = getTotalPeople(b.schoolName) || 0;
      if (totalA !== totalB) {
        return totalB - totalA; // Higher number of students first
      }

      // 2. Compare by city priority (Schools outside Ankara first)
      const isACityAnkara = a.city.toLowerCase() === "ankara";
      const isBCityAnkara = b.city.toLowerCase() === "ankara";
      if (isACityAnkara !== isBCityAnkara) {
        return isACityAnkara ? 1 : -1; // Schools outside Ankara have higher priority
      }

      // 3. Compare by application time (Earlier time first)
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    });
  };
  const handleSendEmail = async (tourId, email) => {
    try {
      const response = await fetch("http://localhost:8080/send-approved-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId, email }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    }
  };

  const getTotalPeopleByDepartment = (schoolName) => {
    const departments = Object.keys(departmentsData);
    const results = [];

    departments.forEach((department) => {
      const departmentData = departmentsData[department];
      const schoolData = departmentData.schools.find(
        (school) => school.school_name === schoolName
      );
      if (schoolData) {
        results.push({ department, totalPeople: schoolData.total_people });
      }
    });

    return results;
  };

  const getTotalPeople = (schoolName) => {
    // `schools` arrayine erişiyoruz
    const schoolsArray = total.schools || [];

    // `find` ile istenen okulu buluyoruz
    const schoolData = schoolsArray.find((school) => school.school_name === schoolName);

    // Eğer okul bulunursa `total_people`, bulunamazsa "N/A" döner
    return schoolData ? schoolData.total_people : "N/A";
  };


  const handleRowClick = (tourId) => {
    setSelectedTourId((prevId) => (prevId === tourId ? null : tourId));
  };

  const [selectedGuides, setSelectedGuides] = useState({}); // Store selected guides by tour ID

  const handleGuideChange = (tourId, guideId) => {
    setSelectedGuides((prev) => ({
      ...prev,
      [tourId]: guideId, // Update the guide for the specific tour
    }));
  };

  const handleAssignGuide = async (tourId) => {
    const guideId = selectedGuides[tourId]; // Get the selected guide for this tour
    if (!guideId) {
      alert("Please select a guide first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/assign-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId,
          guideId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Guide assigned successfully!");

        // Update verified tours to replace the dropdown with the assigned guide's name
        setVerifiedTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === tourId
              ? { ...tour, guide: guides.find((g) => g._id === guideId) }
              : tour
          )
        );

        // Clear the selected guide for this tour
        setSelectedGuides((prev) => ({
          ...prev,
          [tourId]: "", // Reset guide selection for this tour
        }));

      } else {
        alert(data.error || "Failed to assign guide.");
      }
    } catch (error) {
      console.error("Error assigning guide:", error);
      alert("An error occurred while assigning the guide.");
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [currentTourId, setCurrentTourId] = useState(null);

  const openPopup = (tourId) => {
    setCurrentTourId(tourId);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentTourId(null);
  };

  const handleRequestChangeSubmit = async (changeRequest) => {
    try {
      const response = await fetch("", { // Add the URL here
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changeRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to send change request");
      }

      alert("Change request sent successfully!");
    } catch (error) {
      console.error("Error sending change request:", error);
      alert("Failed to send change request. Please try again.");
    } finally {
      closePopup();
    }
  };

  const handleVerify = async (applicationId) => {
    try {
      const response = await fetch("http://localhost:8080/approve-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds: [applicationId] }),
      });

      if (response.ok) {
        alert("Application approved successfully!");
        // Re-fetch data
        const appliedRes = await fetch("http://localhost:8080/get-waiting-applications");
        setAppliedTours(await appliedRes.json());
        const verifiedRes = await fetch("http://localhost:8080/get-verified-tours");
        setVerifiedTours(await verifiedRes.json());
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to approve application.");
      }
    } catch (err) {
      console.error("Error approving application:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDeny = async (tourId) => {
    try {
      const response = await fetch("http://localhost:8080/delete-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: tourId }),
      });

      if (response.ok) {
        alert("Application denied successfully!");
        // Re-fetch data
        const appliedRes = await fetch("http://localhost:8080/get-waiting-applications");
        setAppliedTours(await appliedRes.json());
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to deny application.");
      }
    } catch (err) {
      console.error("Error denying application:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="applications-and-tours">
      <h1 className="title">Applications and Tours</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "applied" ? "active" : ""}`}
          onClick={() => setActiveTab("applied")}
        >
          Applied Tours
        </button>
        <button
          className={`tab ${activeTab === "verified" ? "active" : ""}`}
          onClick={() => setActiveTab("verified")}
        >
          Verified Tours
        </button>
        <button
          className={`tab ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved Tours
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "applied" ? (
          loading ? (
            <p>Loading...</p>
          ) : appliedTours.length === 0 ? (
            <p className="empty-state">No waiting applications found.</p>
          ) : (
            <table className="applied-tours-table">
              <thead>
                <tr>
                  <th>School Name</th>
                  <th>City</th>
                  <th>District</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appliedTours.map((tour) => (
                  <React.Fragment key={tour._id}>
                    <tr
                      onClick={() => handleRowClick(tour._id)}
                      className="clickable-row"
                    >
                      <td>{tour.schoolName || "Unknown"}</td>
                      <td>{tour.city || "Unknown"}</td>
                      <td>{tour.district || "Unknown"}</td>
                      <td>{tour.status || "Pending"}</td>
                    </tr>
                    {selectedTourId === tour._id && (
                      <tr className="tour-details-row">
                        <td colSpan="4">
                          <div className="tour-details">
                            <div className="details-header">
                              <h3>Details</h3>
                              <div className="detail-buttons" key={tour._id}>
                                <button className="veri-button" onClick={() => handleVerify(tour._id)}>
                                  Verify
                                </button>
                                <button className="deny-button" onClick={() => handleDeny(tour._id)}>
                                  Deny
                                </button>
                                <button className="request-change-button" onClick={() => openPopup(tour._id)}>
                                  Request Change
                                </button>
                              </div>
                            </div>
                            <p>
                              <strong>Teacher Name:</strong>{" "}
                              {tour.teacherName || "N/A"}
                            </p>
                            <p>
                              <strong>Teacher Surname:</strong>{" "}
                              {tour.teacherSurname || "N/A"}
                            </p>
                            <p>
                              <strong>Teacher Email:</strong>{" "}
                              {tour.teacherEmail || "N/A"}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {tour.teacherPhone || "N/A"}
                            </p>
                            <p>
                              <strong>Tour Date:</strong>{" "}
                              {tour.tourDate || "N/A"}
                            </p>
                            <p>
                              <strong>Tour Time:</strong>{" "}
                              {tour.tourTime || "N/A"}
                            </p>
                            <p>
                              <strong>Guide:</strong>{" "}
                              {tour.guide || "Not Assigned"}
                            </p>
                            <p>
                              <strong>Class Info:</strong>{" "}
                              {tour.classInfo || "N/A"}
                            </p>
                            <p>
                              <strong>Number of graduates who chose Bilkent (last 3 years):</strong>{" "}
                              {getTotalPeople(tour.schoolName)}
                            </p>
                            <p>
                              <strong>Departments:</strong>
                            </p>
                            <ul>
                              {getTotalPeopleByDepartment(tour.schoolName).map(
                                (entry, index) => (
                                  <li key={index}>
                                    {entry.department}: {entry.totalPeople}{" "}
                                    students
                                  </li>
                                )
                              )}
                            </ul>

                          </div>

                        </td>

                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tr>
                <td colSpan="4" className="SortInfo">
                  <strong>Sorting Criteria:</strong> Applications are prioritized by:
                  <ol>
                    <li><strong>Number of students who came:</strong> Schools with more students have higher priority.</li>
                    <li><strong>City priority:</strong> Schools from outside Ankara are prioritized over Ankara schools.</li>
                    <li><strong>Application time:</strong> Earlier applications are prioritized.</li>
                  </ol>
                </td>
              </tr>
            </table>
          )
        ) : activeTab === "verified" ? (
          loading ? (
            <p>Loading...</p>
          ) : verifiedTours.length === 0 ? (
            <p className="empty-state">No verified tours available.</p>
          ) : (
            <table className="verified-tours-table">
              <thead>
                <tr>
                  <th>School Name</th>
                  <th>City</th>
                  <th>District</th>
                  <th>Status</th>
                  <th>Tour Date</th>
                  <th>Guide</th>
                </tr>
              </thead>
              <tbody>
                {verifiedTours.map((tour) => (
                  <tr key={tour._id}>
                    <td>{tour.schoolName || "Unknown"}</td>
                    <td>{tour.city || "Unknown"}</td>
                    <td>{tour.district || "Unknown"}</td>
                    <td>{tour.status || "Verified"}</td>
                    <td>{tour.tourDate + " " + tour.tourTime || "Unknown"}</td>
                    <td>
                      {tour.guide ? (
                        <p>
                          <strong>
                            {tour.guide.name} {tour.guide.surname}
                          </strong>
                        </p>
                      ) : (
                        <div>
                          <select
                            className="assign-guide-dropdown"
                            value={selectedGuides[tour._id] || ""}
                            onChange={(e) => handleGuideChange(tour._id, e.target.value)}
                          >
                            <option value="">Select a Guide</option>
                            {availableGuidesByTour[tour._id]?.map((guide) => (
                              <option key={guide._id} value={guide._id}>
                                {guide.name} {guide.surname}
                              </option>
                            ))}
                          </select>
                          <button
                            className="assign-btn"
                            onClick={() => handleAssignGuide(tour._id)}
                          >
                            Assign
                          </button>
                        </div>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          approvedTours.length === 0 ? (
            <p className="empty-state">No approved tours available.</p>
          ) : (
            <table className="approved-tours-table">
              <thead>
                <tr>
                  <th>School Name</th>
                  <th>City</th>
                  <th>District</th>
                  <th>Tour Date</th>
                  <th>Organization Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedTours.map((tour) => (
                  <tr key={tour._id}>
                    <td>{tour.schoolName || "Unknown"}</td>
                    <td>{tour.city || "Unknown"}</td>
                    <td>{tour.district || "Unknown"}</td>
                    <td>{tour.tourDate + " " + tour.tourTime || "Unknown"}</td>
                    <td>{tour.organizationEmail || "N/A"}</td>
                    <td>
                      <button
                        className="send-email-btn"
                        onClick={() =>
                          handleSendEmail(tour._id, tour.organizationEmail)
                        }
                      >
                        Send Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
      {/* Popup Component */}
        {showPopup && (
          <RequestChangePopup
            tourId={currentTourId}
            onClose={closePopup}
            onSubmit={handleRequestChangeSubmit}
          />
        )}
    </div>
  );
}
export default ApplicationsAndTours;
