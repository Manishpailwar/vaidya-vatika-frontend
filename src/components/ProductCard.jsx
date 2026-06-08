import { useState } from 'react'
import { getProductImage } from '../utils/productImage'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const BADGE_COLORS = {
  Bestseller: '#2D5016', Pure: '#F4A224', Organic: '#4a7c20',
  Virgin: '#8B6914', Superfood: '#1a6b4a', 'Fresh Ground': '#7b4f1a',
  Limited: '#c0392b', Classical: '#5c3d8f',
}

export default function ProductCard({ product }) {
  const { cart, dispatch } = useCart()
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation()
    const inCart = cart.find(i => i.id === product.id)?.qty || 0
    if (inCart >= product.stock) {
      toast.error(`Only ${product.stock} in stock!`, { style: { background: '#c62828', color: '#fff', borderRadius: 12 } })
      return
    }
    setAdding(true)
    dispatch({ type: 'ADD', item: product })
    toast.success(`${product.name} added to cart! 🌿`, {
      style: { background: 'var(--forest)', color: '#fff', borderRadius: 12 }
    })
    setTimeout(() => setAdding(false), 600)
  }

  return (
    <Link to={`/products/${product.id}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? '0 24px 60px rgba(45,80,22,0.18)' : '0 4px 20px rgba(45,80,22,0.08)',
          border: '1px solid rgba(45,80,22,0.06)', position: 'relative',
        }}
      >
        {product.badge && (
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: BADGE_COLORS[product.badge] || '#2D5016', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{product.badge}</div>
        )}
        {product.stock < 10 && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: '#c0392b', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>Only {product.stock} left</div>
        )}

        <div style={{ height: 200, overflow: 'hidden', background: 'var(--cream-dark)' }}>
          <img src={getProductImage(product)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered ? 'scale(1.08)' : 'scale(1)' }} />
        </div>

        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--earth)', textTransform: 'uppercase', marginBottom: 6 }}>{product.category}</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--bark)', marginBottom: 8, lineHeight: 1.3 }}>{product.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--forest)' }}>₹{product.price}</span>
            <button onClick={handleAdd} style={{
              background: adding ? 'var(--saffron)' : 'var(--forest)', color: '#fff', border: 'none',
              padding: '9px 18px', borderRadius: 50, fontSize: 13, fontWeight: 700,
              transition: 'all 0.25s', boxShadow: '0 4px 12px rgba(45,80,22,0.3)',
            }}>
              {adding ? '✓ Added' : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}