import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ConfirmDialog from './ConfirmDialog'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { totalItems } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUser(JSON.parse(localStorage.getItem('vv_current_user') || 'null'))
  }, [location])

  // Listen for localStorage changes from other components (e.g. after email verification)
  useEffect(() => {
    const syncUser = () => setUser(JSON.parse(localStorage.getItem('vv_current_user') || 'null'))
    window.addEventListener('storage', syncUser)
    window.addEventListener('userUpdated', syncUser)
    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('userUpdated', syncUser)
    }
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem('vv_current_user')
    localStorage.removeItem('vv_token')
    setShowLogoutConfirm(false)
    setUser(null)
    toast('Logged out. See you soon! 🌿', { style: { background: 'var(--bark)', color: '#fff', borderRadius: 12 } })
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const isHome = location.pathname === '/'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(253,246,227,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(45,80,22,0.12)' : 'none',
        transition: 'all 0.35s ease',
        borderBottom: scrolled ? '1px solid rgba(45,80,22,0.08)' : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2D5016, #F4A224)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(45,80,22,0.3)' }}>🌿</div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 18, color: scrolled || !isHome ? 'var(--forest)' : '#fff', lineHeight: 1.1, transition: 'color 0.3s' }}>Vaidya Vatika</div>
              <div style={{ fontSize: 10, color: scrolled || !isHome ? 'var(--earth)' : 'rgba(255,255,255,0.7)', letterSpacing: 2, textTransform: 'uppercase', transition: 'color 0.3s' }}>Pure Ayurveda</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                fontFamily: 'Lato, sans-serif', fontWeight: 600, fontSize: 14,
                color: location.pathname === link.to ? 'var(--forest)' : scrolled || !isHome ? 'var(--text-mid)' : 'rgba(255,255,255,0.9)',
                letterSpacing: 0.5, textTransform: 'uppercase',
                borderBottom: location.pathname === link.to ? '2px solid var(--saffron)' : '2px solid transparent',
                paddingBottom: 2, transition: 'all 0.2s',
              }}>{link.label}</Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--forest)', color: '#fff', boxShadow: '0 4px 12px rgba(45,80,22,0.3)', flexShrink: 0 }}>
              <span style={{ fontSize: 18 }}>🛒</span>
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--saffron)', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>
              )}
            </Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(45,80,22,0.08)', borderRadius: 50, padding: '7px 14px 7px 8px', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,80,22,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,80,22,0.08)'}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--forest)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{user.name?.charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--forest)' }}>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} style={{ background: 'none', border: '2px solid rgba(45,80,22,0.2)', color: 'var(--text-mid)', padding: '7px 14px', borderRadius: 50, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'Lato, sans-serif', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#e53935'; e.currentTarget.style.color = '#e53935' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(45,80,22,0.2)'; e.currentTarget.style.color = 'var(--text-mid)' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="desktop-nav" style={{ background: 'var(--saffron)', color: '#fff', padding: '9px 20px', borderRadius: 50, fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(244,162,36,0.3)', display: 'inline-block', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Sign In
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ display: 'none', flexDirection: 'column', gap: 5, background: 'none', padding: 4, border: 'none' }}>
              {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 24, height: 2, background: scrolled || !isHome ? 'var(--forest)' : '#fff', borderRadius: 2 }} />)}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: 'rgba(253,246,227,0.98)', backdropFilter: 'blur(12px)', padding: '12px 24px 24px', borderTop: '1px solid rgba(45,80,22,0.1)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[...navLinks, { to: '/orders', label: 'My Orders' }, { to: '/track', label: 'Track Order' }].map(link => (
              <Link key={link.to} to={link.to} style={{ padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 15, color: 'var(--forest)', background: location.pathname === link.to ? 'rgba(45,80,22,0.08)' : 'transparent' }}>{link.label}</Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(45,80,22,0.08)', marginTop: 8, paddingTop: 12 }}>
              {user ? (
                <>
                  <Link to="/profile" style={{ display: 'block', padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 15, color: 'var(--forest)' }}>👤 {user.name}</Link>
                  <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 15, color: '#e53935', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Lato, sans-serif' }}>Sign Out</button>
                </>
              ) : (
                <Link to="/login" style={{ display: 'block', padding: '12px 16px', borderRadius: 10, fontWeight: 700, fontSize: 15, color: '#fff', background: 'var(--forest)', textAlign: 'center', marginTop: 4 }}>Sign In / Register</Link>
              )}
            </div>
          </div>
        )}

        <style>{`@media(max-width:900px){.desktop-nav{display:none!important}.hamburger{display:flex!important}}`}</style>
      </nav>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Sign Out?"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Yes, Sign Out"
        confirmColor="var(--bark)"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}