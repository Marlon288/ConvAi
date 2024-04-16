// Analytics.js
import React, { useState, useEffect } from "react";
import LocationSelector from "./LocationSelector";
//import DownloadPromptsCard from "./DownloadPromptsCard";
//import UsageGraphCard from "./UsageGraphCard";
//import AverageRatingCard from "./AverageRatingCard";

const Analytics = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("global");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/protected/locations");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <div className="analytics-container">
      <div className="card-container">
        <div className="card">
            <LocationSelector
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            />
        </div>
        <div className="card">
          {/* <DownloadPromptsCard selectedLocation={selectedLocation} /> */}
        </div>
        <div className="card">
          {/* <UsageGraphCard selectedLocation={selectedLocation} /> */}
        </div>
        <div className="card">
          {/* <AverageRatingCard selectedLocation={selectedLocation} /> */}
        </div>
      </div>
    </div>
  );
};
export default Analytics;