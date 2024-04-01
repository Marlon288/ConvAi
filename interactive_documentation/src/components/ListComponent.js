import React from 'react';
import './../css/ListComponent.css'; // Make sure to create this CSS file

const ListComponent = ({locations, setLocation}) => {

  const handleClick = (location) => {
    setLocation(location);
  };

  return (
    <div className="list-container">
      {locations.map((location, index) => (
        <div key={index} className="list-item" onClick={() => handleClick(location)}>
          {location.location_label} 
        </div>
      ))}
    </div>
  );
};

export default ListComponent;
