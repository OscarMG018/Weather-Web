import { useState, useEffect } from 'react'
import SavedLocationCard from './SavedLocationCard'
import { useTranslation } from 'react-i18next'
import { useCurrentLocation } from '../context/CurrentLocationContext.jsx'
import { useServer } from '../context/ServerContext.jsx'

function SavedLocationList() {
  const { t, i18n } = useTranslation()
  const { currentLocation } = useCurrentLocation()
  const { serverUrl } = useServer()
  const [locations, setLocations] = useState(() => {
    return JSON.parse(localStorage.getItem('savedLocations')) || []
  })

  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(locations))
  }, [locations])

  const updateLocationsWeather = async () => {
    if (locations.length === 0) return

    const updatedLocations = await Promise.all(
      locations.map(async (location) => {
        try {
          const query = (typeof location.lat === 'number' && typeof location.lon === 'number')
            ? `lat=${encodeURIComponent(location.lat)}&lon=${encodeURIComponent(location.lon)}`
            : `lat=${encodeURIComponent(currentLocation?.lat ?? 0)}&lon=${encodeURIComponent(currentLocation?.lon ?? 0)}`
          const response = await fetch(`${serverUrl}/api/weather/all?${query}`)
          const weatherData = await response.json()
          
          if (weatherData && weatherData.current) {
            return {
              ...location,
              weather: {
                es: t(weatherData.current.weather.toLowerCase(), { lng: 'es' }),
                en: t(weatherData.current.weather.toLowerCase(), { lng: 'en' }),
                fr: t(weatherData.current.weather.toLowerCase(), { lng: 'fr' })
              },
              temperature: weatherData.current.temp || 'N/A'
            }
          }
          return location
        } catch (error) {
          console.error(`Failed to update weather for ${location.name.en}:`, error)
          return location
        }
      })
    )

    setLocations(updatedLocations)
  }

  useEffect(() => {
    updateLocationsWeather()
  }, []) 

    const handleSaveCurrentLocation = () => {
    if (currentLocation && currentLocation.name) {
      const newLocation = {
        index: locations.length,
        name: {
          en: currentLocation.name.en,
          es: currentLocation.name.es,
          fr: currentLocation.name.fr
        },
        lat: currentLocation.lat,
        lon: currentLocation.lon,
        weather: {
          es: t(currentLocation.current.weather.toLowerCase(), { lng: 'es' }),
          en: t(currentLocation.current.weather.toLowerCase(), { lng: 'en' }),
          fr: t(currentLocation.current.weather.toLowerCase(), { lng: 'fr' })
        },
        temperature: currentLocation.current.temp || 'N/A'
      }
      
      // Check if location already exists
      const exists = locations.some(loc => loc.name.en === newLocation.name.en)
      if (!exists) {
        setLocations(prev => [...prev, newLocation])
      }
    }
  }

  const handleDeleteLocation = (index) => {
    setLocations(prev => prev.filter(loc => loc.index !== index))
  }

  return (
      <div className="p-3 rounded-4 background-primary h-100 d-flex flex-column">
        <div className="">
          <h2 className="tx-primary mb-3 text-center">{t('saved_locations')}</h2>
        </div>
        <div className="flex-grow-1 overflow-y-auto" style={{ maxHeight: '30em' }}>
          {locations.length === 0 ? (
            <div className="text-center">
              <p className="tx-secondary mb-3">{t('no_locations')}</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
                {locations.map((location, index) => (
                    <SavedLocationCard
                        key={index}
                        name={location.name[i18n.language] || location.name.en || ''}
                        weather={location.weather[i18n.language] || location.weather.en || t("unknown")}
                        temperature={location.temperature}
                        onDelete={() => handleDeleteLocation(location.index)}
                  />
                ))}
            </div>
          )}
        </div>
        
        {currentLocation && currentLocation.name && (
          <div className="text-center mt-auto pt-3" style={{ flexShrink: 0 }}>
            <button
              className="btn button-primary"
              onClick={handleSaveCurrentLocation}
            >
              {t('save_current_location')}
            </button>
          </div>
        )}
      </div>
  )
}

export default SavedLocationList