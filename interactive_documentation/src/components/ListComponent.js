/**
 * @file ListComponent.js
 * @description This component renders a list of locations and handles location selection.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React from 'react';
import './../css/ListComponent.css';

/**
 * ListComponent component
 * @param {Object} props - Component props
 * @param {Array} props.locations - Array of location objects
 * @param {Function} props.setLocation - Function to set the selected location
 * @returns {JSX.Element} The rendered list component
 */
const ListComponent = ({ locations, setLocation }) => {
  /**
   * Handles the click event on a location item
   * @param {Object} location - The selected location object
   */
  const handleClick = (location) => {
    setLocation(location);
  };

  return (
    <div className="list-container">
      {locations.map((location, index) => (
        <div
          key={index}
          className="list-item"
          onClick={() => handleClick(location)}
          role="button"
          tabIndex="0"
          aria-label={`Select ${location.location_label}`}
        >
          {location.location_label}
        </div>
      ))}
    </div>
  );
};

export default ListComponent;