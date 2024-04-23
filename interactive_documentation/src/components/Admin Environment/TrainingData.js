/**
 * @file TrainingData.js
 * @description This component represents the training data page with file upload and table.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */
import React, { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import FileTable from "./FileTable";

const TrainingData = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    /**
     * Fetches the list of files from the backend
     */
    const fetchFiles = async () => {
      const response = await fetch("http://localhost:9000/api/protected/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        alert("Failed to fetch files");
      }
    };

    fetchFiles();
  }, []);

  /**
   * Handles the deletion of a file
   * @param {string} fileName - The name of the file to delete
   */
  const handleDelete = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:9000/api/protected/files/${fileName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFiles(files.map(file => {
          if (file.name === fileName) {
            return { ...file, name: '- - - D E L E T E D - - -', lastUpdated: '', isDeleted: true };
          }
          return file;
        }));
      } else {
        alert('There was an error deleting the file.');
      }
    } catch (error) {
      console.error('There was an error deleting the file:', error);
      alert('There was an error deleting the file.');
    }
  };

  /**
   * Handles the file upload
   * @param {File} file - The file to upload
   * @param {string} location - The location to upload the file to
   */
  const handleFileUpload = async (file, location) => {
    console.log(`Uploading ${file?.name} to ${location}...`);
  };

  return (
    <div>
      <h1>Training Data</h1>
      <FileTable
        files={files}
        onDelete={handleDelete}
      />
      <FileUpload onFileUpload={handleFileUpload} />
    </div>
  );
};

export default TrainingData;