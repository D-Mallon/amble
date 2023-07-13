// useGeocoding.js
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const useGeocoding = (map, buttonPressed, setButtonPressed) => {
  const [location, setLocation] = useState({ lat: null, lng: null, address: '' });

  useEffect(() => {
    if (map) {
      map.on('click', (e) => {
        if (buttonPressed) {
          setButtonPressed(false);
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              const address = data.features[0]?.place_name || 'Unknown location';
              setLocation({
                lat: e.lngLat.lat,
                lng: e.lngLat.lng,
                address: address
              });
            })
            .catch(error => console.error('Error:', error));
  
          console.log('Selected location:', e.lngLat.lat, e.lngLat.lng);
        }
      });
    }
  }, [map, buttonPressed]); // Adding map to dependency array

  return { location, setLocation };
};

export default useGeocoding;
