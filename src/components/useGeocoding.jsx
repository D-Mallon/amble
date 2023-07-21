// useGeocoding.js
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const useGeocoding = (map, buttonPressed, setButtonPressed, inputValues, setInputValues, showEndLocationInput, setShowEndLocationInput) => {
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
          setInputValues(prevValues => ({
            ...prevValues,
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng
          }));
          setShowEndLocationInput(true);
        }
      });
    }
  }, [map, buttonPressed]); // Adding map to dependency array

  return { location, setLocation };
};

export default useGeocoding;
