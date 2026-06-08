import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProducts, getProductsByCat, searchProducts } from '../api/api'

const CATEGORIES = ['All', 'Grains', 'Honey', 'Herbs', 'Oils']
const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
]

const SkeletonCard = () => (
  <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(45,80,22,0.07)' }}>
    <div style={{ height: 200, background: '#f0e8d0', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: 20 }}>
      <div style={{ height: 12, background: '#f0e8d0', borderRadius: 6, width: '40%', marginBottom: 10 }} />
      <div style={{ height: 20, background: '#f0e8d0', borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 14, background: '#f0e8d0', borderRadius: 6, width: '85%', marginBottom: 16 }} />
      <div style={{ height: 14, background: '#f0e8d0', borderRadius: 6, width: '60%' }} />
    </div>
  </div>
)

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('default')
  const searchTimer = useRef(null)

  useEffect(() => { setCategory(searchParams.get('category') || 'All') }, [searchParams])
  useEffect(() => { if (!search.trim()) fetchProducts() }, [category])

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (search.trim()) {
      searchTimer.current = setTimeout(() => doSearch(search), 400)
    } else {
      fetchProducts()
    }
    return () => clearTimeout(searchTimer.current)
  }, [search])

  const fetchProducts = async () => {
    try {
      setLoading(true); setError(null)
      const res = category === 'All' ? await getProducts() : await getProductsByCat(category)
      setProducts(res.data)
    } catch {
      setError('Could not load products. Make sure Spring Boot is running on port 8080.')
    } finally { setLoading(false) }
  }

  const doSearch = async (q) => {
    try {
      setLoading(true); setError(null)
      const res = await searchProducts(q)
      setProducts(res.data)
    } catch {
      setError('Search failed.')
    } finally { setLoading(false) }
  }

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    if (sort === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--forest), #3d6b1f)', padding: '48px 0 40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: 'var(--saffron)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Our Collection</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,44px)', color: '#fff', marginBottom: 12 }}>All Ayurvedic Products</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>Pure, natural products sourced directly from organic farms across India</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 50, border: '2px solid rgba(45,80,22,0.15)', background: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Lato, sans-serif', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--forest)'}
              onBlur={e => e.target.style.borderColor = 'rgba(45,80,22,0.15)'} />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: 50, border: '2px solid rgba(45,80,22,0.15)', background: '#fff', fontSize: 14, fontFamily: 'Lato, sans-serif', cursor: 'pointer', outline: 'none' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32, alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setSearch('') }} style={{
              padding: '9px 22px', borderRadius: 50, border: '2px solid',
              borderColor: category === cat ? 'var(--forest)' : 'rgba(45,80,22,0.15)',
              background: category === cat ? 'var(--forest)' : '#fff',
              color: category === cat ? '#fff' : 'var(--text-mid)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Lato, sans-serif',
            }}>
              {cat === 'All' ? '🌿 ' : cat === 'Grains' ? '🌾 ' : cat === 'Honey' ? '🍯 ' : cat === 'Herbs' ? '🌱 ' : '🫙 '}{cat}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-light)' }}>
            {loading ? 'Loading…' : `${sorted.length} product${sorted.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--bark)', marginBottom: 8 }}>Backend not connected</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: 8 }}>{error}</p>
            <button onClick={fetchProducts} style={{ background: 'var(--forest)', color: '#fff', padding: '12px 28px', borderRadius: 50, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Lato, sans-serif', fontSize: 14, marginTop: 16 }}>🔄 Retry</button>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {sorted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--bark)', marginBottom: 8 }}>No products found</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Try a different search or category</p>
            <button onClick={() => { setSearch(''); setCategory('All') }} style={{ background: 'var(--forest)', color: '#fff', padding: '12px 28px', borderRadius: 50, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Lato, sans-serif', fontSize: 14 }}>Clear Filters</button>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}
