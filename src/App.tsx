import { useState } from 'react'
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait'
import WeatherPage from './pages/WeatherPage'
import WeatherDetailPage from './pages/WeatherDetailPage'
import './App.css'

function App() {
  const [view] = useState<'search' | 'detail'>('search');

  return (
    <TDSMobileAITProvider>
      <div className="app-container">
        {view === 'search' ? (
          <WeatherPage />
        ) : (
          <WeatherDetailPage />
        )}
      </div>
    </TDSMobileAITProvider>
  )
}

export default App
