// Analytics.js
import React, { useState, useEffect } from "react";
import LocationSelector from "./LocationSelector";
//import DownloadPromptsCard from "./DownloadPromptsCard";
import UsageGraph from "./UsageGraph";
import ListComponent from "./ListComponent"
//import AverageRatingCard from "./AverageRatingCard";

const Analytics = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("global");

  useEffect(() => {
    fetchLocations();
  }, []);

  /**
   * Fetches the list of locations from the backend
   */
  const fetchLocations = () => {
    fetch("http://localhost:9000/api/getFormattedLocations")
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value.trim());
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
           <UsageGraph selectedLocation={selectedLocation} /> 
        </div>
        <div className="card">
          {/* <AverageRatingCard selectedLocation={selectedLocation} /> */}
        </div>
      </div>
    </div>
  );
};
export default Analytics;