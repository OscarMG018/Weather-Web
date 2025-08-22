import { createContext, useContext, useState } from 'react';

const ServerContext = createContext();

export function ServerProvider({ children }) {
  //DEV 
  // const [serverUrl, setServerUrl] = useState('http://localhost:3000');
  //PROD
  const [serverUrl, setServerUrl] = useState('https://weather-web-w16o.onrender.com');

  return (
    <ServerContext.Provider value={{ serverUrl, setServerUrl }}>
      {children}
    </ServerContext.Provider>
  );
}

export const useServer = () => useContext(ServerContext);