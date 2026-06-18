import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import PrivateAdminRoute from './components/PrivateAdminRoute'
import LoginRegister from './pages/LoginRegister'
import Profile from './pages/Profile'
import OrderTracking from './pages/OrderTracking'
import About from './pages/About'
import Contact from './pages/Contact'
import LegalPage from './pages/LegalPage'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Wrapper that hides Navbar/Footer on admin pages
function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <PrivateAdminRoute>
            <AdminPanel />
          </PrivateAdminRoute>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal/:page" element={<LegalPage />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout />
        <Toaster position="top-right" />
      </BrowserRouter>
    </CartProvider>
  )
}