import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import './i18n/index.js'
import { ServerProvider } from './context/ServerContext.jsx'
import { CurrentLocationProvider } from './context/CurrentLocationContext.jsx'
import { UnitsProvider } from './context/UnitsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ServerProvider>
      <CurrentLocationProvider>
        <ThemeProvider>
          <UnitsProvider>
            <App />
          </UnitsProvider>
        </ThemeProvider>
      </CurrentLocationProvider>
    </ServerProvider>
  </StrictMode>,
)
