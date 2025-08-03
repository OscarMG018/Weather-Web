import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import './styles/App.css'
import ThemeToggleButton from './components/ThemeToggleButton'
import { useTheme } from './context/ThemeProvider'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LangDropDown from './components/LangDropDown'

function App() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  useEffect(() => {
    document.getElementById('root').style.backgroundColor = theme === 'dark' ? 'white' : 'black'
  }, [theme])

  return (
     <div className={`container text-${theme === 'dark' ? 'black' : 'white'} p-5`}>
     <ThemeToggleButton />
     <LangDropDown />
      <h1>{t('welcome')}</h1>
    </div>
  )
}

export default App
