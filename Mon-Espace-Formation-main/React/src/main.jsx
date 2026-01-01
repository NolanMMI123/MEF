import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // Import OK

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* C'est ICI qu'il faut ajouter les balises BrowserRouter autour de App */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)