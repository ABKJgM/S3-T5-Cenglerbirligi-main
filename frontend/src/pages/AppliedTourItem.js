import React, { useState } from "react";
import "./ApplicationsAndTours.css";

const AppliedTours = ({ tours, assignGuide }) => {
  const [expandedTour, setExpandedTour] = useState(null);

  const handleExpand = (tourId) => {
    setExpandedTour(expandedTour === tourId ? null : tourId);
  };

  return (
    <div className="applied-tours">
      <table className="tours-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>School Name</th>
            <th>City</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <React.Fragment key={tour._id}>
              <tr>
                <td>{tour._id}</td>
                <td>{tour.schoolName}</td>
                <td>{tour.city}</td>
                <td>{tour.status}</td>
                <td>
                  <button onClick={() => handleExpand(tour._id)}>
                    {expandedTour === tour._id ? "Hide Details" : "See All Features"}
                  </button>
                </td>
              </tr>
              {expandedTour === tour._id && (
                <tr className="tour-details">
                  <td colSpan="5">
                    <div>
                      <p><strong>District:</strong> {tour.district}</p>
                      <p><strong>Teacher:</strong> {tour.teacherName} {tour.teacherSurname}</p>
                      <p><strong>Email:</strong> {tour.teacherEmail}</p>
                      <p><strong>Group Size:</strong> {tour.groupSize}</p>
                      <p><strong>Class Info:</strong> {tour.classInfo}</p>
                      <p><strong>Website:</strong> {tour.website}</p>
                      <div>
                        <strong>Assign Guide:</strong>
                        <select onChange={(e) => assignGuide(tour._id, e.target.value)}>
                          <option value="">Select Guide</option>
                          <option value="Guide 1">Guide 1</option>
                          <option value="Guide 2">Guide 2</option>
                          <option value="Guide 3">Guide 3</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedTours;
