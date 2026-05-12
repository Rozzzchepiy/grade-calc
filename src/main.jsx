// eslint-disable-next-line no-unused-vars
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// eslint-disable-next-line no-unused-vars
import App from './App.jsx'
const isProduction = import.meta.env.PROD;


// Підключаємо PostHog
import posthog from 'posthog-js'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://0968196b3d312f47d71b2ce4d262037a@o4511373705871360.ingest.de.sentry.io/4511373711376464", 
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Моніторинг продуктивності (APM)
  tracesSampleRate: 1.0, 
  // Запис сесій при помилках
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0,
});

Sentry.setUser({
  id: "student_991",
  email: "rozchepiy@student.lpnu.ua",
  segment: "premium_user"
});

// Ініціалізуємо твоїми ключами зі скриншота
posthog.init('phc_xiUR6LPmq3Ji2sgy5ma5nLJiLHczjyEsdGCXxekawnbp', {
    // Якщо продакшен (Vercel) -> шлемо через наш проксі. Якщо локалхост -> шлемо напряму
    api_host: isProduction ? '/ingest' : 'https://eu.i.posthog.com',
    // Кажемо PostHog, де лежить його справжній інтерфейс
    ui_host: 'https://eu.posthog.com',
    person_profiles: 'always' 
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)