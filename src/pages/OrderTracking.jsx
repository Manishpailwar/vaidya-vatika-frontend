import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getOrderById, cancelOrder } from '../api/api'
import toast from 'react-hot-toast'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_STEPS = [
  { key:'PLACED',     icon:'📋', label:'Order Placed',  desc:'Your order has been received' },
  { key:'PROCESSING', icon:'⚙️', label:'Processing',    desc:'We\'re preparing your items' },
  { key:'SHIPPED',    icon:'🚚', label:'Shipped',        desc:'Your order is on the way' },
  { key:'DELIVERED',  icon:'✅', label:'Delivered',      desc:'Enjoy your Ayurvedic products!' },
]

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  // Auth guard — order tracking requires login.
  // Without this, anyone can enumerate orders by guessing numeric IDs
  // (e.g. /track/1, /track/2 ...) and see every customer's name,
  // phone, address and order details.
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('vv_current_user') || 'null') } catch { return null }
  })()

  if (!currentUser) {
    return (
      <div style={{ paddingTop:90, minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ background:'#fff', borderRadius:24, padding:'48px 40px', boxShadow:'0 12px 40px rgba(45,80,22,0.10)', maxWidth:420, width:'100%', margin:'0 24px', textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--forest)', marginBottom:8 }}>Sign in to track your order</h2>
          <p style={{ fontSize:14, color:'var(--text-light)', marginBottom:28 }}>
            Your order details are private. Please sign in to view them.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button
              onClick={() => navigate('/login', { state: { from: `/track/${orderId || ''}` } })}
              style={{ background:'var(--forest)', color:'#fff', padding:'13px 28px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 6px 20px rgba(45,80,22,0.3)' }}>
              Sign In →
            </button>
            <Link to="/products" style={{ background:'#fff', color:'var(--forest)', padding:'13px 28px', borderRadius:50, fontWeight:700, fontSize:14, border:'2px solid rgba(45,80,22,0.2)' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }
  const [order, setOrder]       = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [searchId, setSearchId] = useState(orderId || '')
  const [loading, setLoading]   = useState(!!orderId)
  const [notFound, setNotFound] = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => { if (orderId) fetchOrder(orderId) }, [orderId])

  const fetchOrder = async (id) => {
    setLoading(true); setNotFound(false); setError(null)
    try {
      const res = await getOrderById(id)
      setOrder(res.data)
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true)
      else setError('Could not connect to backend. Is it running on port 8080?')
    } finally { setLoading(false) }
  }

  const handleSearch = () => {
    if (!searchId.trim()) { toast.error('Enter your Order ID'); return }
    fetchOrder(searchId.trim())
  }

  const handleCancel = () => setShowConfirm(true)

  const confirmCancel = async () => {
    setShowConfirm(false)
    try {
      const res = await cancelOrder(order.id)
      setOrder(res.data)
      toast.success('Order cancelled', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order')
    }
  }

  const currentStep  = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1
  const isCancelled  = order?.status === 'CANCELLED'

  return (
    <>
    <div style={{ paddingTop:90, minHeight:'100vh', background:'var(--cream)' }}>
      <div style={{ background:'linear-gradient(135deg,var(--forest),#3d6b1f)', padding:'48px 0 40px' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🚚</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:40, color:'#fff', marginBottom:12 }}>Track Your Order</h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:16 }}>Enter your Order ID to see real-time status</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop:40, paddingBottom:80, maxWidth:720 }}>
        {/* Search Box */}
        <div style={{ background:'#fff', borderRadius:20, padding:28, boxShadow:'0 4px 20px rgba(45,80,22,0.08)', marginBottom:32 }}>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, color:'var(--bark)', marginBottom:16 }}>🔍 Find Your Order</h3>
          <div style={{ display:'flex', gap:12 }}>
            <input type="text" placeholder="e.g. 5 or 12" value={searchId} onChange={e => setSearchId(e.target.value)} onKeyDown={e => e.key==='Enter'&&handleSearch()}
              style={{ flex:1, padding:'13px 18px', borderRadius:50, border:'2px solid rgba(45,80,22,0.15)', background:'#fff', fontSize:15, fontFamily:'Lato,sans-serif', outline:'none' }}
              onFocus={e => e.target.style.borderColor='var(--forest)'}
              onBlur={e => e.target.style.borderColor='rgba(45,80,22,0.15)'} />
            <button onClick={handleSearch} disabled={loading} style={{ background:'var(--forest)', color:'#fff', padding:'13px 28px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:loading?'not-allowed':'pointer', fontFamily:'Lato,sans-serif' }}>
              {loading ? '⏳' : 'Track'}
            </button>
          </div>
          <p style={{ fontSize:12, color:'var(--text-light)', marginTop:10 }}>💡 Your Order ID was shown on the confirmation screen after placing the order.</p>
          {error && <p style={{ color:'#e53935', fontSize:13, marginTop:10 }}>⚠ {error}</p>}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <div style={{ fontSize:48, marginBottom:16, animation:'float 1.5s ease-in-out infinite' }}>⏳</div>
            <p style={{ color:'var(--text-light)', fontSize:16 }}>Looking up your order…</p>
          </div>
        )}

        {/* Not Found */}
        {!loading && notFound && (
          <div style={{ textAlign:'center', padding:'60px 24px', background:'#fff', borderRadius:20, boxShadow:'0 4px 20px rgba(45,80,22,0.07)' }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--bark)', marginBottom:8 }}>Order Not Found</h3>
            <p style={{ color:'var(--text-light)', marginBottom:24 }}>No order found with ID <strong>{searchId}</strong>.</p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/orders" style={{ background:'var(--forest)', color:'#fff', padding:'12px 24px', borderRadius:50, fontWeight:700, fontSize:14 }}>Search by Email</Link>
              <Link to="/products" style={{ background:'#fff', color:'var(--forest)', padding:'12px 24px', borderRadius:50, fontWeight:700, fontSize:14, border:'2px solid rgba(45,80,22,0.2)' }}>Continue Shopping</Link>
            </div>
          </div>
        )}

        {/* Order Found */}
        {!loading && order && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Header */}
            <div style={{ background:'#fff', borderRadius:20, padding:28, boxShadow:'0 4px 20px rgba(45,80,22,0.08)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:12, letterSpacing:2, color:'var(--earth)', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Order ID</div>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, color:'var(--forest)' }}>#{order.id}</div>
                  <div style={{ fontSize:13, color:'var(--text-light)', marginTop:4 }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN',{ day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, letterSpacing:1, color:'var(--text-light)', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Total</div>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, color:'var(--forest)' }}>₹{order.totalAmount}</div>
                </div>
              </div>

              {/* Status Timeline */}
              {!isCancelled ? (
                <div>
                  <div style={{ display:'flex', alignItems:'flex-start' }}>
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step.key} style={{ display:'flex', alignItems:'center', flex: i < STATUS_STEPS.length-1 ? 1 : undefined }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:60 }}>
                          <div style={{ width:48, height:48, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, background: i<=currentStep?'var(--forest)':'rgba(45,80,22,0.08)', boxShadow: i===currentStep?'0 0 0 4px rgba(45,80,22,0.15)':'none' }}>
                            {i < currentStep ? '✅' : step.icon}
                          </div>
                          <div style={{ fontSize:11, fontWeight:700, color: i<=currentStep?'var(--forest)':'var(--text-light)', marginTop:8, textAlign:'center' }}>{step.label}</div>
                          <div style={{ fontSize:10, color:'var(--text-light)', textAlign:'center', maxWidth:80, marginTop:2 }}>{step.desc}</div>
                        </div>
                        {i < STATUS_STEPS.length-1 && <div style={{ flex:1, height:3, background: i<currentStep?'var(--forest)':'rgba(45,80,22,0.1)', marginBottom:40 }} />}
                      </div>
                    ))}
                  </div>
                  {currentStep >= 0 && (
                    <div style={{ marginTop:20, background:'rgba(45,80,22,0.06)', borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontSize:24 }}>{STATUS_STEPS[currentStep]?.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, color:'var(--forest)', fontSize:15 }}>Current Status: {order.status}</div>
                        <div style={{ fontSize:13, color:'var(--text-mid)', marginTop:2 }}>{STATUS_STEPS[currentStep]?.desc}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background:'#ffebee', borderRadius:14, padding:'18px 20px', display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:28 }}>❌</span>
                  <div>
                    <div style={{ fontWeight:700, color:'#c62828', fontSize:16 }}>Order Cancelled</div>
                    <div style={{ fontSize:13, color:'#e57373', marginTop:2 }}>This order has been cancelled. Refund will be processed within 5–7 business days if applicable.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Items + Delivery */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="track-grid">
              <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 4px 16px rgba(45,80,22,0.07)' }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'var(--bark)', marginBottom:16 }}>Items Ordered</h3>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
                    <img src={item.productImage} alt={item.productName} style={{ width:48, height:48, borderRadius:10, objectFit:'cover', flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--bark)' }}>{item.productName}</div>
                      <div style={{ fontSize:12, color:'var(--text-light)' }}>×{item.quantity} · ₹{item.totalPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 4px 16px rgba(45,80,22,0.07)' }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'var(--bark)', marginBottom:16 }}>Delivery Address</h3>
                <div style={{ fontSize:14, color:'var(--text-mid)', lineHeight:2 }}>
                  <div>👤 <strong>{order.customerName}</strong></div>
                  <div>📍 {order.address}</div>
                  <div>🏙 {order.city} – {order.pincode}</div>
                  <div>📞 {order.customerPhone}</div>
                  <div>✉️ {order.customerEmail}</div>
                </div>
              </div>
            </div>

            {/* Invoice Breakdown */}
            {(() => {
              const itemsSubtotal = order.items?.reduce((s, i) => s + i.totalPrice, 0) || 0
              const shipping = itemsSubtotal > 499 ? 0 : 49
              const gst = Math.round(itemsSubtotal * 0.05)
              const discount = order.discountAmount || 0
              return (
                <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 16px rgba(45,80,22,0.07)' }}>
                  <div style={{ padding:'18px 24px', background:'rgba(45,80,22,0.04)', borderBottom:'1px solid rgba(45,80,22,0.08)' }}>
                    <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'var(--bark)', margin:0 }}>🧾 Invoice Breakdown</h3>
                  </div>
                  <div>
                    {[
                      ['Items Subtotal', `₹${itemsSubtotal}`],
                      ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`],
                      ['GST (5%)', `₹${gst}`],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 24px', borderBottom:'1px solid #f5f5f5', fontSize:14, color:'var(--text-mid)' }}>
                        <span>{label}</span><span>{value}</span>
                      </div>
                    ))}
                    {discount > 0 && (
                      <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 24px', borderBottom:'1px solid #f5f5f5', fontSize:14, color:'#2D5016', background:'#f0faf0' }}>
                        <span>🎟 Coupon {order.couponCode ? `(${order.couponCode})` : ''}</span>
                        <span style={{ fontWeight:700 }}>−₹{discount}</span>
                      </div>
                    )}
                    <div style={{ display:'flex', justifyContent:'space-between', padding:'16px 24px', background:'var(--forest)', fontSize:16, fontWeight:700, color:'#fff' }}>
                      <span>Total Paid</span>
                      <span style={{ fontFamily:'Playfair Display,serif', fontSize:20 }}>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Actions */}
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <Link to="/products" style={{ background:'var(--forest)', color:'#fff', padding:'13px 28px', borderRadius:50, fontWeight:700, fontSize:14, boxShadow:'0 4px 14px rgba(45,80,22,0.25)', display:'inline-block' }}>🌿 Shop Again</Link>
              {order.status === 'PLACED' && (
                <button onClick={handleCancel} style={{ background:'none', border:'2px solid #e53935', color:'#e53935', padding:'13px 28px', borderRadius:50, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>✕ Cancel Order</button>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:600px){.track-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
      <ConfirmDialog
        open={showConfirm}
        title="Cancel Order?"
        message={`Are you sure you want to cancel order #${order?.id}? This cannot be undone.`}
        confirmLabel="Yes, Cancel Order"
        confirmColor="#e53935"
        onConfirm={confirmCancel}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}