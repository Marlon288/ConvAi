/**
 * @file FileTable.js
 * @description This component renders a table of files with sorting and searching capabilities.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React, { useMemo } from "react";

/**
 * FileTable component
 * @param {Object} props - Component props
 * @param {Array} props.files - Array of file objects
 * @param {Object} props.sortConfig - Object containing the current sort configuration
 * @param {Function} props.setSortConfig - Function to set the sort configuration
 * @param {string} props.searchQuery - The current search query
 * @param {Function} props.setSearchQuery - Function to set the search query
 * @param {Function} props.onDelete - Function to handle file deletion
 * @returns {JSX.Element} The rendered file table component
 */
function FileTable({ files, sortConfig, setSortConfig, searchQuery, setSearchQuery, onDelete }) {
  /**
   * Requests sorting of files based on the provided key
   * @param {string} key - The key to sort by
   */
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };


  /**
   * Sorts and filters the files based on the current sort configuration and search query
   * @returns {Array} The sorted and filtered files
   */
  const sortedAndFilteredFiles = useMemo(() => {
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

  /**
   * Gets the sort direction symbol for the provided key
   * @param {string} key - The key to get the sort direction symbol for
   * @returns {string} The sort direction symbol
   */
  const getSortDirectionSymbol = (key) => {
    return sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? " ↓"
        : " ↑"
      : "\u00A0\u00A0\u00A0";
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th className="name-column" onClick={() => requestSort("name")}>
              Name{getSortDirectionSymbol("name")}
              <input
                type="text"
                placeholder="Search by name..."
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchQuery(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ marginLeft: "10px", padding: "2px" }}
                className="search-input"
                aria-label="Search by name"
              />
            </th>
            <th className="location-column" onClick={() => requestSort("location")}>
              Location{getSortDirectionSymbol("location")}
              <input
                type="text"
                placeholder="Search by location..."
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchQuery(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ marginLeft: "10px", padding: "2px" }}
                className="search-input"
                aria-label="Search by name"
              />
            </th>
            <th className="date-column" onClick={() => requestSort("lastUpdated")}>
              Date{getSortDirectionSymbol("lastUpdated")}
            </th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
        {sortedAndFilteredFiles.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>{file.location}</td>
              <td>{file.lastUpdated}</td>
              <td>
                {!file.isDeleted && (
                  <button className="delete-btn" onClick={() => onDelete(file.name)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileTable;