import React, { useMemo } from "react";

function FileTable({ files, sortConfig, setSortConfig, searchQuery, setSearchQuery, onDelete }) {
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

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

  const getSortDirectionSymbol = (key) => {
    return sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? " ↓"
        : " ↑"
      : "";
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
                {!file.isDeleted ? (
                  <button className="delete-btn" onClick={() => onDelete(file.name)}>
                    Delete
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileTable;