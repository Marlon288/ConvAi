/**
 * @file RatingBarChart.js
 * @description This component represents a bar chart for rating distribution.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./../../css/RatingChartCard.css";

/**
 * RatingChartCard component
 * @param {Object} props - Component props
 * @param {string} props.selectedLocation - The currently selected location
 * @returns {JSX.Element} The rendered rating chart card component
 */
const RatingChartCard = ({ selectedLocation }) => {
  const [ratingData, setRatingData] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchRatingData();
  }, [selectedLocation]);

  /**
   * Fetches the rating data from the backend
   */
  const fetchRatingData = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/protected/analytics/rating-counts?location=${encodeURIComponent(
          selectedLocation
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRatingData(data);
      setAverageRating(calculateAverageRating(data));
    } catch (error) {
      console.error("Error fetching rating data:", error);
    }
  };

  /**
   * Calculates the average rating from the rating data
   * @param {Array} data - The rating data
   * @returns {number} The average rating
   */
  const calculateAverageRating = (data) => {
    const totalRating = data.reduce((sum, entry) => sum + entry.rating * entry.count, 0);
    const totalCount = data.reduce((sum, entry) => sum + entry.count, 0);
    return totalCount > 0 ? totalRating / totalCount : null;
  };

  return (
    <div className="chart-container">
      <h3>Rating Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={ratingData}
          margin={{ top: 10, right: 10, bottom: 0, left: 0}}
          aria-label="Rating distribution chart"
        >
          <XAxis dataKey="rating" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <div className="average-rating-container">
        {averageRating && !isNaN(averageRating) ? (
          <div className="average-rating">
            Average: {averageRating.toFixed(2)}
          </div>
        ) : (
          <div className="average-rating-placeholder"></div>
        )}
      </div>
    </div>
  );
};

export default RatingChartCard;