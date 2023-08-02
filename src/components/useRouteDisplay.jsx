// useRouteDisplay.js
import { useState, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArrayContext, useWaypointsArray } from '../context/ArrayContext';

// might be substituted with all_nodes.json after Cormac's approval
import community_locations from '../json-files/community_locations.json';
import library_locations from '../json-files/library_locations.json';
import museum_art_locations from '../json-files/museum_art_locations.json';
import park_locations from '../json-files/park_locations.json';
import park_node_locations from '../json-files/park_node_locations.json';
import walking_node_locations from '../json-files/walking_node_locations.json';
import worship_locations from '../json-files/worship_locations.json';

const parseWaypoints = (ways) => {
  return ways.split(";").map((way) => {
    const [longitude, latitude] = way.split(",").map(Number);
    return { latitude, longitude };
  });
};

const matchWaypointsWithData = (waypoints, jsonData) => {
  return waypoints.map((waypoint) => {
    return jsonData.find(
      (data) =>
        data.location.latitude === waypoint.latitude &&
        data.location.longitude === waypoint.longitude
    );
  });
};

const handleWaypoints = (waypointsString, setGlobalArrayValue) => {
  const waypoints = parseWaypoints(waypointsString);
  const jsonData = [
    ...community_locations.data,
    ...library_locations.data,
    ...museum_art_locations.data,
    ...park_locations.data,
    ...park_node_locations.data,
    ...walking_node_locations.data,
    ...worship_locations.data,
  ];
  const arrayTemp = matchWaypointsWithData(waypoints, jsonData);
  setGlobalArrayValue(arrayTemp);
};



const useRouteDisplay = (map, inputValues) => {

  const { globalArray, setGlobalArrayValue } = useWaypointsArray();
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

      if (waypointsString) {
        handleWaypoints(waypointsString, setGlobalArrayValue);
      }

      console.log(inputValues.waypoints)
      console.log("ways:", waypointsString);

      const callAPI = `https://api.mapbox.com/directions/v5/mapbox/walking/` +
        `${inputValues["longitude"]},` +
        `${inputValues["latitude"]};` +
        `${waypointsString};` +
        `${inputValues["endLongitude"]},` +
        `${inputValues["endLatitude"]}` +
        `?geometries=geojson&steps=true&voice_instructions=true&access_token=${mapboxgl.accessToken}&exclude=ferry`;
      const response = await fetch(callAPI);
      const data = await response.json();

      // Retrieve the route coordinates from the API response
      const routeCoordinates = data.routes[0].geometry.coordinates;

      const directions = data.routes[0].legs.flatMap(leg =>
        leg.steps.map(step => {
          let action;
          if (step.maneuver.modifier && step.maneuver.type) {
            action = `${step.maneuver.modifier} ${step.maneuver.type}`;
          }
          return {
            action,
            road: step.name,
            distance: step.distance
          };
        })
      );

      // console.log("Please follow my instruction and trust it:", directions);

      directions.forEach((step, index) => {
        const action = step.action ? step.action : 'Proceed';
        const road = step.road ? ` on ${step.road}` : '';
        const distance = step.distance ? ` for ${step.distance.toFixed(2)} meters` : '';
        // console.log(`Step ${index + 1}: ${action}${road}${distance}`);
      });


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
      setRoute(routeCoordinates);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    displayRoute();
  }, [inputValues.waypoints]);

  console.log("globalArray:", globalArray);
  return { route, displayRoute };
};

export default useRouteDisplay;
