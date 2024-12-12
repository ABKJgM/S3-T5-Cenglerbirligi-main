import React, { useEffect, useState } from "react";
import "./DataPage.css";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataPage = () => {
    const [approvedTours, setApprovedTours] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/get-tours");
                const data = await response.json();
                const filtered = data.filter(
                    (tour) => tour.status === "Approved" || tour.status === "Guide Approved"
                );
                setApprovedTours(filtered);
            } catch (error) {
                console.error("Error fetching tours data:", error);
            }
        };

        fetchData();
    }, []);

    const cityCounts = {};
    approvedTours.forEach((tour) => {
        const city = tour.city || "Unknown";
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    const cityLabels = Object.keys(cityCounts);
    const cityData = Object.values(cityCounts);

    const pieChartData = {
        labels: cityLabels,
        datasets: [
            {
                label: "Number of Tours by City",
                data: cityData,
                backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#66BB6A","#FFA726","#8D6E63","#26C6DA"],
                hoverOffset: 4,
            },
        ],
    };

    const monthCounts = {};
    approvedTours.forEach((tour) => {
        if (tour.tourDate) {
            const date = new Date(tour.tourDate);
            const month = date.toLocaleString("default", { month: "short" });
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        }
    });
    const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const filteredMonthOrder = monthOrder.filter((m) => monthCounts[m] != null);

    const barChartData = {
        labels: filteredMonthOrder,
        datasets: [
            {
                label: "Approved Tours",
                data: filteredMonthOrder.map((m) => monthCounts[m] || 0),
                backgroundColor: "#36A2EB",
                borderColor: "#1E88E5",
                borderWidth: 1,
            },
        ],
    };

    const groupRanges = {
        "1-15": 0,
        "16-30": 0,
        "31-45": 0,
        "46-60": 0,
    };
    approvedTours.forEach((tour) => {
        const size = tour.groupSize || 0;
        if (size >= 1 && size <= 15) groupRanges["1-15"]++;
        else if (size >= 16 && size <= 30) groupRanges["16-30"]++;
        else if (size >= 31 && size <= 45) groupRanges["31-45"]++;
        else if (size >= 46 && size <= 60) groupRanges["46-60"]++;

    });

    const doughnutChartData = {
        labels: Object.keys(groupRanges),
        datasets: [
            {
                data: Object.values(groupRanges),
                backgroundColor: ["#EF5350","#AB47BC","#5C6BC0","#29B6F6","#66BB6A"],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="data-page">
            <h1>Data Visualization</h1>

            <div className="chart-container">
                <div className="chart-wrapper">
                    <h3>Chart 1: Tours by City</h3>
                    {cityData.length > 0 ? (
                        <Pie data={pieChartData} />
                    ) : (
                        <p>No data available for city distribution.</p>
                    )}
                </div>

                <div className="chart-wrapper">
                    <h3>Chart 2: Approved Tours by Month</h3>
                    {approvedTours.length > 0 ? (
                        <Bar
                            data={barChartData}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    ) : (
                        <p>No approved tours available.</p>
                    )}
                </div>

                {/* Add a unique class here for the third chart */}
                <div className="chart-wrapper third-chart">
                    <h3>Chart 3: Group Size Distribution</h3>
                    {approvedTours.length > 0 ? (
                        <Doughnut data={doughnutChartData} />
                    ) : (
                        <p>No data available for group size distribution.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataPage;


