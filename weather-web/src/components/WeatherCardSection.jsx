import WeatherCard from './WeatherCard'
import { 
    faTint, 
    faWind, 
    faEye, 
    faCompress, 
    faCloud, 
    faCloudRain, 
    faSun, 
    faLeaf,
    faClock
  } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useCurrentLocation } from '../context/CurrentLocationContext.jsx'
import {
  useUnits,
  celsiusToFahrenheit,
  kmhToMph,
  kmToMiles,
  hPaToinHg,
  mmToInches,
} from '../context/UnitsProvider.jsx'

function WeatherCardSection() {
  const { t, i18n } = useTranslation();
    const { currentLocation } = useCurrentLocation()
    const { units } = useUnits()
    const currentWheather = currentLocation?.current
    
    if (!currentWheather) {
        return (
            <div className="p-3 rounded-4 background-primary justify-content-center h-100 text-center">
                <h2 className='tx-secondary'>{t('search_for_location')}</h2>
            </div>
        )
    }

    function getWeatherUnitText(unitState, metric, value) {
      if (value === undefined) return '-'
      if (unitState === 'metric') {
        switch (metric) {
          case 'temperature':
            return `${value} °C`
          case 'wind_speed':
            return `${value} km/h`
          case 'humidity':
            return `${value}%`
          case 'pressure':
            return `${value} hPa`
          case 'visibility':
            return `${value / 1000} km`
          case 'cloud_cover':
            return `${value}%`
          case 'rain':
            return `${value} mm`
          case 'daylight':
            return `${new Date(value.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(value.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          default:
            return '-'
        }
      } 
      else {
        switch (metric) {
          case 'temperature':
            return `${parseFloat(celsiusToFahrenheit(value))} °F`
          case 'wind_speed':
            return `${parseFloat(kmhToMph(value))} mph`
          case 'humidity':
            return `${value}%`
          case 'pressure':
            return `${parseFloat(hPaToinHg(value))} inHg`
          case 'visibility':
            return `${parseFloat(kmToMiles(value))} mi`
          case 'cloud_cover':
            return `${value}%`
          case 'rain':
            return `${parseFloat(mmToInches(value))} in`
          case 'daylight':
            return `${new Date(value.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(value.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          default:
            return '-'
        }
      }
    }

    return (
        <div className="p-3 rounded-4 background-primary">
            <div className="row g-3">
              <h2 className='text-center tx-secondary'>{currentLocation.name[i18n.language] || currentLocation.name.en || '-'}</h2>
              <h2 className='main-temperature'>{getWeatherUnitText(units, 'temperature', currentWheather.temp)}</h2>
              <h2 className='text-center tx-secondary'>{t(currentWheather.weather.toLowerCase())}</h2>
              <WeatherCard 
                icon={faTint} 
                color="rgb(70, 150, 200)" 
                text={getWeatherUnitText(units, 'humidity', currentWheather.humidity)}
                title={t('humidity').toUpperCase()} 
              />
              <WeatherCard 
                icon={faWind} 
                color="rgb(100, 180, 100)" 
                text={getWeatherUnitText(units, 'wind_speed', currentWheather.wind?.speed)}
                title={t('wind_speed').toUpperCase()}
              />
              <WeatherCard 
                icon={faEye} 
                color="rgb(150, 100, 200)" 
                text={getWeatherUnitText(units, 'visibility', currentWheather.visibility)}
                title={t('visibility').toUpperCase()}
              />
              <WeatherCard 
                icon={faCompress} 
                color="rgb(200, 150, 50)" 
                text={getWeatherUnitText(units, 'pressure', currentWheather.pressure)}
                title={t('air_pressure').toUpperCase()}
              />
              <WeatherCard 
                icon={faCloud} 
                color="rgb(120, 120, 120)" 
                text={getWeatherUnitText(units, 'cloud_cover', currentWheather.clouds)}
                title={t('cloud_cover').toUpperCase()}
              />
              <WeatherCard 
                icon={faCloudRain} 
                color="rgb(70, 150, 200)" 
                text={getWeatherUnitText(units, 'rain', currentWheather.rain)}
                title={t('precipitation').toUpperCase()}
              />
              <WeatherCard 
                icon={faClock} 
                color="rgb(200, 150, 100)" 
                text={getWeatherUnitText(units, 'daylight', {
                  sunrise: currentWheather.day?.sunrise,
                  sunset: currentWheather.day?.sunset
                })} 
                title={t('daylight').toUpperCase()}
              />
            </div>
          </div>
    )
}

export default WeatherCardSection