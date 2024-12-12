import React, { useState, useEffect } from "react";
import "./ApprovedTours.css";

const ApprovedTours = () => {
    const [approvedTours, setApprovedTours] = useState([]);
    const [guideTours, setGuideTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("approved"); // Manage active section
    const guideId = localStorage.getItem("ID");
    const guideName = localStorage.getItem("name");
    const guideSurname = localStorage.getItem("surname");

    useEffect(() => {
        const fetchTours = async () => {
            console.log("fetchTours function is running"); // fetchTours çağrılıyor mu?

            setLoading(true);
            try {
                const response = await fetch("http://localhost:8080/get-tours");
                const data = await response.json();
                console.log(data);

                if (response.ok && Array.isArray(data)) {
                    // Separate the tours into Approved and Guide Approved
                    const approved = data.filter(tour => tour.status === "Approved");
                    const guide = data.filter(tour => tour.status === "Guide Approved");
                    const guideApproved = guide.filter(tour => tour.guide.id === guideId);


                    setApprovedTours(approved);
                    setGuideTours(guideApproved);
                } else {
                    console.error("Failed to fetch verified tours or invalid format.");
                }
            } catch (error) {
                console.error("Error fetching verified/guide approved tours:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, [guideId, guideName, guideSurname]);

    const handleAssign = async (proposalId) => {
        try {
            const response = await fetch("http://localhost:8080/assign-guide-to-tour", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposalId, guideId, guideName, guideSurname }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Successfully assigned to the tour.");
                // Remove from the approvedTours since it's now Guide Approved
                setApprovedTours((prev) => prev.filter((tour) => tour._id !== proposalId));

                // Optionally, add it to guideTours array
                // But since the backend now returns Guide Approved tours, you might want to re-fetch or just manually add:
                // If the previously assigned tour data was known, you could add it here.
                // For simplicity, just refetch or rely on a subsequent refresh to load guideApproved tours.
            } else {
                alert(data.error || "Failed to assign to the tour.");
            }
        } catch (error) {
            console.error("Error assigning to tour:", error);
            alert("An error occurred while assigning to the tour.");
        }
    };

    const handleDropAssignment = async (proposalId) => {
        try {
            const response = await fetch("http://localhost:8080/deny-proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposalId, guideId }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Successfully dropped the assignment.");
                // Remove from guideTours since it's no longer assigned
                setGuideTours((prev) => prev.filter((tour) => tour._id !== proposalId));
            } else {
                alert(data.error || "Failed to drop the assignment.");
            }
        } catch (error) {
            console.error("Error dropping the assignment:", error);
            alert("An error occurred while dropping the assignment.");
        }
    };

    const handleComplete = async (tourId) => {
        try {
            const response = await fetch("http://localhost:8080/mark-tour-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tourId, guideId }), // Pass additional data if required
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Tour marked as completed.");
                // Update the status of the tour locally
                setGuideTours((prev) =>
                    prev.map((tour) =>
                        tour._id === tourId ? { ...tour, status: "Completed" } : tour
                    )
                );
            } else {
                alert(data.error || "Failed to mark the tour as completed.");
            }
        } catch (error) {
            console.error("Error marking tour as completed:", error);
            alert("An error occurred while marking the tour as completed.");
        }
    };

    if (loading) return <p>Loading tours...</p>;

    return (
        <div className="approved-tours-container">
            <h2>Tour Management</h2>
            <div className="tabs">
                <button
                    className={activeSection === "approved" ? "tab active" : "tab"}
                    onClick={() => setActiveSection("approved")}
                >
                    Approved Tours
                </button>
                <button
                    className={activeSection === "myTours" ? "tab active" : "tab"}
                    onClick={() => setActiveSection("myTours")}
                >
                    My Assigned Tours
                </button>
            </div>
    
            {activeSection === "approved" && (
                <div>
                    <h3>Approved Tours</h3>
                    {approvedTours.length > 0 ? (
                        <table className="approved-tours-table">
                            <thead>
                                <tr>
                                    <th>School Name</th>
                                    <th>City</th>
                                    <th>District</th>
                                    <th>Teacher</th>
                                    <th>Group Size</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedTours.map((tour) => (
                                    <tr key={tour._id}>
                                        <td>{tour.schoolName || "Unknown"}</td>
                                        <td>{tour.city || "Unknown"}</td>
                                        <td>{tour.district || "Unknown"}</td>
                                        <td>
                                            {tour.teacherName} {tour.teacherSurname}
                                        </td>
                                        <td>{tour.groupSize}</td>
                                        <td>{tour.tourDate ? new Date(tour.tourDate).toLocaleDateString() : "Unknown"}</td>
                                        <td>{tour.tourTime || "Unknown"}</td>
                                        <td>
                                            <button onClick={() => handleAssign(tour._id)}>Assign to Me</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No approved tours available at the moment.</p>
                    )}
                </div>
            )}
    
            {activeSection === "myTours" && (
                <div>
                    <h3>My Assigned Tours</h3>
                    {guideTours.length > 0 ? (
                        <table className="approved-tours-table">
                            <thead>
                                <tr>
                                    <th>School Name</th>
                                    <th>City</th>
                                    <th>District</th>
                                    <th>Teacher</th>
                                    <th>Group Size</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guideTours.map((tour) => (
                                    <tr key={tour._id}>
                                        <td>{tour.schoolName || "Unknown"}</td>
                                        <td>{tour.city || "Unknown"}</td>
                                        <td>{tour.district || "Unknown"}</td>
                                        <td>
                                            {tour.teacherName} {tour.teacherSurname}
                                        </td>
                                        <td>{tour.groupSize}</td>
                                        <td>{tour.tourDate ? new Date(tour.tourDate).toLocaleDateString() : "Unknown"}</td>
                                        <td>{tour.tourTime || "Unknown"}</td>
                                        <td>{tour.status}</td>
                                        <td>
                                            {tour.status !== "Completed" && (
                                                <>
                                                    <button onClick={() => handleComplete(tour._id)}>
                                                        Mark as Completed
                                                    </button>
                                                    <button className="drop" onClick={() => handleDropAssignment(tour._id)}>
                                                        Drop Assignment
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No tours assigned to you yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};   

export default ApprovedTours;
