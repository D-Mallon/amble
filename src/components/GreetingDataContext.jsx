import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function useGreetingData() {
  return useContext(DataContext);
}

export function GreetingDataProvider({ children }) {
  const [data, setData] = useState({});
//   const [greetingData, setGreetingData] = useState({}); 
  // Make sure setGreetingData is initialized properly
  
  return (
    // <DataContext.Provider value={{ data, setData, setGreetingData }}>
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}