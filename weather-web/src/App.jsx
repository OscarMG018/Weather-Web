import './styles/App.css'
import ThemeToggleButton from './components/ThemeToggleButton'
import { useTheme } from './context/ThemeProvider'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LangDropDown from './components/LangDropDown'
import Header from './components/Header'
import SearchBar from './components/SearchBar'

function App() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light')
    document.documentElement.classList.toggle('theme-dark', theme === 'dark')
  }, [theme]);

  return (
    <div className="d-flex justify-content-center align-items-center p-2 p-md-4">
      <Header className={`col-12 p-3 rounded-4 background-primary`}>
        <div className="row w-100 align-items-center">
          <div className="col-12 col-sm-6 col-md-4 mb-3 mb-md-0">
            <h1 className={`tx-primary text-center text-md-start`}>{t('title')}</h1>
          </div>
          
          <div className="col-12 col-sm-6 col-md-5 mb-3 mb-md-0">
            <div className="d-flex justify-content-center justify-content-md-end">
              <SearchBar />
            </div>
          </div>
          
          <div className="col-12 col-sm-12 col-md-3">
            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end gap-2">
              <ThemeToggleButton />
              <LangDropDown />
            </div>
          </div>
        </div>
      </Header>
    </div>
  )
}

export default App
