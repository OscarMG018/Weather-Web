import { createContext, useContext, useState } from 'react';

const CurrentLocationContext = createContext();

export function CurrentLocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(null);

  return (
    <CurrentLocationContext.Provider value={{ currentLocation, setCurrentLocation }}>
      {children}
    </CurrentLocationContext.Provider>
  );
}

export const useCurrentLocation = () => useContext(CurrentLocationContext);