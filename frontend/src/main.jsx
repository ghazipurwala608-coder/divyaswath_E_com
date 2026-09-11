import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { SiteContentProvider } from './context/SiteContentContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SiteContentProvider><ProductProvider><CartProvider>
            <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2800,
              className: '!border !border-[#b88a2a] !bg-[#142117] !text-[#fffdf4]',
            }}
          />
        </CartProvider></ProductProvider></SiteContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
</StrictMode>,
)
