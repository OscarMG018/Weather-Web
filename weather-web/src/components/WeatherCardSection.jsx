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
  

function WeatherCardSection() {
    
    const { t } = useTranslation()

    return (
        <div className="p-3 rounded-4 background-primary">
            <div className="row g-3">
              <h2 className='text-center tx-secondary'>San Francisco, CA</h2>
              <h2 className='main-temperature'>{22} °C</h2>
              <WeatherCard 
                icon={faTint} 
                color="rgb(70, 150, 200)" 
                text="40%" 
                title={t('humidity').toUpperCase()} 
              />
              <WeatherCard 
                icon={faWind} 
                color="rgb(100, 180, 100)" 
                text="10 km/h" 
                title={t('wind_speed').toUpperCase()}
              />
              <WeatherCard 
                icon={faEye} 
                color="rgb(150, 100, 200)" 
                text="10 km" 
                title={t('visibility').toUpperCase()}
              />
              <WeatherCard 
                icon={faCompress} 
                color="rgb(200, 150, 50)" 
                text="1000 hPa" 
                title={t('air_pressure').toUpperCase()}
              />
              <WeatherCard 
                icon={faCloud} 
                color="rgb(120, 120, 120)" 
                text="40%" 
                title={t('cloud_cover').toUpperCase()}
              />
              <WeatherCard 
                icon={faCloudRain} 
                color="rgb(70, 150, 200)" 
                text="0 mm" 
                title={t('precipitation').toUpperCase()}
              />
              <WeatherCard 
                icon={faSun} 
                color="rgb(255, 200, 50)" 
                text="6 High" 
                title={t('uv_index').toUpperCase()}
              />
              <WeatherCard 
                icon={faLeaf} 
                color="rgb(100, 180, 100)" 
                text="42 Good" 
                title={t('air_quality').toUpperCase()}
              />
              <WeatherCard 
                icon={faClock} 
                color="rgb(200, 150, 100)" 
                text="6:42 AM - 6:42 PM" 
                title={t('daylight').toUpperCase()}
              />
            </div>
          </div>
    )
}

export default WeatherCardSection