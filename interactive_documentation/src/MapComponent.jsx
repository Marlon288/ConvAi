import {React, useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './css/MapComponent.css';
import ResetZoom from './ResetZoom.js'
import ExpandMap from './ExpandMap.js';     

const poi_icon = new L.Icon({
    iconUrl: '/Resource/Images/poi.svg',
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [15, 35], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

const poi_icon_disable = new L.Icon({
    iconUrl: '/Resource/Images/poi_disabled.svg',
    iconSize: [25, 41],
    iconAnchor: [15, 35],
    popupAnchor: [1, -34],
  });

const MapEffect = ({ isChatOpen }) => {
    const map = useMap();
  
    useEffect(() => {
      // This function is triggered when 'isChatOpen' changes
      setTimeout(() => {
        map.invalidateSize();
      }, 600); // Adjust timeout to match CSS transition
    }, [isChatOpen, map]);
  
    return null;
  };


const MapComponent = ({ isChatOpen, setIsChatOpen, setLocation, locations}) => {
    const [resetZoomData, setResetZoomData] = useState(null);
    
    const defaultZoom = 3; // Default zoom level

    const handlePopupClick = (location) => {
        setResetZoomData({ position: location.coordinates, zoom: defaultZoom });
        setIsChatOpen(true);
        console.log(location);
        setLocation(location);
    };
    
    const position = [47.566453725650305, 8.903938751666576]; // Frauenfeld

return (
    <div className={`map-container ${isChatOpen ? 'minimized' : ''}`}>
        <MapContainer center={position} zoom={4} maxZoom={7} minZoom={3}>
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {locations.map((location, index) => (
            <Marker key={index} position={location.coordinates} icon={location.api_link ? poi_icon : poi_icon_disable}>
            <Popup>
                {location.location_label}
                <br />
                {location.api_link ? 
                    <span style={{ cursor: 'pointer' }} onClick={() => handlePopupClick(location)}> Go to AI </span>:
                "The service is not available at this location yet"}
            </Popup>
            </Marker>
        ))}
        <MapEffect isChatOpen={isChatOpen} />
        {resetZoomData && <ResetZoom position={resetZoomData.position} zoom={resetZoomData.zoom} />}
        </MapContainer>
        {isChatOpen && <ExpandMap isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}> </ExpandMap>}
    </div>
  );
};

export default MapComponent;
