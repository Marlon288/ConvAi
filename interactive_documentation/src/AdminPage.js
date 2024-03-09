import React, { useState, useEffect } from "react";
import "./css/AdminPage.css";

function AdminPage() {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("No file chosen...");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Replace this URL with your actual endpoint
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

  const handleDelete = async (fileName) => {
    // Implement file deletion logic here
    console.log(`Deleting ${fileName}...`); // Placeholder logic
    // Update the UI optimistically
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleFileUpload = async () => {
    console.log(`Uploading ${selectedFile?.name}...`);
    // Implement the upload functionality here
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setFileName("No file chosen...");
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredFiles = React.useMemo(() => {
    let filteredFiles = [...files];

    if (searchQuery) {
      filteredFiles = filteredFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortConfig.key !== null) {
      filteredFiles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredFiles;
  }, [files, sortConfig, searchQuery]);

  const getSortDirectionSymbol = (key) => {
    return sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? " ↓"
        : " ↑"
      : "";
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1>Training Data</h1>
        <table className="table">
          <thead>
            <tr>
              <th className="name-column" onClick={() => requestSort("name")}>
                Name{getSortDirectionSymbol("name")}
                <input
                  type="text"
                  placeholder="Search by name..."
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent click event from bubbling up to the column header
                    setSearchQuery(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginLeft: "10px", padding: "2px" }}
                  className="search-input"
                  
                />
              </th>
              <th
                className="date-column"
                onClick={() => requestSort("lastUpdated")}
              >
                Date{getSortDirectionSymbol("lastUpdated")}
              </th>
              <th className="action-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredFiles.map((file) => (
              <tr key={file.name}>
                <td>{file.name}</td>
                <td>{file.lastUpdated}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(file.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
                onClick={handleFileUpload}
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

export default AdminPage;
