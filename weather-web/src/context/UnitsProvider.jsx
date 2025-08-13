import { createContext, useContext, useState } from 'react'

const UnitsContext = createContext()

export function UnitsProvider({ children }) {
  const [units, setUnits] = useState('metric')

  const toggleUnits = () => {
    const next = units === 'metric' ? 'imperial' : 'metric'
    setUnits(next)
  }

  return (
    <UnitsContext.Provider value={{ units, toggleUnits }}>
      {children}
    </UnitsContext.Provider>
  )
}

export const useUnits = () => useContext(UnitsContext)

export function celsiusToFahrenheit(celsius) {
    return ((celsius * 9 / 5) + 32).toFixed(0)
}

export function kmhToMph(kmh) { 
    return (kmh * 2.23694).toFixed(2)
}

export function kmToMiles(km) { 
    return (km * 0.621371).toFixed(2)
}

export function hPaToinHg(hPa) { 
    return (hPa * 33.86389).toFixed(2)
}

export function mmToInches(mm) { 
    return (mm * 0.0393701).toFixed(2)
}