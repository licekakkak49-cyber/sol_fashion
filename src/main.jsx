import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WishlistProvider } from './context/WishlistContext'
import { AdminProvider } from './context/AdminContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <WishlistProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </WishlistProvider>
    </BrowserRouter>
  </StrictMode>,
)
