// LocationSelector.js
import React from "react";
import "./../css/LocationSelector.css";

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

  const sortedCountries = Object.keys(groupedLocations).sort();
  
  return (
    <div className="location-selector">
      <h2>Analytics Dashboard</h2>
      <p>Select a location or country to view analytics data.</p>
      <select value={selectedLocation} onChange={onLocationChange}>
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
    </div>
  );
};

export default LocationSelector;