// Analytics.js
import React, { useState, useEffect } from "react";
import LocationSelector from "./LocationSelectorCard";
import UsageGraph from "./UsageGraph";
import WordCloudCard from "./WordCloudCard";
import RatingChartCard from "./RatingChartCard";

const Analytics = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("global");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    fetch("http://localhost:9000/api/getFormattedLocations")
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  };

  const handleLocationChange = (event) => {
    const value = event.target.value.trim();
    const commaIndex = value.indexOf(',');

    if (commaIndex !== -1) {
      const split = value.split(',');
      setSelectedLocation(`${split[1].trim()},${split[0].trim()}`);
    } else {
      setSelectedLocation(value);
    }
  };

  return (
    <div className="analytics-container">
      <div className="location-selector-container">
        <div className="location-selector-card">
          <LocationSelector
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        </div>
      </div>
      <div className="card-container">
        <div className="card">
        <UsageGraph selectedLocation={selectedLocation} />
        </div>
        <div className="card">
          <WordCloudCard selectedLocation={selectedLocation} />
        </div>
        <div className="card">
          <RatingChartCard selectedLocation={selectedLocation} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;