/**
 * @file FileUpload.js
 * @description This component renders a file upload interface and handles file selection and upload.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React, { useState } from "react";

/**
 * FileUpload component
 * @param {Object} props - Component props
 * @param {Function} props.onFileUpload - Function to handle file upload
 * @returns {JSX.Element} The rendered file upload component
 */
function FileUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState("No file chosen...");
  const [selectedFile, setSelectedFile] = useState(null);

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
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
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
        {selectedFile && (
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
  );
}

export default FileUpload;