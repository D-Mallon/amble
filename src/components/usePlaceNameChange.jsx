import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

const usePlaceNameChange = (initialPlaceName = '', setInputValues, showBeginLocationInput, showEndLocationInput, setShowEndLocationInput, setShowPreferencesInput, setShowGoButton) => {
  const [placeName, setPlaceName] = useState(initialPlaceName);
  const [suggestions, setSuggestions] = useState([]);

  const handlePlaceNameChange = async (event, newPlaceName) => {
    setPlaceName(newPlaceName || ''); 
  
    if (newPlaceName) {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newPlaceName)}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
  
      if (data.features.length > 0) {
        setSuggestions(data.features.map(feature => ({
          label: feature.place_name,
          value: feature.place_name,
          coordinates: feature.center
        })));
      }
    } else {
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = (place) => {
    if (showBeginLocationInput == true && showEndLocationInput == false) {
      setInputValues(prevValues => ({
        ...prevValues,
        latitude: place.coordinates[1],
        longitude: place.coordinates[0]
      }));
      setShowEndLocationInput(true);
    } else {
      setInputValues(prevValues => ({
        ...prevValues,
        endLatitude: place.coordinates[1],
        endLongitude: place.coordinates[0]
      }));
      console.log("showBeginLocationInput is false");
      setShowPreferencesInput(true);
      setShowGoButton(true);
    }
  };

  return { placeName, suggestions, handlePlaceNameChange, handlePlaceSelect };
};

export default usePlaceNameChange;
