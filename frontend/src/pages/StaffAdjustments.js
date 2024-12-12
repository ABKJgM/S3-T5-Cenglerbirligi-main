import React, { useState, useEffect } from "react";
import "./StaffAdjustments.css";

const StaffAdjustments = () => {
    const [activeTab, setActiveTab] = useState("guides");
    const [loading, setLoading] = useState(true);
    const [guides, setGuides] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [advisors, setAdvisors] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [newUser, setNewUser] = useState({
        name: "",
        surname: "",
        username: "",
        email: "",
        role: "guide", // Default role
    });
    const [generatedPassword, setGeneratedPassword] = useState("");
  
    // Function to generate a random password
    const generatePassword = () => {
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      const passwordLength = 12;
      let password = "";
      for (let i = 0; i < passwordLength; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const guidesRes = await fetch("http://localhost:8080/get-guides");
                const guidesData = guidesRes.ok ? await guidesRes.json() : [];
                setGuides(guidesData);

                const coordinatorsRes = await fetch("http://localhost:8080/get-coordinators");
                const coordinatorsData = coordinatorsRes.ok ? await coordinatorsRes.json() : [];
                setCoordinators(coordinatorsData);

                const advisorsRes = await fetch("http://localhost:8080/get-advisors");
                const advisorsData = advisorsRes.ok ? await advisorsRes.json() : [];
                setAdvisors(advisorsData);
            } catch (error) {
                console.error("Error fetching staff data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, []);

    const handleRowClick = (staffId) => {
        setSelectedStaffId((prevId) => (prevId === staffId ? null : staffId));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleRegister = async (e) => {
        e.preventDefault();
    
        // Generate a password for the new user
        const password = generatePassword();
        setGeneratedPassword(password);
    
        try {
          const response = await fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newUser, password }), // Attach generated password
          });
    
          if (response.ok) {
            alert("User registered successfully!");
            setNewUser({
              name: "",
              surname: "",
              username: "",
              email: "",
              role: "guide",
            });
          } else {
            const errorData = await response.json();
            alert(errorData.error || "Failed to register user.");
          }
        } catch (error) {
          console.error("Error registering user:", error);
          alert("An error occurred. Please try again.");
        }
      };
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
    
        try {
            const response = await fetch("http://localhost:8080/delete-user", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
    
            if (response.ok) {
                alert("User deleted successfully!");
                setGuides((prev) => prev.filter((user) => user._id !== userId));
                setCoordinators((prev) => prev.filter((user) => user._id !== userId));
                setAdvisors((prev) => prev.filter((user) => user._id !== userId));
                setSelectedStaffId(null); // Close details
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="staff-adjustments-container">
            {/* Left Section: Tables */}
            <div className="staff-tables-section">
                <h1 className="title">Staff Adjustments</h1>
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === "guides" ? "active" : ""}`}
                        onClick={() => setActiveTab("guides")}
                    >
                        Guides
                    </button>
                    <button
                        className={`tab ${activeTab === "coordinators" ? "active" : ""}`}
                        onClick={() => setActiveTab("coordinators")}
                    >
                        Coordinators
                    </button>
                    <button
                        className={`tab ${activeTab === "advisors" ? "active" : ""}`}
                        onClick={() => setActiveTab("advisors")}
                    >
                        Advisors
                    </button>
                </div>

                <div className="tab-content">
                    {loading ? (
                        <p>Loading...</p>
                    ) : activeTab === "guides" ? (
                        <table className="staff-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guides.map((guide) => (
                                    <React.Fragment key={guide._id}>
                                        <tr
                                            onClick={() => handleRowClick(guide._id)}
                                            className="clickable-row"
                                        >
                                            <td>{guide.name}</td>
                                            <td>{guide.surname}</td>
                                        </tr>
                                        {selectedStaffId === guide._id && (
                                            <tr className="staff-details-row">
                                                <td colSpan="2">
                                                    <div className="staff-details">
                                                        <p>
                                                            <strong>Username:</strong> {guide.username}
                                                        </p>
                                                        <p>
                                                            <strong>Email:</strong> {guide.email}
                                                        </p>
                                                        <p>
                                                            <strong>Role:</strong> {guide.role}
                                                        </p>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() => handleDeleteUser(guide._id)}
                                                        >
                                                            Delete User
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === "coordinators" ? (
                        <table className="staff-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coordinators.map((coordinator) => (
                                    <React.Fragment key={coordinator._id}>
                                        <tr
                                            onClick={() => handleRowClick(coordinator._id)}
                                            className="clickable-row"
                                        >
                                            <td>{coordinator.name}</td>
                                            <td>{coordinator.surname}</td>
                                        </tr>
                                        {selectedStaffId === coordinator._id && (
                                            <tr className="staff-details-row">
                                                <td colSpan="2">
                                                    <div className="staff-details">
                                                        <p>
                                                            <strong>Username:</strong> {coordinator.username}
                                                        </p>
                                                        <p>
                                                            <strong>Email:</strong> {coordinator.email}
                                                        </p>
                                                        <p>
                                                            <strong>Role:</strong> {coordinator.role}
                                                        </p>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() => handleDeleteUser(coordinator._id)}
                                                        >
                                                            Delete User
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="staff-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                </tr>
                            </thead>
                            <tbody>
                                {advisors.map((advisor) => (
                                    <React.Fragment key={advisor._id}>
                                        <tr
                                            onClick={() => handleRowClick(advisor._id)}
                                            className="clickable-row"
                                        >
                                            <td>{advisor.name}</td>
                                            <td>{advisor.surname}</td>
                                        </tr>
                                        {selectedStaffId === advisor._id && (
                                            <tr className="staff-details-row">
                                                <td colSpan="2">
                                                    <div className="staff-details">
                                                        <p>
                                                            <strong>Username:</strong> {advisor.username}
                                                        </p>
                                                        <p>
                                                            <strong>Email:</strong> {advisor.email}
                                                        </p>
                                                        <p>
                                                            <strong>Role:</strong> {advisor.role}
                                                        </p>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() => handleDeleteUser(advisor._id)}
                                                        >
                                                            Delete User
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Right Section: Register Form */}
            <div className="register-form-section">
                <h2>Register New Staff</h2>
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
                    <label>
                        Role:
                        <select
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                        >
                            <option value="guide">Guide</option>
                            <option value="coordinator">Coordinator</option>
                            <option value="advisor">Advisor</option>
                        </select>
                    </label>
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StaffAdjustments;
