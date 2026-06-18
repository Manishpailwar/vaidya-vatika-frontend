import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyAdmin } from '../api/api'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [pwd, setPwd]         = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  const handleLogin = async () => {
    if (!pwd.trim()) { toast.error('Please enter a password'); return }
    setLoading(true)
    try {
      const res = await verifyAdmin(pwd)
      if (res.data.valid) {   // backend returns { valid: true, token: "..." }
        sessionStorage.setItem('vv_admin', 'true')
        if (res.data.token) sessionStorage.setItem('vv_admin_token', res.data.token)
        toast.success('Welcome, Admin! 🌿', { style: { background: 'var(--forest)', color: '#fff', borderRadius: 12 } })
        navigate('/admin')
      } else {
        toast.error('Incorrect password')
      }
    } catch {
      toast.error('Incorrect password')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 28, padding: '48px 40px', boxShadow: '0 20px 60px rgba(45,80,22,0.12)', maxWidth: 400, width: '100%', margin: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, color: 'var(--forest)', marginBottom: 8 }}>Admin Panel</h1>
        <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 32 }}>Vaidya Vatika — Secure Access</p>
        <input
          type="password"
          placeholder="Enter admin password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '14px 18px', borderRadius: 50, border: '2px solid rgba(45,80,22,0.15)', background: '#fff', fontSize: 15, fontFamily: 'Lato,sans-serif', outline: 'none', marginBottom: 16, textAlign: 'center', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = 'var(--forest)'}
          onBlur={e => e.target.style.borderColor = 'rgba(45,80,22,0.15)'}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg,var(--forest),#3d6b1f)', color: '#fff', padding: 14, borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Lato,sans-serif', boxShadow: '0 6px 20px rgba(45,80,22,0.3)' }}>
          {loading ? '⏳ Verifying…' : 'Login →'}
        </button>
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-light)' }}>Contact your system administrator for access</p>
      </div>
    </div>
  )
}