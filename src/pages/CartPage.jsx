import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, dispatch, totalItems, totalPrice } = useCart()
  const shipping = totalPrice > 499 ? 0 : 49
  const gst = Math.round(totalPrice * 0.05)
  const grandTotal = totalPrice + shipping + gst

  const remove = (id, name) => {
    dispatch({ type: 'REMOVE', id })
    toast(`${name} removed`, { style: { background: 'var(--bark)', color: '#fff', borderRadius: 12 } })
  }

  if (cart.length === 0) return (
    <div style={{ paddingTop: 90, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '90px 24px' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--bark)', marginBottom: 12 }}>Your cart is empty</h2>
      <p style={{ color: 'var(--text-light)', fontSize: 16, marginBottom: 32 }}>Discover our range of pure Ayurvedic products</p>
      <Link to="/products" style={{ background: 'var(--forest)', color: '#fff', padding: '14px 36px', borderRadius: 50, fontWeight: 700, fontSize: 15, boxShadow: '0 6px 20px rgba(45,80,22,0.3)', display: 'inline-block' }}>🌿 Shop Now</Link>
    </div>
  )

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ background: 'linear-gradient(135deg,var(--forest),#3d6b1f)', padding: '40px 0 32px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#fff' }}>Your Cart</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="cart-grid">

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 20px rgba(45,80,22,0.07)', border: '1px solid rgba(45,80,22,0.06)', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to={`/products/${item.id}`}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 14, flexShrink: 0 }} />
                </Link>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{item.category}</div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--bark)', marginBottom: 4 }}>{item.name}</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-light)' }}>₹{item.price} per pack</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid rgba(45,80,22,0.12)', borderRadius: 50, overflow: 'hidden' }}>
                  <button onClick={() => { if (item.qty === 1) remove(item.id, item.name); else dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 }) }} style={{ width: 36, height: 36, background: 'none', border: 'none', fontSize: 18, color: 'var(--forest)', cursor: 'pointer', fontWeight: 700 }}>−</button>
                  <span style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{item.qty}</span>
                  <button onClick={() => {
                    if (item.qty >= item.stock) {
                      toast.error(`Only ${item.stock} in stock!`, { style: { background: '#c62828', color: '#fff', borderRadius: 12 } })
                    } else {
                      dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })
                    }
                  }} style={{ width: 36, height: 36, background: 'none', border: 'none', fontSize: 18, color: item.qty >= item.stock ? '#ccc' : 'var(--forest)', cursor: item.qty >= item.stock ? 'not-allowed' : 'pointer', fontWeight: 700 }}>+</button>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--forest)' }}>₹{item.price * item.qty}</div>
                  <button onClick={() => remove(item.id, item.name)} style={{ background: 'none', border: 'none', color: '#e53935', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Lato, sans-serif', marginTop: 4 }}>✕ Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => { dispatch({ type: 'CLEAR' }); toast('Cart cleared', { style: { background: 'var(--bark)', color: '#fff', borderRadius: 12 } }) }}
              style={{ alignSelf: 'flex-start', background: 'none', border: '2px solid #e53935', color: '#e53935', padding: '10px 20px', borderRadius: 50, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Lato, sans-serif' }}>
              🗑 Clear Cart
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(45,80,22,0.10)', position: 'sticky', top: 90 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--bark)', marginBottom: 24 }}>Order Summary</h2>
            {[['Subtotal', `₹${totalPrice}`], ['Shipping', shipping === 0 ? 'FREE 🎉' : `₹${shipping}`], ['GST (5%)', `₹${gst}`]].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14, color: 'var(--text-mid)' }}>
                <span>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            {shipping > 0 && <div style={{ background: 'rgba(45,80,22,0.06)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: 'var(--forest)', fontWeight: 600 }}>💡 Add ₹{499 - totalPrice} more for FREE shipping!</div>}
            <div style={{ borderTop: '2px solid rgba(45,80,22,0.08)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Grand Total</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--forest)' }}>₹{grandTotal}</span>
            </div>
            <Link to="/checkout" style={{ display: 'block', textAlign: 'center', marginTop: 24, background: 'linear-gradient(135deg,var(--forest),#3d6b1f)', color: '#fff', padding: '15px 28px', borderRadius: 50, fontWeight: 700, fontSize: 16, boxShadow: '0 6px 20px rgba(45,80,22,0.3)' }}>
              Proceed to Checkout →
            </Link>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--text-light)', fontWeight: 600 }}>← Continue Shopping</Link>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(45,80,22,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['🔒 Secure Checkout', '🚚 Free shipping above ₹499', '↩️ Easy 7-day returns'].map(t => (
                <div key={t} style={{ fontSize: 12, color: 'var(--text-light)' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.cart-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}