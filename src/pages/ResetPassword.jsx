import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export default function ResetPassword() {
  const [searchParams]        = useSearchParams()
  const navigate              = useNavigate()
  const [token, setToken]     = useState('')
  const [pwd, setPwd]         = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    const t = searchParams.get('token')
    if (!t) { setError('Invalid reset link. Please request a new one.'); return }
    setToken(t)
  }, [])

  const handleReset = async () => {
    if (pwd.length < 6)      { setError('Password must be at least 6 characters'); return }
    if (pwd !== confirm)     { setError('Passwords do not match'); return }
    if (!token)              { setError('Invalid reset token'); return }

    setLoading(true); setError('')
    try {
      await axios.post(`${BASE}/users/reset-password`, { token, newPassword: pwd })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
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

  if (success) return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, color: 'var(--forest)', marginBottom: 12 }}>Password Reset!</h2>
        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 28 }}>
          Your password has been changed successfully. Redirecting to login in 3 seconds…
        </p>
        <Link to="/login" style={{ background: 'var(--forest)', color: '#fff', padding: '13px 32px', borderRadius: 50, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block', boxShadow: '0 6px 20px rgba(45,80,22,0.3)' }}>
          🌿 Sign In Now
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

        <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, color: 'var(--forest)', marginBottom: 8 }}>Set New Password</h2>
        <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 28 }}>
          Choose a strong password for your account.
        </p>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          {/* New Password */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>New Password</label>
            <input
              type={showPwd ? 'text' : 'password'} value={pwd} placeholder="Min. 6 characters"
              onChange={e => { setPwd(e.target.value); setError('') }}
              style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '2px solid rgba(45,80,22,0.15)', background: '#fff', fontSize: 14, fontFamily: 'Lato,sans-serif', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--forest)'}
              onBlur={e => e.target.style.borderColor = 'rgba(45,80,22,0.15)'}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Confirm Password</label>
            <input
              type={showPwd ? 'text' : 'password'} value={confirm} placeholder="Re-enter new password"
              onChange={e => { setConfirm(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleReset()}
              style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: `2px solid ${error ? '#e53935' : 'rgba(45,80,22,0.15)'}`, background: '#fff', fontSize: 14, fontFamily: 'Lato,sans-serif', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { if (!error) e.target.style.borderColor = 'var(--forest)' }}
              onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(45,80,22,0.15)' }}
            />
          </div>

          <button onClick={() => setShowPwd(p => !p)}
            style={{ background: 'none', border: 'none', color: 'var(--forest)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Lato,sans-serif', textAlign: 'left' }}>
            {showPwd ? '🙈 Hide' : '👁 Show'} passwords
          </button>

          {error && <p style={{ color: '#e53935', fontSize: 13, margin: 0 }}>⚠ {error}</p>}
        </div>

        <button onClick={handleReset} disabled={loading}
          style={{ width: '100%', background: loading ? 'var(--earth)' : 'linear-gradient(135deg,var(--forest),#3d6b1f)', color: '#fff', padding: 14, borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Lato,sans-serif', boxShadow: '0 6px 20px rgba(45,80,22,0.3)', marginBottom: 20 }}>
          {loading ? '⏳ Updating…' : '🔒 Reset Password'}
        </button>

        <Link to="/login" style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  )
}