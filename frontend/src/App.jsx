import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import OrderSuccessPage from './pages/OrderSuccessPage.jsx'
import OrderTrackingPage from './pages/OrderTrackingPage.jsx'
import TrackingLookup from './delivery/TrackingLookup.jsx'
import SupportPage from './pages/SupportPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import IngredientsPage from './pages/IngredientsPage.jsx'
import CertificationsPage from './pages/CertificationsPage.jsx'
import WellnessPage from './pages/WellnessPage.jsx'
import WellnessArticlePage from './pages/WellnessArticlePage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import PolicyPage from './pages/PolicyPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import DeliveryPage from './delivery/DeliveryPage.jsx'
import DeliveryRoute from './components/DeliveryRoute.jsx'
import SuperAdminRoute from './components/SuperAdminRoute.jsx'
import SuperAdminDashboard from './admin/SuperAdminDashboard.jsx'

function App() {
  const isAdmin = ['/admin', '/delivery', '/super-admin'].includes(useLocation().pathname)
  return (
    <div className="compact-ui min-h-screen bg-[#fffdf7] font-sans text-[#17241b] selection:bg-[#c99a32] selection:text-black">
      <ScrollToTop />
      {!isAdmin && <Header />}
      <main>
        <Routes>
          <Route element={<DeliveryRoute />}>
            <Route path="/delivery" element={<DeliveryPage />} />
          </Route>
          <Route element={<SuperAdminRoute />}>
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/wellness" element={<WellnessPage />} />
          <Route path="/wellness/:slug" element={<WellnessArticlePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/shipping" element={<PolicyPage type="shipping" />} />
          <Route path="/returns" element={<PolicyPage type="returns" />} />
          <Route path="/privacy" element={<PolicyPage type="privacy" />} />
          <Route path="/terms" element={<PolicyPage type="terms" />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<TrackingLookup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders/:id" element={<OrderTrackingPage />} />
            <Route path="/orders/:id/details" element={<OrderTrackingPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}

export default App
