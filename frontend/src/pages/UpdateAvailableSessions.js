import React, { useState, useEffect } from "react";
import "./UpdateAvailableSessions.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Schedule = () => {
  const navigate = useNavigate(); // Initialize navigation hook

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const availableSlots = ["09:00", "11:00", "13:30", "16:00"]; // Only include these time slots
  const defaultSchedule = days.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

  const [schedule, setSchedule] = useState(defaultSchedule);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch("http://localhost:8080/authorization", {
          method: "GET",
          credentials: "include", // Include cookies for session-based authentication
        });

        if (response.ok) {
          const data = await response.json();
          if (!data || data.role !== "guide") {
            navigate("/login"); // Redirect if not a guide or unauthorized
          }
        } else {
          navigate("/login"); // Redirect on failure to authenticate
        }
      } catch (error) {
        console.error("Authorization error:", error);
        navigate("/login"); // Redirect on error
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-schedule", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 404) {
          console.warn("No schedule found for user. Displaying empty table.");
        } else if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        } else {
          const data = await response.json();
          const savedSchedule = data.schedule || {};
          setSchedule(savedSchedule);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        alert("Failed to load schedule. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Run both authorization and schedule fetching
    checkAuthorization();
    fetchSchedule();
  }, [navigate]);

  const handleToggleSlot = (day, slot) => {
    setSchedule((prevSchedule) => {
      const updatedSlots = prevSchedule[day]?.includes(slot)
        ? prevSchedule[day].filter((s) => s !== slot) // Remove slot
        : [...(prevSchedule[day] || []), slot]; // Add slot
      return { ...prevSchedule, [day]: updatedSlots };
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8080/save-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ schedule }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      alert("Schedule saved successfully!");
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  return (
    <div className="applications-and-tours">
      <h2 className="title">Set Your Schedule</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Day</th>
            <th colSpan={availableSlots.length}>Available Slots</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              {availableSlots.map((slot) => (
                <td key={slot}>
                  <label>
                    <input
                      type="checkbox"
                      checked={schedule[day]?.includes(slot)}
                      onChange={() => handleToggleSlot(day, slot)}
                    />
                    {slot}
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="verify-button" onClick={handleSave}>
        Save Schedule
      </button>

      <button className="back-button" onClick={() => navigate("/Guide")}>
        Back to Guide
      </button>
    </div>
  );
};

export default Schedule;
