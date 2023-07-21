import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import parks from '../json-files/park_locations.json';

const useMapInit = (mapContainer, lat, lng, zoom, inputValues) => {
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);

  const startMarkerRef = useRef(); // We use a ref to keep track of the start marker
  const endMarkerRef = useRef(); // We use a ref to keep track of the end marker

  // Track the start location and add a marker on change
  useEffect(() => {
    if (!map.current) return; // If map is not defined, return
    if (startMarkerRef.current) startMarkerRef.current.remove(); // If a start marker already exists, remove it

    // Create a new start marker and add it to the map
    startMarkerRef.current = new mapboxgl.Marker()
      .setLngLat([inputValues.longitude, inputValues.latitude])
      .addTo(map.current);

    console.log('Placing start marker at:', [inputValues.longitude, inputValues.latitude]);
  }, [map, inputValues.latitude, inputValues.longitude]); // This useEffect runs whenever map or start location changes

  // Track the end location and add a marker on change
  useEffect(() => {
    if (!map.current) return; // If map is not defined, return
    if (endMarkerRef.current) endMarkerRef.current.remove(); // If an end marker already exists, remove it

    // Create a new end marker and add it to the map
    endMarkerRef.current = new mapboxgl.Marker()
      .setLngLat([inputValues.endLongitude, inputValues.endLatitude])
      .addTo(map.current);

    console.log('Placing end marker at:', [inputValues.endLongitude, inputValues.endLatitude]);
  }, [map, inputValues.endLatitude, inputValues.endLongitude]); // This useEffect runs whenever map or end location changes

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

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

  return { map, markers };
};

export default useMapInit;
