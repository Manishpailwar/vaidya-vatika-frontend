import { useState, useEffect } from 'react'
import { getProductImage } from '../utils/productImage'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProduct } from '../api/api'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const { cart, dispatch } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const [activeMedia, setActiveMedia] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveMedia(0)
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true); setError(null)
      const res = await getProduct(id)
      setProduct(res.data)
      // Fetch related from same category
      const { getProductsByCat } = await import('../api/api')
      const relRes = await getProductsByCat(res.data.category)
      setRelated(relRes.data.filter(p => p.id !== res.data.id).slice(0, 3))
    } catch (err) {
      setError(err.response?.status === 404 ? 'Product not found.' : 'Could not load product. Is the backend running?')
    } finally { setLoading(false) }
  }

  const handleAdd = () => {
    const inCart = cart.find(i => i.id === product.id)?.qty || 0
    const canAdd = Math.min(qty, product.stock - inCart)
    if (canAdd <= 0) {
      toast.error(`Only ${product.stock} in stock${inCart > 0 ? ` (${inCart} already in cart)` : ''}!`, { style: { background: '#c62828', color: '#fff', borderRadius: 12 } })
      return
    }
    dispatch({ type: 'ADD', item: product, qty: canAdd })
    toast.success(`${canAdd}x ${product.name} added! 🌿`, { style: { background: 'var(--forest)', color: '#fff', borderRadius: 12 } })
  }

  if (loading) return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)' }}>
      <div className="container" style={{ paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div style={{ borderRadius: 24, height: 400, background: '#f0e8d0', animation: 'pulse 1.5s infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 20 }}>
            {[40, 60, 100, 40, 60].map((w, i) => <div key={i} style={{ height: 20, background: '#f0e8d0', borderRadius: 8, width: `${w}%`, animation: 'pulse 1.5s infinite' }} />)}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ fontSize: 64 }}>⚠️</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--bark)', margin: '16px 0 8px' }}>{error}</h2>
      <Link to="/products" style={{ color: 'var(--forest)', fontWeight: 600 }}>← Back to Products</Link>
    </div>
  )

  const TABS = {
    description: (
      <div>
        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.9, marginBottom: 16 }}>{product.description}</p>
        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.9 }}>Our products are sourced directly from certified organic farms. Each batch is carefully tested for purity and potency. No hidden additives, no artificial preservatives, no compromise.</p>
      </div>
    ),
    benefits: (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {['Boosts natural immunity and vitality', 'Rich in essential nutrients and antioxidants', 'Supports healthy digestion and metabolism', 'Zero artificial additives or preservatives', 'Suitable for all age groups', 'Lab-tested for purity and potency'].map(b => (
          <li key={b} style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 15, color: 'var(--text-mid)' }}>
            <span style={{ color: 'var(--forest)', fontWeight: 700 }}>✓</span> {b}
          </li>
        ))}
      </ul>
    ),
    usage: (
      <div>
        {[['1','Dosage','Take 1–2 teaspoons (5–10g) daily or as directed by your healthcare provider.'],
          ['2','Timing','Best consumed in the morning on an empty stomach for optimal absorption.'],
          ['3','Preparation','Mix with warm water, milk, or juice. Can also be added to smoothies.'],
          ['4','Storage','Store in a cool, dry place away from direct sunlight. Keep container sealed.']].map(([s,t,d]) => (
          <div key={s} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--forest)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s}</div>
            <div><div style={{ fontWeight: 700, color: 'var(--bark)', marginBottom: 4 }}>{t}</div><div style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7 }}>{d}</div></div>
          </div>
        ))}
      </div>
    ),
  }

  // Parse all media files for the gallery
  const mediaList = (() => {
    if (product.mediaFiles) {
      try {
        const files = typeof product.mediaFiles === 'string'
          ? JSON.parse(product.mediaFiles)
          : product.mediaFiles
        if (Array.isArray(files) && files.length > 0) return files
      } catch {}
    }
    // Fallback: wrap single imageUrl
    const fallback = getProductImage(product)
    return fallback ? [{ type: 'image', dataUrl: fallback, name: product.name }] : []
  })()

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32, fontSize: 13, color: 'var(--text-light)' }}>
          <Link to="/" style={{ color: 'var(--text-light)' }}>Home</Link><span>›</span>
          <Link to="/products" style={{ color: 'var(--text-light)' }}>Products</Link><span>›</span>
          <span style={{ color: 'var(--forest)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginBottom: 60 }} className="detail-grid">
          <div>
            {/* ── Main viewer ── */}
            <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '1', boxShadow: '0 20px 60px rgba(45,80,22,0.15)', background: 'var(--cream-dark)', position: 'relative' }}>
              {mediaList[activeMedia]?.type === 'video' ? (
                <video
                  key={activeMedia}
                  src={mediaList[activeMedia].dataUrl}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={mediaList[activeMedia]?.dataUrl || getProductImage(product)}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              )}
              {product.badge && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--forest)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 20, textTransform: 'uppercase' }}>{product.badge}</div>
              )}
              {/* Prev / Next arrows */}
              {mediaList.length > 1 && (
                <>
                  <button onClick={() => setActiveMedia(i => (i - 1 + mediaList.length) % mediaList.length)}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                  <button onClick={() => setActiveMedia(i => (i + 1) % mediaList.length)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                </>
              )}
            </div>

            {/* ── Thumbnail strip ── */}
            {mediaList.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {mediaList.map((m, i) => (
                  <div key={i} onClick={() => setActiveMedia(i)}
                    style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeMedia === i ? 'var(--forest)' : 'rgba(45,80,22,0.15)'}`, position: 'relative', transition: 'border-color 0.2s' }}>
                    {m.type === 'video' ? (
                      <>
                        <video src={m.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', fontSize: 18 }}>▶</div>
                      </>
                    ) : (
                      <img src={m.dataUrl} alt={`media-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              {[['🌱','100% Natural'],['🧪','Lab Tested'],['🚜','Farm Direct'],['📦','Safe Delivery']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fff', borderRadius: 12, padding: '10px 14px', boxShadow: '0 2px 8px rgba(45,80,22,0.06)' }}>
                  <span>{icon}</span><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--forest)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>{product.category}</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,3vw,38px)', color: 'var(--bark)', marginBottom: 14, lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 18 }}>
              {'⭐⭐⭐⭐⭐'.split('').map((s,i) => <span key={i}>{s}</span>)}
              <span style={{ fontSize: 13, color: 'var(--text-light)', marginLeft: 8 }}>(4.9 · 128 reviews)</span>
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: 'var(--forest)' }}>₹{product.price}</span>
              <span style={{ fontSize: 14, color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{Math.round(product.price * 1.2)}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32', background: '#e8f5e9', padding: '3px 10px', borderRadius: 20 }}>20% OFF</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? '#4caf50' : '#f44336' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: product.stock > 10 ? '#2e7d32' : '#c62828' }}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 10 }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', border: '2px solid rgba(45,80,22,0.15)', borderRadius: 50, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 20, color: 'var(--forest)', cursor: 'pointer', fontWeight: 700 }}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 20, color: 'var(--forest)', cursor: 'pointer', fontWeight: 700 }}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={handleAdd} disabled={product.stock === 0} style={{ flex: 1, minWidth: 150, background: 'var(--forest)', color: '#fff', padding: '15px 28px', borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(45,80,22,0.3)', fontFamily: 'Lato, sans-serif' }}>🛒 Add to Cart</button>
              <Link to="/cart" onClick={handleAdd} style={{ flex: 1, minWidth: 150, textAlign: 'center', background: 'var(--saffron)', color: '#fff', padding: '15px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, boxShadow: '0 6px 20px rgba(244,162,36,0.35)', display: 'inline-block' }}>⚡ Buy Now</Link>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(45,80,22,0.07)', marginBottom: 60 }}>
          <div style={{ display: 'flex', borderBottom: '2px solid rgba(45,80,22,0.08)', marginBottom: 28 }}>
            {['description','benefits','usage'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 24px', border: 'none', background: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', color: tab === t ? 'var(--forest)' : 'var(--text-light)', borderBottom: tab === t ? '2px solid var(--forest)' : '2px solid transparent', marginBottom: -2, textTransform: 'capitalize', fontFamily: 'Lato, sans-serif' }}>{t}</button>
            ))}
          </div>
          {TABS[tab]}
        </div>

        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--bark)', marginBottom: 28 }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`.detail-grid{grid-template-columns:1fr 1fr}@media(max-width:768px){.detail-grid{grid-template-columns:1fr!important}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}