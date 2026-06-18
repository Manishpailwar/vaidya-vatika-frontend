import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { verifyAdminToken } from '../api/api'

// PrivateAdminRoute — server-verified admin guard.
//
// Why: checking sessionStorage alone is NOT security. Any user can open
// DevTools and set sessionStorage.setItem('vv_admin','true') to bypass it.
//
// How this works:
//   1. On mount, we call GET /admin/verify-token with the stored JWT.
//   2. The backend checks the token's signature AND the ROLE_ADMIN claim.
//   3. Only if the server says "yes" do we render the children.
//   4. While waiting we show a neutral loading screen — no flash of admin UI.
//   5. On any failure (expired, tampered, missing) we clear storage and
//      redirect to /admin/login.

export default function PrivateAdminRoute({ children }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    const token = sessionStorage.getItem('vv_admin_token')
    if (!token) {
      setStatus('denied')
      return
    }

    verifyAdminToken()
      .then(() => setStatus('ok'))
      .catch(() => {
        // Token invalid, expired, or forged — wipe local state
        sessionStorage.removeItem('vv_admin')
        sessionStorage.removeItem('vv_admin_token')
        setStatus('denied')
      })
  }, [])

  if (status === 'checking') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cream)',
        fontFamily: 'Lato, sans-serif',
        color: 'var(--text-light)',
        fontSize: 15,
      }}>
        Verifying session…
      </div>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}