/**
 * @file AdminPage.js
 * @description This component represents the admin page where files can be uploaded, deleted, and sorted.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./../css/AdminPage.css";
import FileUpload from "../components/FileUpload";
import FileTable from "../components/FileTable";

/**
 * AdminPage component
 * @returns {JSX.Element} The rendered admin page component
 */
function AdminPage() {
  const [files, setFiles] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
   * Handles the logout action
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
   */
  const handleFileUpload = async (file) => {
    console.log(`Uploading ${file?.name}...`);
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Training Data</h1>
          <svg
            onClick={handleLogout}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="logout-icon"
            role="img"
            aria-label="Logout"
          >
            {/* SVG content for logout icon */}
          </svg>
        </div>
        <FileUpload onFileUpload={handleFileUpload} />
        <FileTable
          files={files}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default AdminPage;