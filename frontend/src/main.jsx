import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import toast, { Toaster, ToastBar } from 'react-hot-toast'
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
              duration: 3500,
              error: { duration: 5000, ariaProps: { role: 'alert', 'aria-live': 'assertive' } },
              className: '!border !border-[#b88a2a] !bg-[#142117] !text-[#fffdf4]',
            }}
          >
            {notification => (
              <ToastBar toast={notification}>
                {({ icon, message }) => <>{icon}{message}{notification.type !== 'loading' && (
                  <button type="button" aria-label="Dismiss notification" onClick={() => toast.dismiss(notification.id)} style={{ padding: '4px 8px', color: 'inherit', cursor: 'pointer' }}>×</button>
                )}</>}
              </ToastBar>
            )}
          </Toaster>
        </CartProvider></ProductProvider></SiteContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
</StrictMode>,
)
