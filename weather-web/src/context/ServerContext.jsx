import { createContext, useContext, useState } from 'react';

const ServerContext = createContext();

export function ServerProvider({ children }) {
  // You can set this to your actual server URL or make it configurable
  const [serverUrl, setServerUrl] = useState('http://localhost:3000');

  // Optionally, you can add more server-related state here (e.g., status, version)

  return (
    <ServerContext.Provider value={{ serverUrl, setServerUrl }}>
      {children}
    </ServerContext.Provider>
  );
}

export const useServer = () => useContext(ServerContext);