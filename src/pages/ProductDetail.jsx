import { useState, useEffect } from 'react'
import { getProductImage } from '../utils/productImage'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProduct, getReviews, addReview, getReviewSummary } from '../api/api'
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
  const [tab, setTab]         = useState('description')  // first tab open by default
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 })
  const [myRating, setMyRating]   = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewed, setReviewed]   = useState(false)
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('vv_current_user') || 'null') } catch { return null } })()
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
      // Load reviews and summary in parallel
      getReviews(id).then(r => {
        setReviews(r.data)
        const user = (() => { try { return JSON.parse(localStorage.getItem('vv_current_user') || 'null') } catch { return null } })()
        if (user) setReviewed(r.data.some(rv => rv.userEmail === user.email))
      }).catch(() => {})
      getReviewSummary(id).then(r => setSummary(r.data)).catch(() => {})
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

  const handleSubmitReview = async () => {
    if (!currentUser) { toast.error('Please sign in to leave a review'); return }
    if (myRating === 0) { toast.error('Please select a rating'); return }
    setSubmitting(true)
    try {
      const res = await addReview(product.id, { rating: myRating, comment: myComment })
      setReviews(prev => [res.data, ...prev])
      setSummary(prev => ({
        averageRating: ((prev.averageRating * prev.totalReviews) + myRating) / (prev.totalReviews + 1),
        totalReviews: prev.totalReviews + 1
      }))
      setReviewed(true)
      setMyRating(0); setMyComment('')
      toast.success('Review submitted! Thank you 🌿', { style: { background: 'var(--forest)', color: '#fff', borderRadius: 12 } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review')
    } finally { setSubmitting(false) }
  }

  const StarRating = ({ value, onChange, size = 24 }) => (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(star => (
        <span key={star} onClick={() => onChange && onChange(star)}
          style={{ fontSize: size, cursor: onChange ? 'pointer' : 'default', color: star <= value ? '#F4A224' : '#ddd', transition: 'color 0.15s' }}>★</span>
      ))}
    </div>
  )

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

  // Build tabs dynamically — only show tabs where admin has added content
  const buildTabs = () => {
    const tabs = {}

    // Description is always shown
    tabs['description'] = (
      <div>
        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.9 }}>{product.description}</p>
      </div>
    )

    // Details tab — only if admin filled it
    if (product.details) {
      tabs['details'] = (
        <div style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
          {product.details}
        </div>
      )
    }

    // How to Use tab — only if admin filled it
    if (product.howToUse) {
      tabs['how to use'] = (
        <div>
          {product.howToUse.split('\n').filter(Boolean).map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--forest)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7, paddingTop: 6 }}>{line}</div>
            </div>
          ))}
        </div>
      )
    }

    // Key Ingredients tab — only if admin filled it
    if (product.keyIngredients) {
      tabs['key ingredients'] = (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {product.keyIngredients.split(/[,\n]/).filter(Boolean).map((ingredient, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(45,80,22,0.04)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(45,80,22,0.1)' }}>
              <span style={{ color: 'var(--forest)', fontWeight: 700, fontSize: 18 }}>🌿</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--bark)' }}>{ingredient.trim()}</span>
            </div>
          ))}
        </div>
      )
    }

    // Specifications tab — only if admin filled it
    if (product.specifications) {
      tabs['specifications'] = (
        <div>
          {product.specifications.split('\n').filter(Boolean).map((line, i) => {
            const [key, ...rest] = line.split(':')
            const val = rest.join(':').trim()
            return val ? (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid rgba(45,80,22,0.07)' }}>
                <span style={{ fontWeight: 700, color: 'var(--bark)', minWidth: 140, fontSize: 14 }}>{key.trim()}</span>
                <span style={{ color: 'var(--text-mid)', fontSize: 14 }}>{val}</span>
              </div>
            ) : (
              <div key={i} style={{ padding: '12px 0', fontWeight: 700, color: 'var(--forest)', fontSize: 14, borderBottom: '1px solid rgba(45,80,22,0.07)' }}>{line}</div>
            )
          })}
        </div>
      )
    }

    return tabs
  }

  const TABS = buildTabs()
  const tabKeys = Object.keys(TABS)

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
                  src={mediaList[activeMedia].url || mediaList[activeMedia].dataUrl}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={mediaList[activeMedia]?.url || mediaList[activeMedia]?.dataUrl || getProductImage(product)}
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
                        <video src={m.url || m.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', fontSize: 18 }}>▶</div>
                      </>
                    ) : (
                      <img src={m.url || m.dataUrl} alt={`media-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

        {/* ── Product Info Accordion ── */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--bark)', marginBottom: 16 }}>Product Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tabKeys.map((t, idx) => (
              <div key={t} style={{ background: '#fff', borderRadius: idx === 0 ? '16px 16px 0 0' : idx === tabKeys.length - 1 ? '0 0 16px 16px' : 0, overflow: 'hidden', boxShadow: '0 2px 8px rgba(45,80,22,0.06)', border: '1px solid rgba(45,80,22,0.08)' }}>
                {/* Accordion header */}
                <button
                  onClick={() => setTab(tab === t ? null : t)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: tab === t ? 'rgba(45,80,22,0.04)' : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Lato, sans-serif' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: tab === t ? 'var(--forest)' : 'var(--bark)', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>
                      {t === 'description' ? '📄' : t === 'details' ? '📋' : t === 'how to use' ? '📖' : t === 'key ingredients' ? '🌿' : '📦'}
                    </span>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                  <span style={{ fontSize: 20, color: 'var(--forest)', fontWeight: 700, transform: tab === t ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>+</span>
                </button>
                {/* Accordion content */}
                {tab === t && (
                  <div style={{ padding: '4px 24px 24px', borderTop: '1px solid rgba(45,80,22,0.08)' }}>
                    {TABS[t]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* ── Reviews Section ── */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--bark)', margin: 0 }}>
              Customer Reviews
            </h2>
            {summary.totalReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 16, padding: '12px 20px', boxShadow: '0 2px 12px rgba(45,80,22,0.08)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--forest)', lineHeight: 1 }}>{Number(summary.averageRating).toFixed(1)}</div>
                  <StarRating value={Math.round(summary.averageRating)} size={16} />
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}</div>
                </div>
              </div>
            )}
          </div>

          {/* Write a review */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(45,80,22,0.07)', marginBottom: 24 }}>
            {!currentUser ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ color: 'var(--text-mid)', marginBottom: 12 }}>Sign in to leave a review</p>
                <Link to="/login" style={{ background: 'var(--forest)', color: '#fff', padding: '10px 24px', borderRadius: 50, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Sign In</Link>
              </div>
            ) : reviewed ? (
              <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--forest)', fontWeight: 600 }}>
                ✅ You have already reviewed this product. Thank you!
              </div>
            ) : (
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--bark)', marginBottom: 16 }}>Write a Review</h3>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 8 }}>Your Rating *</div>
                  <StarRating value={myRating} onChange={setMyRating} size={32} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Your Review</label>
                  <textarea value={myComment} onChange={e => setMyComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid rgba(45,80,22,0.15)', fontSize: 14, fontFamily: 'Lato, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--forest)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(45,80,22,0.15)'} />
                </div>
                <button onClick={handleSubmitReview} disabled={submitting}
                  style={{ background: 'var(--forest)', color: '#fff', padding: '12px 28px', borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'Lato, sans-serif', boxShadow: '0 4px 14px rgba(45,80,22,0.25)' }}>
                  {submitting ? '\u23f3 Submitting\u2026' : '\u2b50 Submit Review'}
                </button>
              </div>
            )}
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(45,80,22,0.07)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
              <p style={{ color: 'var(--text-light)', fontSize: 15 }}>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map(review => (
                <div key={review.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(45,80,22,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--forest)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                        {review.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--bark)' }}>{review.userName}</div>
                        {review.isVerifiedPurchase && (
                          <span style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>✅ Verified Purchase</span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <StarRating value={review.rating} size={16} />
                      <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, margin: 0 }}>{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
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