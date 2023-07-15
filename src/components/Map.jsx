import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [placeName, setPlaceName] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const { map, markers } = useMapInit(mapContainer, lat, lng, zoom);
  const { route, displayRoute } = useRouteDisplay(map.current, inputValues);
  const { location, setLocation } = useGeocoding(map.current, buttonPressed, setButtonPressed);

    // New function for when place name input value changes
    const handlePlaceNameChange = async (event) => {
      setPlaceName(event.target.value);
  
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
  
      if (data.features.length > 0) {
        const coordinates = data.features[0].center;
        const foundPlaceName = data.features[0].place_name;
        console.log(`Place: ${foundPlaceName}, Latitude: ${coordinates[1]}, Longitude: ${coordinates[0]}`);
        setSuggestions(data.features.map(feature => feature.place_name));
      }
    };

  return (
    <div>
      <button type="submit" onClick={() => { displayRoute() }}>Go!</button>
      <button onClick={() => setButtonPressed(!buttonPressed)}>
        {buttonPressed ? 'Selecting location...' : 'Select location'}
      </button>
      <input type="text" value={placeName} onChange={handlePlaceNameChange} placeholder="Enter a place name" />
      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map(suggestion => (
            <div key={suggestion} onClick={() => setPlaceName(suggestion)}>{suggestion}</div>
          ))}
        </div>
      )}
      <span>{location.address}</span>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Map;