/**
 * @file FileUpload.js
 * @description This component renders a file upload interface and handles file selection and upload.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React, { useState, useEffect} from "react";

/**
 * FileUpload component
 * @param {Object} props - Component props
 * @param {Function} props.onFileUpload - Function to handle file upload
 * @returns {JSX.Element} The rendered file upload component
 */
function FileUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState("No file chosen...");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/getLocations");
      if (response.ok) {
        const data = await response.json();
        // Sort the locations alphabetically based on the location_label
        const sortedLocations = data.sort((a, b) =>
          a.location_label.localeCompare(b.location_label)
        );
        setLocations(sortedLocations);
      } else {
        console.error("Failed to fetch locations");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  /**
   * Handles the file change event
   * @param {Object} event - The file change event
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setFileName("No file chosen...");
    }
  };

  /**
   * Handles the upload button click event
   */
  const handleUploadClick = () => {
    if (selectedFile && selectedLocation) {
      onFileUpload(selectedFile, selectedLocation);
    }
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <div className="file-upload">
      <div className="file-select">
        <div
          className="file-select-button"
          id="fileName"
          onClick={() => document.getElementById("chooseFile").click()}
          role="button"
          tabIndex="0"
          aria-label="Choose File"
        >
          Choose File
        </div>
        <div className="file-select-name" id="noFile">
          {fileName}
        </div>
        <input
          type="file"
          name="chooseFile"
          id="chooseFile"
          onChange={handleFileChange}
          style={{ display: "none" }}
          aria-hidden="true"
        />
        <div className="file-select-right">
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="location-select"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location._id} value={location.location_label}>
                {location.location_label}
              </option>
            ))}
          </select>
          <div className={`file-upload-button-container ${selectedLocation ? 'show' : ''}`}>
            {selectedFile && selectedLocation && (
              <button
                type="submit"
                className="file-upload-button"
                onClick={handleUploadClick}
                aria-label="Upload File"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;