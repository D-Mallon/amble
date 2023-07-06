import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import parks from './parks.json';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Start } from '@mui/icons-material';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmluYmFyYWxsYW4iLCJhIjoiY2xqY3NtYWN6MjV0ODNqcXhhaTY4aGQxdSJ9.VeVQzxCCtpyP_MeT1CkjOg';

const Map = ({ inputValues }) => {
  // variables used to initialise the maps
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(40.727872);
  const [lng, setLng] = useState(-73.993157);
  const [zoom, setZoom] = useState(12.4);
  const [markers, setMarkers] = useState([]);

  // initialises the map when the page loads
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    console.log('parks:', parks)
    const newMarkers = parks.data.map((park) => ({
      id: park.id,
      name: park.name,
      latitude: park.location.latitude,
      longitude: park.location.longitude,
    }));

    setMarkers(newMarkers);

    map.current.on('load', () => {
      // Load an image from an external URL.
      map.current.loadImage(
        '/static/tree.png',
        (error, image) => {
          if (error) throw error;

          // Add the image to the map style.
          map.current.addImage('cat', image);

          // Add a data source containing multiple point features.
          map.current.addSource('markers', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: newMarkers.map((marker) => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [marker.longitude, marker.latitude],
                },
                properties: {
                  id: marker.id,
                  name: marker.name,
                },
              })),
            },
          });

          // Add a layer to use the image to represent the data.
          map.current.addLayer({
            id: 'markers',
            type: 'symbol',
            source: 'markers',
            layout: {
              'icon-image': 'cat',
              'icon-size': 0.25,
            },
            paint: {
              'icon-opacity': 0.8
            }
          });
          // Set the cursor style to pointer when hovering over markers
          map.current.on('mouseenter', 'markers', () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });

          // Reset the cursor style when not hovering over markers
          map.current.on('mouseleave', 'markers', () => {
            map.current.getCanvas().style.cursor = '';
          });
        }
      );

      // Add the 'click' event listener
      map.current.on('click', (e) => {
        const features = map.current.queryRenderedFeatures(e.point, { layers: ['markers'] });

        if (features.length > 0) {
          const coordinates = features[0].geometry.coordinates.slice();
          const popupContent = features[0].properties.name;
          const id = features[0].properties.id;

          const popup = new mapboxgl.Popup({ className: 'custom-popup' })
            .setLngLat(coordinates)
            .setHTML(`<div class="popup-content">${popupContent}<br>${id}<br>${coordinates}</div>`)
            .addTo(map.current);
        }
      });
    });
  }, []);

  // logic for displaying the route on the map 
  const displayRoute = async (inputValues) => {
    console.log('inputValues:', inputValues)
    try {
      const waypointsString = inputValues.waypoints
        .map((waypoint) => `${waypoint[1]},${waypoint[0]}`)
        .join(";");
      console.log("waypointsString:", waypointsString);

      // const callAPI = `https://api.mapbox.com/directions/v5/mapbox/walking/` +
      //   `${inputValues["longitude"]},` +
      //   `${inputValues["latitude"]};` +
      //   `${-73.98516297340393},` + 
      //   `${40.75481569016998};` +
      //   `${-73.97524952888489},` + 
      //   `${40.76993869239328}` +
      //   `?geometries=geojson&access_token=${mapboxgl.accessToken}`

      const callAPI = `https://api.mapbox.com/directions/v5/mapbox/walking/` +
        `${inputValues["longitude"]},` +
        `${inputValues["latitude"]};` +
        `${waypointsString},` +
        `?geometries=geojson&access_token=${mapboxgl.accessToken}`
      console.log('callAPI:', callAPI);
      const response = await fetch(callAPI);
      console.log('response:', response);
      const data = await response.json();
      console.log('data:', data);

      // Retrieve the route coordinates from the API response
      const routeCoordinates = data.routes[0].geometry.coordinates;
      console.log('routeCoordinates:', routeCoordinates);

      // Create a GeoJSON feature with the route coordinates
      const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates,
        },
      };

      if (!map.current)
        return;

      // Clear existing map layers (if any)
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      // Add the route layer to the map
      map.current.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON,
      });
      map.current.addLayer({
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
      map.current.fitBounds(bounds, { padding: 400 });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // control the Longitude, Latitude, and Zoom Bar (will probably remove this later)
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <button type="submit" onClick={() => { displayRoute(inputValues) }}>Go!</button>
      <div className="sidebar">
        Longitude: {lng} | Latitude NEW: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Map;