/**
 * @file ZoomComponent.js
 * @description This component is responsible for resetting the zoom level and position of the map.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import { React, useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * ResetZoom component
 * @param {Object} props - Component props
 * @param {Array} props.position - The position to zoom to
 * @param {number} props.zoom - The zoom level to set
 * @returns {null} This component does not render anything
 */
const ResetZoom = ({ position, zoom, duration }) => {
  const map = useMap();

  useEffect(() => {
    if (position && zoom !== undefined) {
      map.flyTo(position, zoom, {
        duration: duration
      });
    }
  }, [position, zoom, map]);

  return null;
};

export default ResetZoom;