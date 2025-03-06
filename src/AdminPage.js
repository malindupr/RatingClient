import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminPage.css";

function AdminPage() {
  const [averageRating, setAverageRating] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRatingStatistics = async () => {
    if (!startDate || !endDate) {
      alert("Please select a date range");
      return;
    }

    setError(null);

    try {
      const startFormatted = startDate.toISOString().split("T")[0];
      const endFormatted = endDate.toISOString().split("T")[0];

      // Fetch average rating
      const avgResponse = await axios.get("http://localhost:5000/average", {
        params: { startDate: startFormatted, endDate: endFormatted },
      });

      // Fetch rating counts
      const countResponse = await axios.get(
        "http://localhost:5000/rating-counts",
        {
          params: { startDate: startFormatted, endDate: endFormatted },
        }
      );

      // Set state with fetched data
      setAverageRating(
        avgResponse.data.averageRating !== null
          ? parseFloat(avgResponse.data.averageRating)
          : null
      );
      setPercentage(
        avgResponse.data.percentage !== null
          ? Math.round(parseFloat(avgResponse.data.percentage))
          : null
      );
      setRatingCounts(countResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error.response || error);
      setError("Error fetching data. Please try again.");
      alert(
        "Error fetching data: " +
          (error.response?.data?.error || error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="admin-page-container">
      <h1>Admin Page</h1>
      <h3>Rating Statistics</h3>

      {/* Date Selection */}
      <div className="date-picker-container">
        <div>
          <label>Start Date: </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Start Date"
            isClearable
          />
        </div>
        <div>
          <label>End Date: </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select End Date"
            isClearable
          />
        </div>
      </div>

      {/* Fetch Data Button */}
      <button onClick={fetchRatingStatistics} className="submit-btn">
        Fetch Data
      </button>

      {/* Display Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display Rating Statistics */}
      <div className="rating-stats">
        <h3>
          Average Rating:{" "}
          {averageRating !== null ? averageRating.toFixed(2) : "N/A"}
        </h3>
        <h3>
          Percentage:{" "}
          {percentage !== null ? `${percentage}%` : "N/A"}
        </h3>
      </div>

      {/* Display Rating Counts */}
      <div className="rating-counts">
        <h3>Rating Breakdown:</h3>
        <ul>
          <li>😡:  {ratingCounts[1]}</li>
          <li>☹️:  {ratingCounts[2]}</li>
          <li>😐:  {ratingCounts[3]}</li>
          <li>😊:  {ratingCounts[4]}</li>
          <li>😁:  {ratingCounts[5]}</li>
        </ul>
      </div>

      {/* Select Question Button */}
      <button
        className="select-question-btn"
        onClick={() => navigate("/select-question")}
      >
        Select Question
      </button>

      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}

export default AdminPage;
