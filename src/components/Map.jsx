import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import parks from './parks.json';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Start } from '@mui/icons-material';

import useRouteDisplay from './useRouteDisplay';
import useGeocoding from './useGeocoding';
import useMapInit from './useMapInit';

const apiKey = import.meta.env.VITE_MAPBOX_API_KEY
mapboxgl.accessToken = apiKey;

const Map = ({ inputValues }) => {
  const mapContainer = useRef(null);
  const [lat, setLat] = useState(40.727872);
  const [lng, setLng] = useState(-73.993157);
  const [zoom, setZoom] = useState(12.4);
  const [buttonPressed, setButtonPressed] = useState(false);

  const { map, markers } = useMapInit(mapContainer, lat, lng, zoom);
  const { route, displayRoute } = useRouteDisplay(map.current, inputValues);
  const { location, setLocation } = useGeocoding(map.current, buttonPressed, setButtonPressed);

  return (
    <div>
      <button type="submit" onClick={() => { displayRoute() }}>Go!</button>
      <button onClick={() => setButtonPressed(!buttonPressed)}>
        {buttonPressed ? 'Selecting location...' : 'Select location'}
      </button>
      <span>{location.address}</span>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Map;