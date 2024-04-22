// RatingBarChart.js
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from "recharts";
import "./../../css/RatingChartCard.css";

const RatingChartCard = ({ selectedLocation }) => {
  const [ratingData, setRatingData] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchRatingData();
  }, [selectedLocation]);

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

  const calculateAverageRating = (data) => {
    const totalRating = data.reduce((sum, entry) => sum + entry.rating * entry.count, 0);
    const totalCount = data.reduce((sum, entry) => sum + entry.count, 0);
    return totalCount > 0 ? totalRating / totalCount : null;
  };

  return (
    <div>
      <h3>Rating Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={ratingData} margin={{ top: 15, right: 10, bottom: 10, left: 10 }}>
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