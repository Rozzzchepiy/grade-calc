// eslint-disable-next-line no-unused-vars
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// eslint-disable-next-line no-unused-vars
import App from './App.jsx'

// Підключаємо PostHog
import posthog from 'posthog-js'

// Ініціалізуємо твоїми ключами зі скриншота
posthog.init('phc_xiUR6LPmq3Ji2sgy5ma5nLJiLHczjyEsdGCXxekawnbp', {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'always' 
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)