import React, { useState } from "react";

function FileUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState("No file chosen...");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setFileName("No file chosen...");
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div class="file-upload">
      <div class="file-select">
        <div
          className="file-select-button"
          id="fileName"
          onClick={() => document.getElementById("chooseFile").click()}
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
        />
        {selectedFile && (
          <button
            type="submit"
            className="file-upload-button"
            onClick={handleUploadClick}
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

export default FileUpload;