/**
 * @file ListComponent.js
 * @description This component renders a list of locations with collapsible subcategories and handles location selection.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React, { useState } from 'react';
import './../css/ListComponent.css';

/**
 * ListComponent component
 * @param {Object} props - Component props
 * @param {Array} props.locations - Array of location objects
 * @param {Function} props.setLocation - Function to set the selected location
 * @returns {JSX.Element} The rendered list component
 */
const ListComponent = ({ locations, setLocation }) => {
  const [expandedCountries, setExpandedCountries] = useState([]);

  /**
   * Handles the click event on a location item
   * @param {Object} location - The selected location object
   */
  const handleLocationClick = (location) => {
    setLocation(location);
  };

  /**
   * Handles the click event on a country item
   * @param {string} country - The selected country
   */
  const handleCountryClick = (country) => {
    if (expandedCountries.includes(country)) {
      setExpandedCountries(expandedCountries.filter((c) => c !== country));
    } else {
      setExpandedCountries([...expandedCountries, country]);
    }
  };

  // Group locations by country
  const locationsByCountry = locations.reduce((acc, location) => {
    const { location_country } = location;
    if (acc[location_country]) {
      acc[location_country].push(location);
    } else {
      acc[location_country] = [location];
    }
    return acc;
  }, {});

  // Sort countries alphabetically
  const sortedCountries = Object.keys(locationsByCountry).sort();

  return (
    <div className="list-container">
      {sortedCountries.map((country) => (
        <div key={country}>
          <div
            className="country-item"
            onClick={() => handleCountryClick(country)}
            role="button"
            tabIndex="0"
            aria-label={`Expand ${country}`}
          >
            {country}
            <span className="arrow">
              {expandedCountries.includes(country) ? '  ▼' : '  ▶'}
            </span>
          </div>
          {expandedCountries.includes(country) && (
            <div className="location-list">
              {locationsByCountry[country].map((location, index) => (
                <div
                  key={index}
                  className="list-item"
                  onClick={() => handleLocationClick(location)}
                  role="button"
                  tabIndex="0"
                  aria-label={`Select ${location.location_label}`}
                >
                  {location.location_label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListComponent;