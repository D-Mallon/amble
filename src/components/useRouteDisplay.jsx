// useRouteDisplay.js
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const useRouteDisplay = (map, inputValues) => {
  const [route, setRoute] = useState([]);

  const displayRoute = async () => {
    if (!map || !inputValues) return;

    try {
      const waypointsString = inputValues.waypoints
        .map((waypoint) => `${waypoint[1]},${waypoint[0]}`)
        .join(";");

      const callAPI = `https://api.mapbox.com/directions/v5/mapbox/walking/` +
        `${inputValues["longitude"]},` +
        `${inputValues["latitude"]};` +
        `${waypointsString},` +
        `?geometries=geojson&access_token=${mapboxgl.accessToken}`
      const response = await fetch(callAPI);
      const data = await response.json();

      // Retrieve the route coordinates from the API response
      const routeCoordinates = data.routes[0].geometry.coordinates;

      // Create a GeoJSON feature with the route coordinates
      const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates,
        },
      };

      // Clear existing map layers (if any)
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }

      // Add the route layer to the map
      map.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON,
      });
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b9ddd',
          'line-width': 4,
        },
      });

      // Fit the map to display the route
      const bounds = new mapboxgl.LngLatBounds();
      routeCoordinates.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 400 });

      setRoute(routeCoordinates);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return { route, displayRoute };
};

export default useRouteDisplay;
