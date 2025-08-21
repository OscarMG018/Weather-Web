import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useServer } from './ServerContext.jsx';

const CurrentLocationContext = createContext();

export function CurrentLocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const { serverUrl } = useServer();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!navigator?.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords || {};
        if (typeof latitude !== 'number' || typeof longitude !== 'number') return;
        fetch(`${serverUrl}/api/weather/all?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&radius=5`)
          .then(res => res.json())
          .then(data => {
            if (data && data.current) {
              setCurrentLocation({ ...data, lat: latitude, lon: longitude });
            }
          })
          .catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [serverUrl]);

  return (
    <CurrentLocationContext.Provider value={{ currentLocation, setCurrentLocation }}>
      {children}
    </CurrentLocationContext.Provider>
  );
}

export const useCurrentLocation = () => useContext(CurrentLocationContext);