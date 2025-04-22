import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Import fonts
import '@fontsource/montserrat/300.css' // Light
import '@fontsource/montserrat/400.css' // Regular
import '@fontsource/montserrat/500.css' // Medium
import '@fontsource/montserrat/700.css' // Bold
import '@fontsource/nunito-sans/400.css'
import '@fontsource/nunito-sans/600.css'
import '@fontsource/ibm-plex-sans-condensed/400.css'
import '@fontsource/ibm-plex-sans-condensed/600.css'
import '@fontsource/prompt/300.css' // Light

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
