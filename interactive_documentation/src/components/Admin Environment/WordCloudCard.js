/**
 * @file WordCloudCard.js
 * @description This component represents a word cloud card with search functionality.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */
import React, { useState, useEffect } from "react";
import { TagCloud } from "react-tagcloud";
import "./../../css/WordCloudCard.css";
import Tooltip from "../Tooltip";

/**
 * WordCloudCard component
 * @param {Object} props - Component props
 * @param {string} props.selectedLocation - The currently selected location
 * @returns {JSX.Element} The rendered word cloud card component
 */
const WordCloudCard = ({ selectedLocation }) => {
  const [wordFrequencyData, setWordFrequencyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredColumn, setHoveredColumn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchWordFrequencyData();
  }, [selectedLocation]);

  /**
   * Fetches the word frequency data from the backend
   */
  const fetchWordFrequencyData = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/protected/analytics/word-frequency?location=${encodeURIComponent(
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
      const sortedData = data.sort((a, b) => b.amount - a.amount);
      setWordFrequencyData(
        sortedData.map((item) => ({
          value: item.keyword,
          count: item.amount,
        }))
      );
    } catch (error) {
      console.error("Error fetching word frequency data:", error);
    }
  };

  /**
   * Handles the search query change
   * @param {Event} event - The search input change event
   */
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredWordFrequencyData = wordFrequencyData.filter(
    (item) => item.count >= 3
  );

  const searchResults = wordFrequencyData.filter((item) =>
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Handles the mouse enter event on the count column
   */
  const handleCountMouseEnter = () => {
    setHoveredColumn(true);
  };

  /**
   * Handles the mouse leave event on the count column
   */
  const handleCountMouseLeave = () => {
    setHoveredColumn(false);
  };

  /**
   * Handles the mouse move event
   * @param {Event} event - The mouse move event
   */
  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="word-cloud-card">
      <h3>Word Cloud</h3>
      <div className="word-cloud-container">
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={filteredWordFrequencyData}
          className="tag-cloud"
        />
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search words..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search words"
        />
        <div className="search-results" onMouseMove={handleMouseMove}>
          <table>
            <tbody>
              {searchResults.map((item, index) => (
                <tr key={index}>
                  <td>{item.value}</td>
                  <td
                    onMouseEnter={handleCountMouseEnter}
                    onMouseLeave={handleCountMouseLeave}
                  >
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {hoveredColumn && <Tooltip text="Count" x={mousePosition.x} y={mousePosition.y} />}
    </div>
  );
};

export default WordCloudCard;