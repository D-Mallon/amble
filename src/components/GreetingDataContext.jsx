import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function useGreetingData() {
  return useContext(DataContext);
}

export function GreetingDataProvider({ children }) {
  const [data, setData] = useState({});

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}