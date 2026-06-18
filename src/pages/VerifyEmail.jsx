import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus]   = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('')
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()
  const hasVerified = useRef(false) // prevent double call in React strict mode

  useEffect(() => {
    if (hasVerified.current) return  // already ran — skip second strict mode call
    hasVerified.current = true

    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token found. Please use the link from your email.')
      return
    }

    axios.get(`${BASE}/users/verify?token=${token}`)
      .then(res => {
        const data = res.data
        // Auto-login: save user to localStorage just like normal login
        localStorage.setItem('vv_current_user', JSON.stringify(data))
        window.dispatchEvent(new Event('userUpdated'))  // tell Navbar to update
        setUserName(data.name || 'there')
        setStatus('success')
        setMessage('Your email has been verified and you are now logged in!')
        // Redirect to home after 3 seconds
        setTimeout(() => navigate('/'), 3000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.response?.data?.message ||
          'This verification link is invalid or has expired. Please register again.')
      })
  }, [])

  const icon  = status === 'verifying' ? '⏳' : status === 'success' ? '✅' : '❌'
  const title = status === 'verifying' ? 'Verifying your email…'
              : status === 'success'   ? `Welcome, ${userName}! 🌿`
              : 'Verification failed'
  const color = status === 'success'   ? 'var(--forest)'
              : status === 'error'     ? '#c62828'
              : 'var(--bark)'

  return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'linear-gradient(135deg,#1a3a08 0%,#2D5016 50%,#3d6b1f 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
      <div style={{ background:'#fff', borderRadius:28, padding:'48px 40px', maxWidth:480, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.25)', textAlign:'center' }}>

        {/* Logo */}
        <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:32, textDecoration:'none' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#2D5016,#F4A224)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🌿</div>
          <div style={{ textAlign:'left' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:20, color:'var(--forest)' }}>Vaidya Vatika</div>
            <div style={{ fontSize:10, color:'var(--earth)', letterSpacing:2, textTransform:'uppercase' }}>Pure Ayurveda</div>
          </div>
        </Link>

        <div style={{ fontSize:64, marginBottom:16 }}>{icon}</div>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, color, marginBottom:16 }}>{title}</h2>
        <p style={{ fontSize:15, color:'var(--text-mid)', lineHeight:1.7, marginBottom:32 }}>{message}</p>

        {status === 'success' && (
          <div>
            <p style={{ fontSize:13, color:'var(--text-light)', marginBottom:20 }}>
              Redirecting you to the home page in 3 seconds…
            </p>
            <Link to="/"
              style={{ background:'var(--forest)', color:'#fff', padding:'14px 36px', borderRadius:50, fontWeight:700, fontSize:15, textDecoration:'none', display:'inline-block', boxShadow:'0 6px 20px rgba(45,80,22,0.3)' }}>
              🌿 Start Shopping
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/login"
              style={{ background:'var(--forest)', color:'#fff', padding:'13px 28px', borderRadius:50, fontWeight:700, fontSize:14, textDecoration:'none', boxShadow:'0 6px 20px rgba(45,80,22,0.3)' }}>
              Register Again
            </Link>
            <Link to="/"
              style={{ background:'transparent', border:'2px solid var(--forest)', color:'var(--forest)', padding:'13px 28px', borderRadius:50, fontWeight:700, fontSize:14, textDecoration:'none' }}>
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}