// eslint-disable-next-line no-unused-vars
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// eslint-disable-next-line no-unused-vars
import App from './App.jsx'

import posthog from 'posthog-js'
import * as Sentry from "@sentry/react";

// Зчитуємо змінні з .env файлів
const isProduction = import.meta.env.PROD;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

// Ініціалізація Sentry
Sentry.init({
  dsn: SENTRY_DSN, 
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, 
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0,
});

// Контекст користувача для Sentry
Sentry.setUser({
  id: "student_991",
  email: "rozchepiy@student.lpnu.ua",
  segment: "premium_user"
});

// Ініціалізація PostHog (з реверс-проксі для Vercel)
posthog.init(POSTHOG_KEY, {
    api_host: isProduction ? '/ingest' : 'https://eu.i.posthog.com',
    ui_host: 'https://eu.posthog.com',
    person_profiles: 'always' 
});



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)