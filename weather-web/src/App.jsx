import './styles/App.css'
import ToggleButton from './components/ToggleButton'
import { useTheme } from './context/ThemeProvider'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LangDropDown from './components/LangDropDown'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import SavedLocationList from './components/SavedLocationList'
import WeatherCardSection from './components/WeatherCardSection'
import ForecastCardSection from './components/ForecastCardSection'
import { useUnits } from './context/UnitsProvider'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { units, toggleUnits } = useUnits()
  const { t } = useTranslation()
  
  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light')
    document.documentElement.classList.toggle('theme-dark', theme === 'dark')
  }, [theme]);

  return (
    <div className="p-2 p-md-4">
      <div className="row g-4">
        {/* Header */}
        <div className="col-12">
          <Header className="p-3 rounded-4 background-primary">
            <div className="row w-100 align-items-center">
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-3 mb-md-0">
                <h1 className="tx-primary text-center text-md-start">{t('title')}</h1>
              </div>
              
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-3 mb-md-0">
                <div className="d-flex justify-content-start justify-content-md-end">
                  <SearchBar />
                </div>
              </div>
              
              <div className="col-md-12 col-lg-4 mt-md-4 mt-lg-0">
                <div className="d-flex flex-row justify-content-center justify-content-lg-end gap-2">
                  <ToggleButton toggleValue={theme} setToggleValue={toggleTheme} toggleActiveValue={'light'} activeText={'Light Mode'} inactiveText={'Dark Mode'} />
                  <ToggleButton toggleValue={units} setToggleValue={toggleUnits} toggleActiveValue={'metric'} activeText={'Metric'} inactiveText={'Imperial'} />
                  <LangDropDown />
                </div>
              </div>
            </div>
          </Header>
        </div>

        {/* Weather Cards Section */}
        <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-9">  
          <WeatherCardSection />
        </div>

        {/* Locations Section */}
        <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-3">
          <SavedLocationList
            currentLocation={{
              name: 'San Francisco, CA',
              weather: 'Clear',
              temperature: '22 °C'
            }}
          />
        </div>
        <div className="col-12">
          <ForecastCardSection />
        </div>
      </div>
    </div>
  )
}

export default App