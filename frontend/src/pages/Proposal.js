import React, { useState, useEffect } from "react";
import "./Proposals.css";

const Proposals = () => {
    const [assignedTours, setAssignedTours] = useState([]); // State for assigned tours
    const guideId = localStorage.getItem("ID"); // Get guide ID from localStorage

    useEffect(() => {
        if (!guideId) {
            console.error("Guide ID not found in localStorage. Please log in again.");
            return;
        }

        const fetchAssignedTours = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-assigned-tours?guideId=${guideId}`
                );
                const data = await response.json();

                if (response.ok) {
                    setAssignedTours(data); // Save assigned tours to state
                } else {
                    console.error(data.error || "Failed to fetch assigned tours");
                }
            } catch (error) {
                console.error("Error fetching assigned tours:", error);
            }
        };

        fetchAssignedTours();
    }, [guideId]);

    const handleApprove = async (proposalId) => {
        try {
            const response = await fetch("http://localhost:8080/approve-proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposalId, guideId }), // guideId gönderildi
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Proposal approved successfully.");
                // Update the status locally without refetching
                setAssignedTours((prev) =>
                    prev.map((tour) =>
                        tour._id === proposalId ? { ...tour, status: "Guide Approved" } : tour
                    )
                );
            } else {
                alert(data.error || "Failed to approve proposal.");
            }
        } catch (error) {
            console.error("Error approving proposal:", error);
            alert("An error occurred while approving the proposal.");
        }
    };

    const handleDeny = async (proposalId) => {
        try {
            const response = await fetch("http://localhost:8080/deny-proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposalId, guideId }), // guideId gönderildi
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Proposal denied successfully.");
                // Update the status locally without refetching
                setAssignedTours((prev) =>
                    prev.map((tour) =>
                        tour._id === proposalId
                            ? { ...tour, status: "Approved", guide: null } // Guide bilgisi temizlenir
                            : tour
                    )
                );
            } else {
                alert(data.error || "Failed to deny proposal.");
            }
        } catch (error) {
            console.error("Error denying proposal:", error);
            alert("An error occurred while denying the proposal.");
        }
    };

    return (
        <div className="proposals-container">
            <h2>Assigned Tours</h2>
            {assignedTours.length > 0 ? (
                <table className="proposals-table">
                    <thead>
                        <tr>
                            <th>School Name</th>
                            <th>City</th>
                            <th>District</th>
                            <th>Teacher</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedTours.map((tour) => {
                            if (tour.status === "Approved") {
                                return (
                                    <tr key={tour._id}>
                                        <td>{tour.schoolName || "Unknown"}</td>
                                        <td>{tour.city || "Unknown"}</td>
                                        <td>{tour.district || "Unknown"}</td>
                                        <td>
                                            {tour.teacherName} {tour.teacherSurname}
                                        </td>
                                        <td>{tour.status}</td>
                                        <td>
                                            <button onClick={() => handleApprove(tour._id)}>Approve</button>
                                            <button onClick={() => handleDeny(tour._id)}>Deny</button>
                                        </td>
                                    </tr>
                                );
                            } 
                        })}
                    </tbody>
                </table>
            ) : (
                <p className="empty-state">No assigned tours yet.</p>
            )}
        </div>
    );
};

export default Proposals;
