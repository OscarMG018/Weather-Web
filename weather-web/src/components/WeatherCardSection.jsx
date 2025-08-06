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

function WeatherCardSection() {
  const { t, i18n } = useTranslation();
    const { currentLocation } = useCurrentLocation()
    const currentWheather = currentLocation?.current

    if (!currentWheather) {
        return (
            <div className="p-3 rounded-4 background-primary justify-content-center h-100 text-center">
                <h2 className='tx-secondary'>{t('serch_for_location')}</h2>
            </div>
        )
    }

    return (
        <div className="p-3 rounded-4 background-primary">
            <div className="row g-3">
              <h2 className='text-center tx-secondary'>{currentLocation.name[i18n.language] || currentLocation.name.en || '-'}</h2>
              <h2 className='main-temperature'>{currentWheather.temp?.celsius ?? '-'} °C</h2>
              <WeatherCard 
                icon={faTint} 
                color="rgb(70, 150, 200)" 
                text={currentWheather.humidity !== undefined ? `${currentWheather.humidity}%` : '-'} 
                title={t('humidity').toUpperCase()} 
              />
              <WeatherCard 
                icon={faWind} 
                color="rgb(100, 180, 100)" 
                text={currentWheather.wind?.speed !== undefined ? `${currentWheather.wind.speed} km/h` : '-'} 
                title={t('wind_speed').toUpperCase()}
              />
              <WeatherCard 
                icon={faEye} 
                color="rgb(150, 100, 200)" 
                text={currentWheather.visibility !== undefined ? `${currentWheather.visibility / 1000} km` : '-'} 
                title={t('visibility').toUpperCase()}
              />
              <WeatherCard 
                icon={faCompress} 
                color="rgb(200, 150, 50)" 
                text={currentWheather.pressure !== undefined ? `${currentWheather.pressure} hPa` : '-'} 
                title={t('air_pressure').toUpperCase()}
              />
              <WeatherCard 
                icon={faCloud} 
                color="rgb(120, 120, 120)" 
                text={currentWheather.clouds !== undefined ? `${currentWheather.clouds}%` : '-'} 
                title={t('cloud_cover').toUpperCase()}
              />
              <WeatherCard 
                icon={faCloudRain} 
                color="rgb(70, 150, 200)" 
                text={currentWheather.rain !== undefined ? `${currentWheather.rain} mm` : '-'} 
                title={t('precipitation').toUpperCase()}
              />
              <WeatherCard 
                icon={faClock} 
                color="rgb(200, 150, 100)" 
                text={currentWheather.day ? `${new Date(currentWheather.day.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(currentWheather.day.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '-'} 
                title={t('daylight').toUpperCase()}
              />
            </div>
          </div>
    )
}

export default WeatherCardSection