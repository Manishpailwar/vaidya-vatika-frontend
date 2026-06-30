import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, updateUser, getOrdersByEmail } from '../api/api'
import toast from 'react-hot-toast'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_COLORS = { PLACED:'#1976d2', PROCESSING:'#f9a825', SHIPPED:'#43a047', DELIVERED:'#8e24aa', CANCELLED:'#e53935' }

const InputField = ({ label, name, type='text', placeholder, formState, setFormState, errors, setErrors }) => (
  <div>
    <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{label}</label>
    <input type={type} value={formState[name]} placeholder={placeholder}
      onChange={e => { setFormState(f => ({...f, [name]: e.target.value})); if (errors && errors[name]) setErrors(er => ({...er, [name]:''})) }}
      style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`2px solid ${errors && errors[name]?'#e53935':'rgba(45,80,22,0.15)'}`, background:'#fff', fontSize:14, fontFamily:'Lato,sans-serif', outline:'none', boxSizing:'border-box' }}
      onFocus={e => { if (!(errors && errors[name])) e.target.style.borderColor='var(--forest)' }}
      onBlur={e => { if (!(errors && errors[name])) e.target.style.borderColor='rgba(45,80,22,0.15)' }} />
    {errors && errors[name] && <p style={{ color:'#e53935', fontSize:12, marginTop:4 }}>⚠ {errors[name]}</p>}
  </div>
)

export default function Profile() {
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [user, setUser]     = useState(null)
  const [form, setForm]     = useState({ name:'', phone:'', address:'', city:'', pincode:'' })
  const [pwdForm, setPwdForm] = useState({ current:'', newPwd:'', confirm:'' })
  const [tab, setTab]       = useState('profile')
  const [orders, setOrders] = useState([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let u = null
    try { u = JSON.parse(localStorage.getItem('vv_current_user') || 'null') } catch {}
    if (!u) { navigate('/login'); return }

    const applyUser = (data) => {
      setUser(data)
      setForm({ name: data.name||'', phone: data.phone||'', address: data.address||'', city: data.city||'', pincode: data.pincode||'' })
    }

    // Show localStorage data immediately — no blank screen
    applyUser(u)
    setLoading(false)

    // Refresh from backend in background
    if (u.id) {
      getUser(u.id)
        .then(res => {
          applyUser(res.data)
          localStorage.setItem('vv_current_user', JSON.stringify(res.data))
        })
        .catch(() => {})
    }

    getOrdersByEmail(u.email)
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
  }, [navigate])

  const handleSaveProfile = async () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = '10-digit phone required'
    setErrors(e); if (Object.keys(e).length > 0) return
    setSaving(true)
    try {
      const res = await updateUser(user.id, { name: form.name, phone: form.phone, address: form.address, city: form.city, pincode: form.pincode })
      setUser(res.data)
      localStorage.setItem('vv_current_user', JSON.stringify(res.data))
      toast.success('Profile updated! ✓', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save profile')
    } finally { setSaving(false) }
  }

  const handleChangePwd = async () => {
    const e = {}
    if (!pwdForm.current) e.current = 'Current password required'
    if (pwdForm.newPwd.length < 6) e.newPwd = 'Min. 6 characters'
    if (pwdForm.newPwd !== pwdForm.confirm) e.confirm = 'Passwords do not match'
    setErrors(e); if (Object.keys(e).length > 0) return
    setSaving(true)
    try {
      const res = await updateUser(user.id, { name: form.name, phone: form.phone, currentPassword: pwdForm.current, newPassword: pwdForm.newPwd })
      setUser(res.data)
      localStorage.setItem('vv_current_user', JSON.stringify(res.data))
      setPwdForm({ current:'', newPwd:'', confirm:'' })
      toast.success('Password changed! 🔒', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password')
    } finally { setSaving(false) }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
      await cancelOrder(orderId)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
      toast.success('Order cancelled successfully', { style:{ background:'var(--bark)', color:'#fff', borderRadius:12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order')
    }
  }

  const handleLogout = () => setShowLogoutConfirm(true)

  const confirmLogout = () => {
    localStorage.removeItem('vv_current_user')
    localStorage.removeItem('vv_token')
    setShowLogoutConfirm(false)
    toast('Logged out 🌿', { style:{ background:'var(--bark)', color:'#fff', borderRadius:12 } })
    navigate('/')
  }



  if (loading) return (
    <div style={{ paddingTop:90, minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16, animation:'float 1.5s ease-in-out infinite' }}>🌿</div>
        <p style={{ color:'var(--text-light)' }}>Loading your profile…</p>
      </div>
    </div>
  )

  if (!user) return null

  return (
    <>
    <div style={{ paddingTop:90, minHeight:'100vh', background:'var(--cream)' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--forest),#3d6b1f)', padding:'48px 0 40px' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, border:'3px solid rgba(255,255,255,0.3)' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:32, color:'#fff', marginBottom:4 }}>{user.name}</h1>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:15 }}>{user.email}</p>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, marginTop:4 }}>
              {user.joinedAt ? `Member since ${new Date(user.joinedAt).toLocaleDateString('en-IN',{ month:'long', year:'numeric' })}` : 'Welcome back!'}
            </p>
          </div>

        </div>
      </div>

      <div className="container" style={{ paddingTop:32, paddingBottom:80 }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:16, marginBottom:32 }}>
          {[['📦',orders.length,'Total Orders'],['✅',orders.filter(o=>o.status==='DELIVERED').length,'Delivered'],['⏳',orders.filter(o=>['PLACED','PROCESSING','SHIPPED'].includes(o.status)).length,'Active'],['❌',orders.filter(o=>o.status==='CANCELLED').length,'Cancelled']].map(([icon,count,label]) => (
            <div key={label} style={{ background:'#fff', borderRadius:16, padding:20, textAlign:'center', boxShadow:'0 4px 16px rgba(45,80,22,0.07)' }}>
              <div style={{ fontSize:28 }}>{icon}</div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, color:'var(--forest)', lineHeight:1.2 }}>{count}</div>
              <div style={{ fontSize:12, color:'var(--text-light)', marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
          {[['profile','👤 My Profile'],['orders','📦 My Orders'],['password','🔒 Change Password']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'11px 22px', borderRadius:50, border:'2px solid', borderColor: tab===t?'var(--forest)':'rgba(45,80,22,0.15)', background: tab===t?'var(--forest)':'#fff', color: tab===t?'#fff':'var(--text-mid)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif', transition:'all 0.2s' }}>{label}</button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div style={{ background:'#fff', borderRadius:20, padding:32, boxShadow:'0 4px 20px rgba(45,80,22,0.07)', maxWidth:640 }}>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--bark)', marginBottom:24 }}>Personal Information</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div style={{ gridColumn:'1/-1' }}><InputField label="Full Name" name="name" placeholder="Rahul Sharma" formState={form} setFormState={setForm} errors={errors} setErrors={setErrors} /></div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Email</label>
                <div style={{ padding:'12px 14px', borderRadius:12, border:'2px solid rgba(45,80,22,0.08)', background:'rgba(45,80,22,0.03)', fontSize:14, color:'var(--text-light)' }}>{user.email}</div>
              </div>
              <InputField label="Phone" name="phone" placeholder="9876543210" formState={form} setFormState={setForm} errors={errors} setErrors={setErrors} />
              <div style={{ gridColumn:'1/-1' }}><InputField label="Address" name="address" placeholder="House no., Street, Area" formState={form} setFormState={setForm} errors={errors} setErrors={setErrors} /></div>
              <InputField label="City" name="city" placeholder="New Delhi" formState={form} setFormState={setForm} errors={errors} setErrors={setErrors} />
              <InputField label="PIN Code" name="pincode" placeholder="110001" formState={form} setFormState={setForm} errors={errors} setErrors={setErrors} />
            </div>
            <button onClick={handleSaveProfile} disabled={saving} style={{ marginTop:24, background:'var(--forest)', color:'#fff', padding:'13px 32px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:saving?'not-allowed':'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 4px 14px rgba(45,80,22,0.25)' }}>
              {saving ? '⏳ Saving…' : '✓ Save Changes'}
            </button>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div style={{ maxWidth:720 }}>
            {orders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', background:'#fff', borderRadius:20, boxShadow:'0 4px 20px rgba(45,80,22,0.07)' }}>
                <div style={{ fontSize:64, marginBottom:16 }}>📦</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--bark)', marginBottom:8 }}>No orders yet</h3>
                <Link to="/products" style={{ background:'var(--forest)', color:'#fff', padding:'12px 28px', borderRadius:50, fontWeight:700, fontSize:14, display:'inline-block', marginTop:16 }}>Shop Now 🌿</Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ background:'#fff', borderRadius:16, padding:'20px 24px', marginBottom:14, boxShadow:'0 4px 16px rgba(45,80,22,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, color:'var(--forest)' }}>#{order.id}</div>
                    <div style={{ fontSize:13, color:'var(--text-light)', marginTop:2 }}>{new Date(order.createdAt).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })} · {order.items?.length} item{order.items?.length!==1?'s':''}</div>
                  </div>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:'var(--forest)' }}>₹{order.totalAmount}</div>
                  <span style={{ padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:700, color:'#fff', background: STATUS_COLORS[order.status]||'#2D5016' }}>{order.status}</span>
                  <Link to={`/track/${order.id}`} style={{ fontSize:13, fontWeight:600, color:'var(--forest)', border:'2px solid rgba(45,80,22,0.2)', padding:'7px 16px', borderRadius:20 }}>Track →</Link>
                  {order.status === 'PLACED' && (
                    <button onClick={() => handleCancelOrder(order.id)}
                      style={{ fontSize:13, fontWeight:600, color:'#c62828', border:'2px solid rgba(229,57,53,0.3)', padding:'7px 16px', borderRadius:20, background:'transparent', cursor:'pointer', fontFamily:'Lato,sans-serif' }}>
                      Cancel
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <div style={{ background:'#fff', borderRadius:20, padding:32, boxShadow:'0 4px 20px rgba(45,80,22,0.07)', maxWidth:480 }}>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--bark)', marginBottom:24 }}>Change Password</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <InputField label="Current Password" name="current" type="password" placeholder="Your current password" formState={pwdForm} setFormState={setPwdForm} errors={errors} setErrors={setErrors} />
              <InputField label="New Password" name="newPwd" type="password" placeholder="Min. 6 characters" formState={pwdForm} setFormState={setPwdForm} errors={errors} setErrors={setErrors} />
              <InputField label="Confirm New Password" name="confirm" type="password" placeholder="Re-enter new password" formState={pwdForm} setFormState={setPwdForm} errors={errors} setErrors={setErrors} />
            </div>
            <button onClick={handleChangePwd} disabled={saving} style={{ marginTop:24, background:'var(--forest)', color:'#fff', padding:'13px 32px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:saving?'not-allowed':'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 4px 14px rgba(45,80,22,0.25)' }}>
              {saving ? '⏳ Updating…' : '🔒 Update Password'}
            </button>
          </div>
        )}
      </div>
    </div>
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