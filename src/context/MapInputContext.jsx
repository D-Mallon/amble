import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a new context
export const MapInputContext = createContext();

// Create a provider component
export const MapInputProvider = ({ children }) => {
  // Initialize state with value from local storage or default values
  const [inputValues, setInputValues] = useState(() => {
    const savedState = localStorage.getItem('inputValues');
    if (savedState && savedState !== "undefined") {
      return JSON.parse(savedState);
    }
    return {
      "latitude": 40.74218481889335,
      "longitude": -73.98786664009094,
      "endLatitude": 40.72540497175606,
      "endLongitude": -74.01052594184875,
      "hour": 0,
      "distance": 0,
      waypoints: [],
    };
  });

  // Use useEffect to save state changes to local storage
  useEffect(() => {
    localStorage.setItem('inputValues', JSON.stringify(inputValues));
  }, [inputValues]);  // This will run every time inputValues changes

  return (
    <MapInputContext.Provider value={{ inputValues, setInputValues }}>
      {children}
    </MapInputContext.Provider>
  );
};

// Create a custom hook for using the map input context
export const useMapInput = () => useContext(MapInputContext);
