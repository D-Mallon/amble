// useRouteDisplay.js
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const useRouteDisplay = (map, inputValues) => {

  const [route, setRoute] = useState([]);

  const displayRoute = async () => {
    console.log('displayRoute called');
    if (!map || !inputValues || !inputValues.waypoints || !inputValues.longitude || !inputValues.latitude || !inputValues.endLongitude || !inputValues.endLatitude) return;

    try {
      let waypointsString = "";
      if (inputValues.waypoints.length > 0) {
        waypointsString = inputValues.waypoints
          .map((waypoint) => `${waypoint[1]},${waypoint[0]}`)
          .join(";");
      }

      console.log(inputValues.waypoints)
      console.log("ways:", waypointsString);

      const callAPI = `https://api.mapbox.com/directions/v5/mapbox/walking/` +
        `${inputValues["longitude"]},` +
        `${inputValues["latitude"]};` +
        `${waypointsString};` +
        `${inputValues["endLongitude"]},` +
        `${inputValues["endLatitude"]}` +
        `?geometries=geojson&access_token=${mapboxgl.accessToken}`
      const response = await fetch(callAPI);
      const data = await response.json();

      console.log(data);

      if (!data.routes[0] || !data.routes[0].geometry) {
        console.error('Invalid data:', data);
        return;
      }

      // Retrieve the route coordinates from the API response
      const routeCoordinates = data.routes[0].geometry.coordinates;

      // Check that routeCoordinates is an array of valid numbers
      if (!Array.isArray(routeCoordinates) ||
        routeCoordinates.some(coord => coord.length !== 2 || isNaN(coord[0]) || isNaN(coord[1]))) {
        console.error('Invalid route coordinates:', routeCoordinates);
        return;
      }

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
      routeCoordinates.forEach((coord) => {
        if (Array.isArray(coord) && coord.length === 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
          bounds.extend(coord);
        } else {
          console.error('Invalid coordinate:', coord);
        }
      });

      if (!bounds.isEmpty()) {
        console.log('Bounds:', bounds.toArray()); // Log the bounds
        map.fitBounds(bounds, { padding: 320 });
      } else {
        console.error('No valid coordinates to fit bounds');
      }

      setRoute(routeCoordinates);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    displayRoute();
  }, [inputValues.waypoints]);

  return { route, displayRoute };
};

export default useRouteDisplay;
