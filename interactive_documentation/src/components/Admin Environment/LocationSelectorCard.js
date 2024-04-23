/**
 * @file LocationSelector.js
 * @description This component is a location selector including options for global, countries, and cities, depending on the available locations.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */
import React from "react";
import "./../../css/LocationSelector.css";

/**
 * LocationSelector component
 * @param {Object} props - Component props
 * @param {Array} props.locations - The array of locations
 * @param {string} props.selectedLocation - The currently selected location
 * @param {Function} props.onLocationChange - The function to handle location change
 * @returns {JSX.Element} The rendered location selector component
 */
const LocationSelector = ({ locations, selectedLocation, onLocationChange }) => {
  const groupedLocations = locations.reduce((acc, location) => {
    const [country, city] = location.split(",");
    if (!acc[country]) {
      acc[country] = [];
    }
    if (city) {
      acc[country].push(city.trim());
    }
    return acc;
  }, {});

  /**
   * Handles the download of analytics data
   */
  const handleDownload = async () => {
    try {
      let endpoint = "http://localhost:9000/api/protected/analytics";
      if (selectedLocation === "global") {
        endpoint += "/prompts";
      } else if (selectedLocation.includes(",")) {
        const [location] = selectedLocation.split(",");
        endpoint += `/location/${location.trim()}`;
      } else {
        endpoint += `/country/${selectedLocation}`;
      }
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "prompts.json";
      link.click();
    } catch (error) {
      console.error("Error downloading prompts:", error);
    }
  };

  const sortedCountries = Object.keys(groupedLocations).sort();
  return (
    <div className="location-selector">
      <h2>Analytics Dashboard</h2>
      <p>Select a location or country to view or download analytics data.</p>
      <div className="input-container">
        <select
          value={selectedLocation}
          onChange={onLocationChange}
          aria-label="Location selection"
        >
          <option value="global">Global</option>
          {sortedCountries.map((country) => (
            <React.Fragment key={country}>
              <option value={country}>{country}</option>
              {groupedLocations[country].sort().map((city) => (
                <option key={`${country},${city}`} value={`${country},${city}`}>
                  &nbsp;&nbsp;{city}
                </option>
              ))}
            </React.Fragment>
          ))}
        </select>
        <div
          className="download-button"
          onClick={handleDownload}
          role="button"
          aria-label="Download analytics data"
        >
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M512 666.5L367.2 521.7l36.2-36.2 83 83V256h51.2v312.5l83-83 36.2 36.2L512 666.5zm-204.8 50.3V768h409.6v-51.2H307.2z"></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;