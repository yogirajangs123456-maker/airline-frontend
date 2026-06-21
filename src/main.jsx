import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AirlineApp from './AirlineApp.jsx'
import AdminApp from './AdminApp.jsx'

function Root() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  return isAdminRoute ? <AdminApp /> : <AirlineApp />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)