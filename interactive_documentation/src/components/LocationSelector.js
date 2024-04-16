// LocationSelector.js
import React from "react";

const LocationSelector = ({ locations, selectedLocation, onLocationChange }) => {
  return (
    <div className="location-selector">
      <h2>Analytics Dashboard</h2>
      <p>Select a location or country to view analytics data.</p>
      <select value={selectedLocation} onChange={onLocationChange}>
        <option value="global">Global</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;