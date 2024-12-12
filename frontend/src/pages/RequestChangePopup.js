import React, { useState } from "react";
import "./RequestChangePopup.css";

const RequestChangePopup = ({ tourId, onClose, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [comment, setComment] = useState("");

  const handleSend = () => {
    const changeRequest = {
      tourId,
      newDate: selectedDate,
      newTime: selectedTime,
      comment,
    };
    onSubmit(changeRequest);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>Request Change</h3>
        <div className="popup-field">
          <label htmlFor="date">New Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="popup-field">
          <label htmlFor="time">New Time:</label>
          <input
            type="time"
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>
        <div className="popup-field">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
          />
        </div>
        <div className="popup-buttons">
          <button className="send-button" onClick={handleSend}>
            Send
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestChangePopup;
