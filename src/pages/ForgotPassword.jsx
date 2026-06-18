import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address'); return
    }
    setLoading(true); setError('')
    try {
      await axios.post(`${BASE}/users/forgot-password`, { email })
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  const containerStyle = {
    paddingTop: 70, minHeight: '100vh',
    background: 'linear-gradient(135deg,#1a3a08 0%,#2D5016 50%,#3d6b1f 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px'
  }
  const cardStyle = {
    background: '#fff', borderRadius: 28, padding: '48px 40px',
    maxWidth: 440, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', textAlign: 'center'
  }

  if (sent) return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📬</div>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, color: 'var(--forest)', marginBottom: 12 }}>Check your inbox!</h2>
        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 8 }}>
          If an account exists for:
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--forest)', marginBottom: 16 }}>{email}</p>
        <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7, marginBottom: 32 }}>
          You'll receive a password reset link shortly. The link expires in <strong>1 hour</strong>.
        </p>
        <Link to="/login" style={{ background: 'var(--forest)', color: '#fff', padding: '13px 32px', borderRadius: 50, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block', boxShadow: '0 6px 20px rgba(45,80,22,0.3)' }}>
          Back to Sign In
        </Link>
      </div>
    </div>
  )

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#2D5016,#F4A224)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌿</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, fontSize: 20, color: 'var(--forest)' }}>Vaidya Vatika</div>
            <div style={{ fontSize: 10, color: 'var(--earth)', letterSpacing: 2, textTransform: 'uppercase' }}>Pure Ayurveda</div>
          </div>
        </Link>

        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, color: 'var(--forest)', marginBottom: 8 }}>Forgot Password?</h2>
        <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 28, lineHeight: 1.6 }}>
          Enter your registered email and we'll send you a link to reset your password.
        </p>

        <div style={{ textAlign: 'left', marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Email Address</label>
          <input
            type="email" value={email} placeholder="you@email.com"
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: `2px solid ${error ? '#e53935' : 'rgba(45,80,22,0.15)'}`, background: '#fff', fontSize: 14, fontFamily: 'Lato,sans-serif', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { if (!error) e.target.style.borderColor = 'var(--forest)' }}
            onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(45,80,22,0.15)' }}
          />
          {error && <p style={{ color: '#e53935', fontSize: 12, marginTop: 4 }}>⚠ {error}</p>}
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: loading ? 'var(--earth)' : 'linear-gradient(135deg,var(--forest),#3d6b1f)', color: '#fff', padding: 14, borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Lato,sans-serif', boxShadow: '0 6px 20px rgba(45,80,22,0.3)', marginBottom: 20 }}>
          {loading ? '⏳ Sending…' : '📧 Send Reset Link'}
        </button>

        <Link to="/login" style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  )
}