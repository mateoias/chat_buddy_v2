import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import Bootstrap CSS first
import 'bootstrap/dist/css/bootstrap.min.css'
// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Then import your design system
import './styles/design-system.css'

// Finally import any remaining custom styles
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)