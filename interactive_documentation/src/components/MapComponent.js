/**
 * @file MapComponent.js
 * @description This component renders a map with markers and handles map interactions.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import { React, useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './../css/MapComponent.css';
import ResetZoom from './ZoomComponent.js';
import ExpandMap from './ExpandMapComponent.js';

const poi_icon = new L.Icon({
  iconUrl: '/Resource/Images/poi.svg',
  iconSize: [25, 41],
  iconAnchor: [15, 35],
  popupAnchor: [1, -34],
});

const poi_icon_disable = new L.Icon({
  iconUrl: '/Resource/Images/poi_disabled.svg',
  iconSize: [25, 41],
  iconAnchor: [15, 35],
  popupAnchor: [1, -34],
});

/**
 * MapEffect component
 * @param {Object} props - Component props
 * @param {boolean} props.isChatOpen - Indicates if the chat is open
 * @returns {null} This component does not render anything
 */
const MapEffect = ({ isChatOpen }) => {
  const map = useMap();
  
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 600);
  }, [isChatOpen, map]);

  return null;
};

/**
 * MapComponent component
 * @param {Object} props - Component props
 * @param {boolean} props.isChatOpen - Indicates if the chat is open
 * @param {Function} props.setIsChatOpen - Function to set the chat open state
 * @param {Function} props.setLocation - Function to set the selected location
 * @param {Array} props.locations - Array of location objects
 * @returns {JSX.Element} The rendered map component
 */
const MapComponent = ({ isChatOpen, setIsChatOpen, setLocation, location, locations, selectedLocation,  hoveredLocation }) => {
  const [resetZoomData, setResetZoomData] = useState(null);
  const defaultZoom = 3;
  const position = [47.566453725650305, 8.903938751666576]; // Frauenfeld

  const popupRef = useRef(null);

  useEffect(() => {
    if (hoveredLocation) {
      setResetZoomData({ position: hoveredLocation.coordinates, zoom: defaultZoom, duration: 1 });
    } else if (location) {
      setResetZoomData({ location: location.coordinates, zoom: defaultZoom, duration: 1 });
    }
  }, [hoveredLocation, location]);

  /**
   * Handles the click event on a popup
   * @param {Object} location - The selected location object
   */
  const handlePopupClick = (location) => {
    setIsChatOpen(true);
    setLocation(location);
    if (popupRef.current) {
      popupRef.current._closeButton.click()
    }
  };


  return (
    <div className={`map-container ${isChatOpen ? "minimized" : ""}`}>
      <MapContainer center={position} zoom={4} maxZoom={7} minZoom={3}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.coordinates}
            icon={location.api_link ? poi_icon : poi_icon_disable}
            aria-label={location.location_label}
          >
            <Popup ref={popupRef}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handlePopupClick(location)}
                role="button"
                className="popUpButton"
              >
                {location.location_label}
                <br />
                {location.api_link ? (
                  <span
                    tabIndex="0"
                    aria-label={`Go to AI for ${location.location_label}`}
                  >
                    Click here!
                  </span>
                ) : (
                  "The service is not available at this location yet"
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        <MapEffect isChatOpen={isChatOpen} />
        {resetZoomData && (
          <ResetZoom
            position={resetZoomData.position}
            zoom={resetZoomData.zoom}
          />
        )}
      </MapContainer>
      {isChatOpen && (
        <ExpandMap isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      )}
    </div>
  );
};

export default MapComponent;