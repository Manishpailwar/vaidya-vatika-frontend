import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder, validateCoupon } from '../api/api'
import toast from 'react-hot-toast'

const INIT = { name:'', email:'', phone:'', address:'', city:'', pincode:'', payment:'COD' }

const Field = ({ name, label, placeholder, type='text', full=false, form, errors, handleChange }) => (
  <div style={{ gridColumn: full ? '1/-1' : undefined }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</label>
    <input name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange}
      style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: `2px solid ${errors[name] ? '#e53935' : 'rgba(45,80,22,0.15)'}`, background: '#fff', fontSize: 14, fontFamily: 'Lato, sans-serif', outline: 'none', boxSizing: 'border-box' }}
      onFocus={e => { if (!errors[name]) e.target.style.borderColor = 'var(--forest)' }}
      onBlur={e => { if (!errors[name]) e.target.style.borderColor = 'rgba(45,80,22,0.15)' }} />
    {errors[name] && <p style={{ color: '#e53935', fontSize: 12, marginTop: 4 }}>⚠ {errors[name]}</p>}
  </div>
)

export default function Checkout() {
  const { cart, totalPrice, totalItems, dispatch } = useCart()
  const navigate = useNavigate()
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('vv_current_user') || 'null') } catch { return null } })()
  const [form, setForm] = useState(() => {
    const u = JSON.parse(localStorage.getItem('vv_current_user') || 'null')
    return u ? { name: u.name||'', email: u.email||'', phone: u.phone||'', address: u.address||'', city: u.city||'', pincode: u.pincode||'', payment: 'COD' } : INIT
  })
  const [errors, setErrors]     = useState({})
  const [placing, setPlacing]   = useState(false)
  const [placed, setPlaced]     = useState(null)

  // Coupon state
  const [couponCode, setCouponCode]     = useState('')
  const [couponApplied, setCouponApplied] = useState(null)  // { code, discountAmount, message }
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError]     = useState('')

  const shipping   = totalPrice > 499 ? 0 : 49
  const gst        = Math.round(totalPrice * 0.05)
  const subtotal   = totalPrice + shipping + gst
  const discount   = couponApplied ? couponApplied.discountAmount : 0
  const grandTotal = Math.max(0, subtotal - discount)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError('Enter a coupon code'); return }
    setCouponLoading(true); setCouponError('')
    try {
      // Validate against item total only (matches backend CouponService logic)
      const res = await validateCoupon(couponCode.trim(), totalPrice)
      setCouponApplied(res.data)
      toast.success(res.data.message, { style: { background: 'var(--forest)', color: '#fff', borderRadius: 12 } })
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code')
      setCouponApplied(null)
    } finally { setCouponLoading(false) }
  }

  const handleRemoveCoupon = () => {
    setCouponApplied(null)
    setCouponCode('')
    setCouponError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = '10-digit phone required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit pincode required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleChange = e => { setForm(f => ({...f, [e.target.name]: e.target.value})); if (errors[e.target.name]) setErrors(er => ({...er, [e.target.name]: ''})) }

  const handleSubmit = async () => {
    const user = (() => { try { return JSON.parse(localStorage.getItem('vv_current_user') || 'null') } catch { return null } })()
    if (!user) {
      toast('Please sign in to place your order 🌿', { icon: '🔒', style: { background: 'var(--bark)', color: '#fff', borderRadius: 12 } })
      navigate('/login'); return
    }
    if (!validate()) return
    setPlacing(true)
    try {
      const orderPayload = {
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        totalAmount: grandTotal,
        paymentMethod: form.payment,
        couponCode: couponApplied ? couponApplied.code : null,
        discountAmount: discount,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: item.imageUrl,
          quantity: item.qty,
          unitPrice: item.price,
        }))
      }
      const res = await placeOrder(orderPayload)
      const orderData = res.data?.order || res.data
      setPlaced(orderData)
      dispatch({ type: 'CLEAR' })
      toast.success('Order placed! 🌿', { style: { background: 'var(--forest)', color: '#fff', borderRadius: 12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.', { style: { background: '#c62828', color: '#fff', borderRadius: 12 } })
    } finally { setPlacing(false) }
  }

  if (placed) return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 520, padding: '0 24px' }}>
        <div style={{ fontSize: 80, marginBottom: 20, animation: 'float 2s ease-in-out infinite' }}>🎉</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--forest)', marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ fontSize: 16, color: 'var(--text-mid)', marginBottom: 8 }}>Thank you, <strong>{placed.customerName}</strong>!</p>
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 8px 32px rgba(45,80,22,0.10)', marginBottom: 28 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Order ID</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--forest)', fontWeight: 700 }}>
            {placed.id != null ? `#${placed.id}` : '—'}
          </div>
          <div style={{ borderTop: '1px solid rgba(45,80,22,0.08)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: 'var(--text-light)' }}>Total Paid</span>
            <span style={{ fontWeight: 700, color: 'var(--forest)', fontFamily: 'Playfair Display, serif', fontSize: 18 }}>
              {placed?.totalAmount ? `₹${placed.totalAmount}` : `₹${grandTotal}`}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {placed?.id != null && <Link to={`/track/${placed.id}`} style={{ background: 'var(--forest)', color: '#fff', padding: '13px 28px', borderRadius: 50, fontWeight: 700, fontSize: 14, boxShadow: '0 6px 20px rgba(45,80,22,0.3)' }}>Track Order →</Link>}
          <Link to="/products" style={{ background: '#fff', color: 'var(--forest)', padding: '13px 28px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: '2px solid rgba(45,80,22,0.2)' }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  )

  if (cart.length === 0) return (
    <div style={{ paddingTop: 90, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--bark)', margin: '16px 0 8px' }}>Your cart is empty</h2>
      <Link to="/products" style={{ color: 'var(--forest)', fontWeight: 600, marginTop: 8 }}>← Go Shopping</Link>
    </div>
  )

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ background: 'linear-gradient(135deg,var(--forest),#3d6b1f)', padding: '40px 0 32px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#fff' }}>Checkout</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{totalItems} item{totalItems!==1?'s':''} · ₹{grandTotal} total</p>
        </div>
      </div>
      <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }} className="checkout-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {!currentUser && (
              <div style={{ background: '#fff3e0', border: '2px solid #F4A224', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 24 }}>🔒</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--bark)' }}>Sign in to place your order</div>
                  <div style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>You need an account to complete checkout</div>
                </div>
                <Link to="/login" style={{ background: 'var(--forest)', color: '#fff', padding: '9px 20px', borderRadius: 50, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>Sign In →</Link>
              </div>
            )}

            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(45,80,22,0.07)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--bark)', marginBottom: 24 }}>📍 Delivery Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field name="name" label="Full Name *" placeholder="Rahul Sharma" full form={form} errors={errors} handleChange={handleChange} />
                <Field name="email" label="Email *" placeholder="you@email.com" type="email" form={form} errors={errors} handleChange={handleChange} />
                <Field name="phone" label="Phone *" placeholder="9876543210" form={form} errors={errors} handleChange={handleChange} />
                <Field name="address" label="Street Address *" placeholder="House no., Street, Area" full form={form} errors={errors} handleChange={handleChange} />
                <Field name="city" label="City *" placeholder="New Delhi" form={form} errors={errors} handleChange={handleChange} />
                <Field name="pincode" label="PIN Code *" placeholder="110001" form={form} errors={errors} handleChange={handleChange} />
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(45,80,22,0.07)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--bark)', marginBottom: 20 }}>💳 Payment</h2>
              {[{value:'COD',label:'Cash on Delivery',desc:'Pay when your order arrives',icon:'💵'},{value:'ONLINE',label:'Online Payment',desc:'Coming soon',icon:'📱',disabled:true}].map(opt => (
                <label key={opt.value} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px 18px', borderRadius: 14, border: `2px solid ${form.payment===opt.value?'var(--forest)':'rgba(45,80,22,0.12)'}`, background: form.payment===opt.value?'rgba(45,80,22,0.04)':'#fff', cursor: opt.disabled?'not-allowed':'pointer', opacity: opt.disabled?0.5:1, marginBottom: 12 }}>
                  <input type="radio" name="payment" value={opt.value} checked={form.payment===opt.value} onChange={handleChange} disabled={opt.disabled} style={{ accentColor: 'var(--forest)', width: 18, height: 18 }} />
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <div><div style={{ fontWeight: 700, fontSize: 14, color: 'var(--bark)' }}>{opt.label}</div><div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>{opt.desc}</div></div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(45,80,22,0.10)', position: 'sticky', top: 90 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--bark)', marginBottom: 20 }}>Order Summary</h2>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bark)' }}>{item.name}</div><div style={{ fontSize: 12, color: 'var(--text-light)' }}>Qty: {item.qty}</div></div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--forest)' }}>₹{item.price * item.qty}</div>
              </div>
            ))}

            {/* Coupon input */}
            <div style={{ borderTop: '2px solid rgba(45,80,22,0.08)', paddingTop: 16, marginTop: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bark)', marginBottom: 10 }}>🎟 Have a coupon?</div>
              {couponApplied ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(45,80,22,0.06)', borderRadius: 12, padding: '10px 14px', border: '2px solid var(--forest)' }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--forest)' }}>{couponApplied.code}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>-₹{couponApplied.discountAmount} saved</div>
                  </div>
                  <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#e53935', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="ENTER CODE"
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `2px solid ${couponError ? '#e53935' : 'rgba(45,80,22,0.15)'}`, fontSize: 13, fontFamily: 'Lato,sans-serif', outline: 'none', letterSpacing: 1, fontWeight: 600 }}
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading}
                    style={{ background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Lato,sans-serif', whiteSpace: 'nowrap' }}>
                    {couponLoading ? '…' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <p style={{ color: '#e53935', fontSize: 12, marginTop: 6 }}>⚠ {couponError}</p>}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: '2px solid rgba(45,80,22,0.08)', paddingTop: 16, marginTop: 8 }}>
              {[['Subtotal', `₹${totalPrice}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['GST (5%)', `₹${gst}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>
                  <span>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#2e7d32', marginBottom: 10, fontWeight: 700 }}>
                  <span>🎟 Coupon ({couponApplied?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(45,80,22,0.08)', paddingTop: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--forest)' }}>₹{grandTotal}</span>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={placing}
              style={{ width: '100%', marginTop: 20, background: placing ? 'var(--earth)' : 'linear-gradient(135deg,var(--forest),#3d6b1f)', color: '#fff', padding: 16, borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 16, cursor: placing ? 'not-allowed' : 'pointer', fontFamily: 'Lato, sans-serif', boxShadow: '0 6px 20px rgba(45,80,22,0.3)' }}>
              {placing ? '⏳ Placing Order…' : '🌿 Place Order'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 12 }}>🔒 Your information is safe & secure</p>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.checkout-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}