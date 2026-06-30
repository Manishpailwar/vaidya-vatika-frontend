import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders, cancelOrder } from '../api/api'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['PLACED','PROCESSING','SHIPPED','DELIVERED']
const STATUS_COLORS = {
  PLACED:     { bg:'#e3f2fd', text:'#1565c0' },
  PROCESSING: { bg:'#fff8e1', text:'#f57f17' },
  SHIPPED:    { bg:'#e8f5e9', text:'#2e7d32' },
  DELIVERED:  { bg:'#f3e5f5', text:'#6a1b9a' },
  CANCELLED:  { bg:'#ffebee', text:'#c62828' },
}

const StatusBar = ({ status }) => {
  const idx = STATUS_STEPS.indexOf(status)
  if (status === 'CANCELLED') return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12 }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:'#e53935' }} />
      <span style={{ fontSize:13, fontWeight:700, color:'#c62828' }}>CANCELLED</span>
    </div>
  )
  return (
    <div style={{ marginTop:16 }}>
      <div style={{ display:'flex', alignItems:'center' }}>
        {STATUS_STEPS.map((step, i) => (
          <div key={step} style={{ display:'flex', alignItems:'center', flex: i < STATUS_STEPS.length-1 ? 1 : undefined }}>
            <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background: i<=idx?'var(--forest)':'rgba(45,80,22,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color: i<=idx?'#fff':'var(--text-light)', fontWeight:700 }}>
              {i < idx ? '✓' : i === idx ? '●' : '○'}
            </div>
            {i < STATUS_STEPS.length-1 && <div style={{ flex:1, height:3, background: i<idx?'var(--forest)':'rgba(45,80,22,0.1)' }} />}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
        {STATUS_STEPS.map((step, i) => (
          <div key={step} style={{ fontSize:10, color: i<=idx?'var(--forest)':'var(--text-light)', fontWeight: i===idx?700:400 }}>{step}</div>
        ))}
      </div>
    </div>
  )
}

export default function MyOrders() {
  const [orders, setOrders]     = useState([])
  const [expanded, setExpanded] = useState(null)
  const [email, setEmail]       = useState(() => JSON.parse(localStorage.getItem('vv_current_user')||'null')?.email || '')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const handleSearch = async () => {
    setLoading(true); setError(null)
    try {
      const res = await getMyOrders()
      setOrders(res.data); setSearched(true)
      if (res.data.length === 0) toast('No orders found for this email', { style:{ background:'var(--bark)', color:'#fff', borderRadius:12 } })
    } catch {
      setError('Could not load orders. Is the backend running?')
    } finally { setLoading(false) }
  }

  const handleCancel = (orderId) => setConfirmId(orderId)

  const confirmCancel = async () => {
    const orderId = confirmId
    setConfirmId(null)
    try {
      const res = await cancelOrder(orderId)
      setOrders(prev => prev.map(o => o.id === orderId ? res.data : o))
      toast.success('Order cancelled', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order')
    }
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })

  return (
    <>
      <div style={{ paddingTop:90, minHeight:'100vh', background:'var(--cream)' }}>
        <div style={{ background:'linear-gradient(135deg,var(--forest),#3d6b1f)', padding:'48px 0 40px' }}>
          <div className="container" style={{ textAlign:'center' }}>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:40, color:'#fff', marginBottom:12 }}>My Orders</h1>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:16 }}>Track and manage your Vaidya Vatika orders</p>
          </div>
        </div>

        <div className="container" style={{ paddingTop:40, paddingBottom:80, maxWidth:760 }}>
          {/* Search */}
          <div style={{ background:'#fff', borderRadius:20, padding:28, boxShadow:'0 4px 20px rgba(45,80,22,0.08)', marginBottom:32 }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, color:'var(--bark)', marginBottom:16 }}>🔍 Find Your Orders</h3>
            <div style={{ display:'flex', gap:12 }}>
              <input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter'&&handleSearch()}
                style={{ flex:1, padding:'13px 18px', borderRadius:50, border:'2px solid rgba(45,80,22,0.15)', background:'#fff', fontSize:14, fontFamily:'Lato,sans-serif', outline:'none' }}
                onFocus={e => e.target.style.borderColor='var(--forest)'}
                onBlur={e => e.target.style.borderColor='rgba(45,80,22,0.15)'} />
              <button onClick={handleSearch} disabled={loading} style={{ background:'var(--forest)', color:'#fff', padding:'13px 28px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:loading?'not-allowed':'pointer', fontFamily:'Lato,sans-serif' }}>
                {loading ? '⏳' : 'Search'}
              </button>
            </div>
            {error && <p style={{ color:'#e53935', fontSize:13, marginTop:10 }}>⚠ {error}</p>}
          </div>

          {/* No orders */}
          {searched && !loading && orders.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ fontSize:64, marginBottom:16 }}>📦</div>
              <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--bark)', marginBottom:8 }}>No orders found</h3>
              <p style={{ color:'var(--text-light)', marginBottom:24 }}>No orders found for <strong>{email}</strong></p>
              <Link to="/products" style={{ background:'var(--forest)', color:'#fff', padding:'12px 28px', borderRadius:50, fontWeight:700, fontSize:14 }}>Start Shopping</Link>
            </div>
          )}

          {/* Orders */}
          {orders.map(order => {
            const sc  = STATUS_COLORS[order.status] || STATUS_COLORS.PLACED
            const open = expanded === order.id
            return (
              <div key={order.id} style={{ background:'#fff', borderRadius:20, marginBottom:16, overflow:'hidden', boxShadow:'0 4px 20px rgba(45,80,22,0.07)', border:'1px solid rgba(45,80,22,0.06)' }}>
                <div style={{ padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap', cursor:'pointer', flex:1 }}
                    onClick={() => setExpanded(open ? null : order.id)}>
                    <div>
                      <div style={{ fontSize:11, letterSpacing:1.5, color:'var(--earth)', textTransform:'uppercase', fontWeight:700 }}>Order ID</div>
                      <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, color:'var(--forest)' }}>#{order.id}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:'var(--text-light)', textTransform:'uppercase', fontWeight:700 }}>Date</div>
                      <div style={{ fontSize:14, fontWeight:600, color:'var(--bark)' }}>{formatDate(order.createdAt)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:'var(--text-light)', textTransform:'uppercase', fontWeight:700 }}>Total</div>
                      <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, color:'var(--forest)' }}>₹{order.totalAmount}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    {order.status === 'PLACED' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        style={{ background:'none', border:'2px solid #e53935', color:'#e53935', padding:'7px 16px', borderRadius:50, fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Lato,sans-serif', whiteSpace:'nowrap' }}>
                        ✕ Cancel
                      </button>
                    )}
                    <span style={{ background:sc.bg, color:sc.text, padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:700 }}>{order.status}</span>
                    <span onClick={() => setExpanded(open ? null : order.id)} style={{ fontSize:18, color:'var(--text-light)', display:'inline-block', transition:'transform 0.2s', transform:open?'rotate(180deg)':'none', cursor:'pointer' }}>▾</span>
                  </div>
                </div>

                {open && (
                  <div style={{ padding:'0 24px 24px', borderTop:'1px solid rgba(45,80,22,0.08)' }}>
                    <StatusBar status={order.status} />
                    <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="order-detail-grid">
                      <div>
                        <h4 style={{ fontFamily:'Playfair Display,serif', fontSize:16, color:'var(--bark)', marginBottom:12 }}>Items Ordered</h4>
                        {order.items?.map(item => (
                          <div key={item.id} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
                            <img src={item.productImage} alt={item.productName} style={{ width:44, height:44, borderRadius:8, objectFit:'cover' }} />
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:'var(--bark)' }}>{item.productName}</div>
                              <div style={{ fontSize:12, color:'var(--text-light)' }}>×{item.quantity} · ₹{item.totalPrice}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 style={{ fontFamily:'Playfair Display,serif', fontSize:16, color:'var(--bark)', marginBottom:12 }}>Delivery To</h4>
                        <p style={{ fontSize:14, color:'var(--text-mid)', lineHeight:1.8 }}>
                          <strong>{order.customerName}</strong><br/>
                          {order.address}<br/>{order.city} – {order.pincode}<br/>
                          📞 {order.customerPhone}
                        </p>
                      </div>
                    </div>

                    {/* Invoice Breakdown */}
                    {(() => {
                      const itemsSubtotal = order.items?.reduce((s, i) => s + i.totalPrice, 0) || 0
                      const shipping = itemsSubtotal > 499 ? 0 : 49
                      const gst = Math.round(itemsSubtotal * 0.05)
                      const discount = order.discountAmount || 0
                      return (
                        <div style={{ marginTop:20, background:'#fafafa', borderRadius:14, border:'1px solid rgba(45,80,22,0.1)', overflow:'hidden' }}>
                          <div style={{ padding:'12px 16px', background:'rgba(45,80,22,0.05)', borderBottom:'1px solid rgba(45,80,22,0.08)' }}>
                            <h4 style={{ fontFamily:'Playfair Display,serif', fontSize:15, color:'var(--bark)', margin:0 }}>🧾 Invoice Breakdown</h4>
                          </div>
                          <div style={{ padding:'4px 0' }}>
                            {[
                              ['Items Subtotal', `₹${itemsSubtotal}`],
                              ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`],
                              ['GST (5%)', `₹${gst}`],
                            ].map(([label, value]) => (
                              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 16px', borderBottom:'1px solid #f0f0f0', fontSize:13, color:'var(--text-mid)' }}>
                                <span>{label}</span><span>{value}</span>
                              </div>
                            ))}
                            {discount > 0 && (
                              <div style={{ display:'flex', justifyContent:'space-between', padding:'9px 16px', borderBottom:'1px solid #f0f0f0', fontSize:13, color:'#2D5016', background:'#f0faf0' }}>
                                <span>🎟 Coupon {order.couponCode ? `(${order.couponCode})` : ''}</span>
                                <span style={{ fontWeight:700 }}>−₹{discount}</span>
                              </div>
                            )}
                            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', background:'var(--forest)', fontSize:15, fontWeight:700, color:'#fff' }}>
                              <span>Total Paid</span>
                              <span>₹{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}

                    <div style={{ display:'flex', gap:12, marginTop:16, flexWrap:'wrap' }}>
                      <Link to={`/track/${order.id}`} style={{ background:'var(--forest)', color:'#fff', padding:'9px 20px', borderRadius:50, fontWeight:700, fontSize:13 }}>
                        🚚 Track Order
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <style>{`@media(max-width:600px){.order-detail-grid{grid-template-columns:1fr!important}}`}</style>
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Cancel Order?"
        message={`Are you sure you want to cancel order #${confirmId}? This action cannot be undone.`}
        confirmLabel="Yes, Cancel Order"
        confirmColor="#e53935"
        onConfirm={confirmCancel}
        onCancel={() => setConfirmId(null)}
      />
    </>
  )
}