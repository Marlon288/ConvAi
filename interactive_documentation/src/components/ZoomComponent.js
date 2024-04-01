import {React, useEffect } from 'react';
import { useMap } from 'react-leaflet';

const ResetZoom = ({ position, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (position && zoom !== undefined) {
      console.log("Position "+position)
      map.flyTo(position, zoom);
    }
  }, [position, zoom, map]);

  return null;
};

export default ResetZoom;
