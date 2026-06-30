import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { loginUser, registerUser, resendVerification } from '../api/api'
import toast from 'react-hot-toast'

const Field = ({ label, name, type='text', placeholder, form, setForm, errors, setErrors, showPwd, icon }) => (
  <div>
    <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{label}</label>
    <div style={{ position:'relative' }}>
      {icon && <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>{icon}</span>}
      <input
        type={name==='password'||name==='confirm' ? (showPwd?'text':'password') : type}
        placeholder={placeholder} value={form[name]}
        onChange={e => { setForm(f => ({...f, [name]: e.target.value})); if (errors[name]) setErrors(er => ({...er, [name]:''})) }}
        style={{ width:'100%', padding:`13px 16px 13px ${icon?'40px':'16px'}`, borderRadius:14, border:`2px solid ${errors[name]?'#e53935':'rgba(45,80,22,0.15)'}`, background:'#fff', fontSize:14, fontFamily:'Lato,sans-serif', outline:'none', boxSizing:'border-box' }}
        onFocus={e => { if (!errors[name]) e.target.style.borderColor='var(--forest)' }}
        onBlur={e => { if (!errors[name]) e.target.style.borderColor='rgba(45,80,22,0.15)' }} />
    </div>
    {errors[name] && <p style={{ color:'#e53935', fontSize:12, marginTop:4 }}>⚠ {errors[name]}</p>}
  </div>
)

export default function LoginRegister() {
  const [mode, setMode]     = useState('login')
  const navigate            = useNavigate()
  const [loginForm, setLoginForm]   = useState({ email:'', password:'' })
  const [regForm, setRegForm]       = useState({ name:'', email:'', phone:'', password:'', confirm:'' })
  const [errors, setErrors]         = useState({})
  const [loading, setLoading]       = useState(false)
  const [showPwd, setShowPwd]       = useState(false)
  const [registered, setRegistered]   = useState(null)  // email after successful register
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('reason') === 'expired' // email blocked at login
  const [resending, setResending]     = useState(false)

  const validateLogin = () => {
    const e = {}
    if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) e.email = 'Valid email required'
    if (!loginForm.password) e.password = 'Password is required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const validateRegister = () => {
    const e = {}
    if (!regForm.name.trim()) e.name = 'Full name is required'
    if (!/^\S+@\S+\.\S+$/.test(regForm.email)) e.email = 'Valid email required'
    if (!/^\d{10}$/.test(regForm.phone)) e.phone = '10-digit phone required'
    if (regForm.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (regForm.password !== regForm.confirm) e.confirm = 'Passwords do not match'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validateLogin()) return
    setLoading(true)
    try {
      const res = await loginUser({ email: loginForm.email, password: loginForm.password })
      localStorage.setItem('vv_current_user', JSON.stringify(res.data))
      if (res.data.token) localStorage.setItem('vv_token', res.data.token)
      toast.success(`Welcome back, ${res.data.name}! 🌿`, { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      if (msg === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(loginForm.email)
      } else {
        setErrors({ password: msg })
      }
    } finally { setLoading(false) }
  }

  const handleRegister = async () => {
    if (!validateRegister()) return
    setLoading(true)
    try {
      await registerUser({ name: regForm.name, email: regForm.email, password: regForm.password, phone: regForm.phone })
      setRegistered(regForm.email)  // show the "check your email" screen
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      if (msg.startsWith('UNVERIFIED_RESENT:')) {
        // Account exists but unverified — we resent the email, show check-email screen
        const email = msg.split(':')[1]
        setRegistered(email)
      } else if (msg.includes('email')) {
        setErrors({ email: msg })
      } else {
        toast.error(msg)
      }
    } finally { setLoading(false) }
  }

  const handleResend = async (email) => {
    setResending(true)
    try {
      await resendVerification(email)
      toast.success('Verification email resent! Check your inbox.', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend. Try again.')
    } finally { setResending(false) }
  }

  // ── Check-your-email screen (shown after successful registration) ──
  if (registered) {
    return (
      <div style={{ paddingTop:70, minHeight:'100vh', background:'linear-gradient(135deg,#1a3a08 0%,#2D5016 50%,#3d6b1f 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ background:'#fff', borderRadius:28, padding:'48px 40px', maxWidth:480, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.25)', textAlign:'center' }}>
          <div style={{ fontSize:64, marginBottom:16 }}>📬</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--forest)', marginBottom:12 }}>Check your email!</h2>
          <p style={{ fontSize:15, color:'var(--text-mid)', lineHeight:1.7, marginBottom:8 }}>
            We sent a verification link to:
          </p>
          <p style={{ fontSize:16, fontWeight:700, color:'var(--forest)', marginBottom:24 }}>{registered}</p>
          <p style={{ fontSize:14, color:'var(--text-light)', lineHeight:1.7, marginBottom:32 }}>
            Click the link in the email to activate your account. The link expires in 24 hours.
          </p>
          <button onClick={() => handleResend(registered)} disabled={resending}
            style={{ background:'transparent', border:'2px solid var(--forest)', color:'var(--forest)', padding:'12px 28px', borderRadius:50, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif', marginBottom:16 }}>
            {resending ? '⏳ Sending…' : '🔁 Resend verification email'}
          </button>
          <br/>
          <button onClick={() => { setRegistered(null); setMode('login') }}
            style={{ background:'none', border:'none', color:'var(--text-light)', fontSize:13, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  // ── Email not verified screen (shown when trying to login before verifying) ──
  if (unverifiedEmail) {
    return (
      <div style={{ paddingTop:70, minHeight:'100vh', background:'linear-gradient(135deg,#1a3a08 0%,#2D5016 50%,#3d6b1f 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ background:'#fff', borderRadius:28, padding:'48px 40px', maxWidth:480, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.25)', textAlign:'center' }}>
          <div style={{ fontSize:64, marginBottom:16 }}>✉️</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--forest)', marginBottom:12 }}>Verify your email first</h2>
          <p style={{ fontSize:15, color:'var(--text-mid)', lineHeight:1.7, marginBottom:8 }}>
            Your account is not yet activated. Please check your inbox for the verification email sent to:
          </p>
          <p style={{ fontSize:16, fontWeight:700, color:'var(--forest)', marginBottom:24 }}>{unverifiedEmail}</p>
          <button onClick={() => handleResend(unverifiedEmail)} disabled={resending}
            style={{ background:'var(--forest)', color:'#fff', padding:'14px 32px', borderRadius:50, border:'none', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 6px 20px rgba(45,80,22,0.3)', marginBottom:16 }}>
            {resending ? '⏳ Sending…' : '📧 Resend verification email'}
          </button>
          <br/>
          <button onClick={() => setUnverifiedEmail(null)}
            style={{ background:'none', border:'none', color:'var(--text-light)', fontSize:13, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'linear-gradient(135deg,#1a3a08 0%,#2D5016 50%,#3d6b1f 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
      <div style={{ background:'#fff', borderRadius:28, padding:'48px 40px', maxWidth:480, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.25)' }}>
        {/* Logo */}
        {/* Session expired banner */}
        {sessionExpired && (
          <div style={{ background:'#fff3e0', border:'2px solid #ff9800', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#e65100', fontWeight:600, textAlign:'center' }}>
            ⏰ Your session has expired. Please sign in again.
          </div>
        )}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#2D5016,#F4A224)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 16px rgba(45,80,22,0.3)' }}>🌿</div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:20, color:'var(--forest)' }}>Vaidya Vatika</div>
              <div style={{ fontSize:10, color:'var(--earth)', letterSpacing:2, textTransform:'uppercase' }}>Pure Ayurveda</div>
            </div>
          </Link>
        </div>

        {/* Tab Toggle */}
        <div style={{ display:'flex', background:'rgba(45,80,22,0.06)', borderRadius:50, padding:4, marginBottom:32 }}>
          {[['login','Sign In'],['register','Create Account']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setErrors({}) }} style={{ flex:1, padding:'11px 16px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif', transition:'all 0.25s', background: mode===m?'var(--forest)':'transparent', color: mode===m?'#fff':'var(--text-mid)' }}>{label}</button>
          ))}
        </div>

        {/* LOGIN */}
        {mode === 'login' && (
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--bark)', marginBottom:4 }}>Welcome Back</h2>
            <p style={{ fontSize:14, color:'var(--text-light)', marginBottom:4 }}>Sign in to access your orders and profile</p>
            <Field label="Email Address" name="email" type="email" placeholder="you@email.com" icon="✉️" form={loginForm} setForm={setLoginForm} errors={errors} setErrors={setErrors} showPwd={showPwd} />
            <div>
              <Field label="Password" name="password" placeholder="Your password" icon="🔒" form={loginForm} setForm={setLoginForm} errors={errors} setErrors={setErrors} showPwd={showPwd} />
              <button onClick={() => setShowPwd(p => !p)} style={{ background:'none', border:'none', color:'var(--forest)', fontSize:12, fontWeight:600, cursor:'pointer', marginTop:4, fontFamily:'Lato,sans-serif' }}>{showPwd?'🙈 Hide':'👁 Show'} password</button>
              <div style={{ textAlign:'right', marginTop:4 }}>
                <Link to="/forgot-password" style={{ fontSize:12, color:'var(--text-light)', fontWeight:600 }}>Forgot password?</Link>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading} style={{ background: loading?'var(--earth)':'linear-gradient(135deg,var(--forest),#3d6b1f)', color:'#fff', padding:15, borderRadius:50, border:'none', fontWeight:700, fontSize:16, cursor:loading?'not-allowed':'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 6px 20px rgba(45,80,22,0.3)', marginTop:8 }}>
              {loading ? '⏳ Signing In…' : '🌿 Sign In'}
            </button>
            <p style={{ textAlign:'center', fontSize:13, color:'var(--text-light)' }}>
              Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setErrors({}) }} style={{ background:'none', border:'none', color:'var(--forest)', fontWeight:700, cursor:'pointer', fontFamily:'Lato,sans-serif', fontSize:13 }}>Create one →</button>
            </p>
          </div>
        )}

        {/* REGISTER */}
        {mode === 'register' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--bark)', marginBottom:4 }}>Join Vaidya Vatika</h2>
            <p style={{ fontSize:14, color:'var(--text-light)', marginBottom:4 }}>Create your account to start your wellness journey</p>
            <Field label="Full Name" name="name" placeholder="Rahul Sharma" icon="👤" form={regForm} setForm={setRegForm} errors={errors} setErrors={setErrors} showPwd={showPwd} />
            <Field label="Email Address" name="email" type="email" placeholder="you@email.com" icon="✉️" form={regForm} setForm={setRegForm} errors={errors} setErrors={setErrors} showPwd={showPwd} />
            <Field label="Phone Number" name="phone" placeholder="9876543210" icon="📞" form={regForm} setForm={setRegForm} errors={errors} setErrors={setErrors} showPwd={showPwd} />
            <Field label="Password" name="password" placeholder="Min. 6 characters" icon="🔒" form={regForm} setForm={setRegForm} errors={errors} setErrors={setErrors} showPwd={showPwd} />
            <div>
              <Field label="Confirm Password" name="confirm" placeholder="Re-enter password" icon="🔒" form={regForm} setForm={setRegForm} errors={errors} setErrors={setErrors} showPwd={showPwd} />
              <button onClick={() => setShowPwd(p => !p)} style={{ background:'none', border:'none', color:'var(--forest)', fontSize:12, fontWeight:600, cursor:'pointer', marginTop:4, fontFamily:'Lato,sans-serif' }}>{showPwd?'🙈 Hide':'👁 Show'} passwords</button>
            </div>
            <button onClick={handleRegister} disabled={loading} style={{ background: loading?'var(--earth)':'linear-gradient(135deg,var(--forest),#3d6b1f)', color:'#fff', padding:15, borderRadius:50, border:'none', fontWeight:700, fontSize:16, cursor:loading?'not-allowed':'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 6px 20px rgba(45,80,22,0.3)', marginTop:4 }}>
              {loading ? '⏳ Creating Account…' : '🌿 Create Account'}
            </button>
            <p style={{ textAlign:'center', fontSize:12, color:'var(--text-light)' }}>
              By registering you agree to our <Link to="/legal/terms" style={{ color:'var(--forest)', fontWeight:600 }}>Terms</Link> & <Link to="/legal/privacy" style={{ color:'var(--forest)', fontWeight:600 }}>Privacy Policy</Link>
            </p>
            <p style={{ textAlign:'center', fontSize:13, color:'var(--text-light)' }}>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setErrors({}) }} style={{ background:'none', border:'none', color:'var(--forest)', fontWeight:700, cursor:'pointer', fontFamily:'Lato,sans-serif', fontSize:13 }}>Sign in →</button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}