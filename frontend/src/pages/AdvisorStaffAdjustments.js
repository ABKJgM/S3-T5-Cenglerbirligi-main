import React, { useState, useEffect } from "react";
import "./AdvisorStaffAdjustments.css";

const AdvisorStaffAdjustments = () => {
    const [guides, setGuides] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [newUser, setNewUser] = useState({
        name: "",
        surname: "",
        username: "",
        email: "",
        role: "guide", // Fixed to "guide"
    });

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch("http://localhost:8080/get-guides");
                const data = await response.json();
                setGuides(data);
            } catch (error) {
                console.error("Error fetching guides:", error);
            }
        };

        fetchGuides();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser), // Fixed role is "guide"
            });

            if (response.ok) {
                alert("Guide registered successfully!");
                setNewUser({ name: "", surname: "", username: "", email: "", role: "guide" });
                const updatedGuides = await fetch("http://localhost:8080/get-guides").then((res) => res.json());
                setGuides(updatedGuides);
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to register guide.");
            }
        } catch (error) {
            console.error("Error registering guide:", error);
        }
    };

    return (
        <div className="staff-adjustments-container">
            <div className="staff-tables-section">
                <h1>Guides</h1>
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guides.map((guide) => (
                            <tr key={guide._id}>
                                <td>{guide.name}</td>
                                <td>{guide.surname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="register-form-section">
                <h2>Register New Guide</h2>
                <form onSubmit={handleRegister}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Surname:
                        <input
                            type="text"
                            name="surname"
                            value={newUser.surname}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    {/* Removed Role Dropdown */}
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdvisorStaffAdjustments;
