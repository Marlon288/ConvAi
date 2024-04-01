import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import "./../css/AdminPage.css";
import FileUpload from "../components/FileUpload";
import FileTable from "../components/FileTable";

function AdminPage() {
  const [files, setFiles] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(
        "http://localhost:9000/api/protected/files",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        alert("Failed to fetch files");
      }
    };

    fetchFiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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

  const handleFileUpload = async (file) => {
    console.log(`Uploading ${file?.name}...`);
    // Implement the upload functionality here
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Training Data</h1>
          <svg onClick={handleLogout} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="logout-icon">
            <path d="M3.651 16.989h17.326c0.553 0 1-0.448 1-1s-0.447-1-1-1h-17.264l3.617-3.617c0.391-0.39 0.391-1.024 0-1.414s-1.024-0.39-1.414 0l-5.907 6.062 5.907 6.063c0.196 0.195 0.451 0.293 0.707 0.293s0.511-0.098 0.707-0.293c0.391-0.39 0.391-1.023 0-1.414zM29.989 0h-17c-1.105 0-2 0.895-2 2v9h2.013v-7.78c0-0.668 0.542-1.21 1.21-1.21h14.523c0.669 0 1.21 0.542 1.21 1.21l0.032 25.572c0 0.668-0.541 1.21-1.21 1.21h-14.553c-0.668 0-1.21-0.542-1.21-1.21v-7.824l-2.013 0.003v9.030c0 1.105 0.895 2 2 2h16.999c1.105 0 2.001-0.895 2.001-2v-28c-0-1.105-0.896-2-2-2z"></path>
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