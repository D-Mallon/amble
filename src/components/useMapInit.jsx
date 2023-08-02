import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import parks from '../json-files/park_locations.json';
import libraries from '../json-files/library_locations.json';
import communities from '../json-files/community_locations.json';
import museums from '../json-files/museum_art_locations.json';
import worships from '../json-files/worship_locations.json';

const useMapInit = (mapContainer, lat, lng, zoom, inputValues) => {
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [popup, setPopup] = useState(null);

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
    const closePopupOnEscape = (e) => {
      if (e.key === 'Escape') {
        popup.remove();
        setPopup(null);
      }
    };

    if (popup) {
      window.addEventListener('keydown', closePopupOnEscape);
    } else {
      window.removeEventListener('keydown', closePopupOnEscape);
    }

    return () => {
      window.removeEventListener('keydown', closePopupOnEscape);
    };
  }, [popup]);


  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    // Function to add markers
    const addMarkers = (data, icon) => {
      const newMarkers = data.map((item) => ({
        id: item.id,
        name: item.name,
        latitude: item.location.latitude,
        longitude: item.location.longitude,
      }));

      setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);

      map.current.on('load', () => {
        map.current.loadImage(
          `/static/${icon}.png`,
          (error, image) => {
            if (error) throw error;

            map.current.addImage(icon, image);

            map.current.addSource(icon, {
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

            map.current.addLayer({
              id: icon,
              type: 'symbol',
              source: icon,
              layout: {
                'icon-image': icon,
                'icon-size': 0.32,
              },
              paint: {
                'icon-opacity': 0.8,
              },
            });

            map.current.on('mouseenter', icon, () => {
              map.current.getCanvas().style.cursor = 'pointer';
            });

            map.current.on('mouseleave', icon, () => {
              map.current.getCanvas().style.cursor = '';
            });
          }
        );
      });
    };

    // Use the function to add markers for each type of location
    addMarkers(parks.data, 'park');
    addMarkers(libraries.data, 'library');
    addMarkers(communities.data, 'community');
    addMarkers(museums.data, 'museum');
    addMarkers(worships.data, 'worship');

    map.current.on('load', () => {
      // Add the 'click' event listener
      map.current.on('click', (e) => {
        const layers = ['park', 'library', 'community', 'museum', 'worship'];
        const features = map.current.queryRenderedFeatures(e.point, { layers });

        if (features.length > 0) {
          const coordinates = features[0].geometry.coordinates.slice();
          const popupContent = features[0].properties.name;
          const id = features[0].properties.id;

          const popup = new mapboxgl.Popup({ className: 'custom-popup' })
            .setLngLat(coordinates)
            .setHTML(`<div class="popup-content">${popupContent}<br>${id}<br>${coordinates}</div>`)
            .addTo(map.current);
          setPopup(popup);
        }
      });

    });
  }, []);

  return { map, markers };
};

export default useMapInit;
