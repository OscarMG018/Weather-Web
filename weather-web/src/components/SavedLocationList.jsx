import { useState, useEffect } from 'react'
import SavedLocationCard from './SavedLocationCard'
import { useTranslation } from 'react-i18next'

function SavedLocationList({ currentLocation }) {
  const { t } = useTranslation()
  const [locations, setLocations] = useState(() => {
    return JSON.parse(localStorage.getItem('savedLocations')) || []
  })

  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(locations))
  }, [locations])

    const handleSaveCurrentLocation = () => {
    if (currentLocation && currentLocation.name) {
      const newLocation = {
        index: locations.length,
        name: currentLocation.name,
        weather: currentLocation.weather || 'Unknown',
        temperature: currentLocation.temperature || 'N/A'
      }
      
      // Check if location already exists
      const exists = false /*locations.some(loc => loc.name === newLocation.name)*/
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
                        name={location.name}
                        weather={location.weather}
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