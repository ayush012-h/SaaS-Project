import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Starting React app...')

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('React app rendered')

// Hide loading screen after app mounts - more aggressive approach
const hideLoadingScreen = () => {
  try {
    console.log('Attempting to hide loading screen...')
    const loader = document.getElementById('loading-screen')
    if (loader) {
      console.log('Found loading screen element:', loader)
      loader.style.opacity = '0'
      loader.style.transition = 'opacity 0.3s ease'
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.remove()
          console.log('Loading screen removed successfully')
        } else {
          console.log('Loading screen element not found for removal')
        }
      }, 300)
    } else {
      console.log('Loading screen element not found')
    }
  } catch (error) {
    console.error('Error removing loading screen:', error)
    // Fallback: try to hide it directly
    try {
      const loader = document.getElementById('loading-screen')
      if (loader) {
        loader.style.display = 'none'
        console.log('Loading screen hidden via fallback')
      }
    } catch (fallbackError) {
      console.error('Fallback loading screen removal failed:', fallbackError)
    }
  }
}

// Try multiple times to ensure it gets removed
setTimeout(hideLoadingScreen, 500)
setTimeout(hideLoadingScreen, 1000)
setTimeout(hideLoadingScreen, 2000)
