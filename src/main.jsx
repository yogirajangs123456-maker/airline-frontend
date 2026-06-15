import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AirlineApp from './AirlineApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AirlineApp />
  </StrictMode>,
)
