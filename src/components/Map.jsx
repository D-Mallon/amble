import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';
import DatasetToggle from './Toggle';

import parks from './json_files/parks.json';
import cafes from './json_files/cafes_locations.json';
import community from './json_files/community_locations.json';
import libraries from './json_files/library_locations.json';
import museum_art from './json_files/museum_art_locations.json';
import restaurant from './json_files/restaurant_locations.json';
import worship from './json_files/worship_locations.json';
import walking from './json_files/walking_nodes.json';

import "./Map.css";
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = 'pk.eyJ1IjoiZmluYmFyYWxsYW4iLCJhIjoiY2xqY3NtYWN6MjV0ODNqcXhhaTY4aGQxdSJ9.VeVQzxCCtpyP_MeT1CkjOg';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRefs = useRef([]);
  const [lat, setLat] = useState(40.727872);
  const [lng, setLng] = useState(-73.993157);
  const [zoom, setZoom] = useState(12.4);
  const [datasets, setDatasets] = useState([
    { name: 'parks', label: 'Parks', data: parks, visible: true },
    { name:'cafes', label: 'Cafés', data: cafes, visible: false},
    { name:'community', label: 'Community Centres', data: community, visible: false},
    { name:'libraries', label:"Libraries", data: libraries, visible: false},
    { name:'museums', label: "Museums and Art Galleries", data: museum_art, visible: false},
    { name:'restaurants', label: "Restaurants", data: restaurant, visible: false},
    { name:'worships', label: "Worship Locations", data: worship, visible: false},
    { name:'walking', label: "Walking Nodes", data: walking, visible: false},
  ]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    
    // Function to add markers to the map
    const addMarkers = (dataset) => {
      dataset.data.data.forEach((marker) => {
        const el = document.createElement('div');
        el.className = 'marker ' + dataset.name; // Assign different class according to dataset name
        const newMarker = new mapboxgl.Marker(el)
          .setLngLat([marker.location.longitude, marker.location.latitude])
          .addTo(map.current);

        markerRefs.current.push(newMarker); // Keep track of this marker
      });
    };

    // Clear all markers
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];

    // Add new markers
    datasets.forEach((dataset) => {
      if (dataset.visible) {
        addMarkers(dataset);
      }
    });
  }, [datasets]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const handleDatasetToggle = (datasetName, isVisible) => {
    setDatasets(
      datasets.map(dataset =>
        dataset.name === datasetName ? { ...dataset, visible: isVisible } : dataset
      )
    );
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <DatasetToggle datasets={datasets} onToggle={handleDatasetToggle} />
    </div>
  );
};

export default Map;