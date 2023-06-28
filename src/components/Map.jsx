import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import parks from './parks.json';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmluYmFyYWxsYW4iLCJhIjoiY2xqY3NtYWN6MjV0ODNqcXhhaTY4aGQxdSJ9.VeVQzxCCtpyP_MeT1CkjOg';

const reactLogo = 'react.svg';
const reactLogoPath = `/static/${reactLogo}`;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(40.727872);
  const [lng, setLng] = useState(-73.993157);
  const [zoom, setZoom] = useState(12.4);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
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
          });
        }
      );

      // Add the 'click' event listener
      map.current.on('click', (e) => {
        const features = map.current.queryRenderedFeatures(e.point, { layers: ['markers'] });

        if (features.length > 0) {
          const coordinates = features[0].geometry.coordinates.slice();
          const popupContent = features[0].properties.name;

          const popup = new mapboxgl.Popup({className: 'custom-popup'})
          .setLngLat(coordinates)
          .setHTML(`<div class="popup-content">${popupContent}${coordinates}</div>`)
          .addTo(map.current);
        }
      });
    });
  }, []);

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
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Map;