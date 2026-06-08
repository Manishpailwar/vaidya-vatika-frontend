import { useState, useEffect, useRef } from 'react'
import { getProductImage } from '../utils/productImage'
import { getProducts, addProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, verifyAdmin, getAdminStats } from '../api/api'
import toast from 'react-hot-toast'

const INIT = { name:'', description:'', price:'', imageUrl:'', mediaFiles:[], category:'Grains', stock:'', badge:'' }
const CATEGORIES = ['Grains','Honey','Herbs','Oils']
const BADGES     = ['','Bestseller','Pure','Organic','Virgin','Superfood','Fresh Ground','Limited','Classical']
const STATUSES   = ['PLACED','PROCESSING','SHIPPED','DELIVERED','CANCELLED']

/* ─── Simple form field ─── */
const F = ({ label, name, type='text', placeholder, as, form, setForm }) => (
  <div>
    <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{label}</label>
    {as==='select' ? (
      <select value={form[name]} onChange={e => setForm(f=>({...f,[name]:e.target.value}))} style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid rgba(45,80,22,0.15)', background:'#fff', fontSize:14, fontFamily:'Lato,sans-serif', outline:'none', boxSizing:'border-box' }}>
        {name==='category' ? CATEGORIES.map(c=><option key={c}>{c}</option>) : BADGES.map(b=><option key={b} value={b}>{b||'— None —'}</option>)}
      </select>
    ) : as==='textarea' ? (
      <textarea value={form[name]} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} placeholder={placeholder} rows={3} style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid rgba(45,80,22,0.15)', background:'#fff', fontSize:14, fontFamily:'Lato,sans-serif', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
    ) : (
      <input type={type} value={form[name]} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} placeholder={placeholder}
        style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid rgba(45,80,22,0.15)', background:'#fff', fontSize:14, fontFamily:'Lato,sans-serif', outline:'none', boxSizing:'border-box' }}
        onFocus={e=>e.target.style.borderColor='var(--forest)'} onBlur={e=>e.target.style.borderColor='rgba(45,80,22,0.15)'} />
    )}
  </div>
)

/* ─── Media Uploader ─── */
function MediaUploader({ mediaFiles, setForm }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const readFiles = (files) => {
    const allowed = Array.from(files).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    if (!allowed.length) { toast.error('Only images and videos are supported'); return }

    allowed.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const entry = {
          name: file.name,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          dataUrl: e.target.result,
          size: file.size,
        }
        setForm(f => {
          const already = (f.mediaFiles||[]).some(m => m.name === file.name && m.size === file.size)
          if (already) return f
          return { ...f, mediaFiles: [...(f.mediaFiles||[]), entry] }
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    readFiles(e.dataTransfer.files)
  }

  const removeMedia = (index) => {
    setForm(f => {
      const updated = f.mediaFiles.filter((_, i) => i !== index)
      // If first image was removed, update imageUrl to next image
      const firstImg = updated.find(m => m.type === 'image')
      return { ...f, mediaFiles: updated, imageUrl: firstImg ? firstImg.dataUrl : '' }
    })
  }

  const moveMedia = (from, to) => {
    setForm(f => {
      const arr = [...f.mediaFiles]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      const firstImg = arr.find(m => m.type === 'image')
      return { ...f, mediaFiles: arr, imageUrl: firstImg ? firstImg.dataUrl : f.imageUrl }
    })
  }

  const fmtSize = (bytes) => bytes < 1024*1024 ? `${(bytes/1024).toFixed(1)} KB` : `${(bytes/1024/1024).toFixed(1)} MB`

  return (
    <div>
      <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>
        Product Media — Images & Videos
      </label>

      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true)}}
        onDragLeave={()=>setDragging(false)}
        onDrop={handleDrop}
        onClick={()=>inputRef.current.click()}
        style={{
          border:`2px dashed ${dragging?'var(--forest)':'rgba(45,80,22,0.25)'}`,
          borderRadius:16,
          padding:'32px 20px',
          textAlign:'center',
          cursor:'pointer',
          background: dragging?'rgba(45,80,22,0.04)':'rgba(45,80,22,0.01)',
          transition:'all 0.2s',
          marginBottom: mediaFiles.length ? 16 : 0,
        }}
      >
        <div style={{ fontSize:36, marginBottom:8 }}>📁</div>
        <div style={{ fontWeight:700, fontSize:14, color:'var(--forest)', marginBottom:4 }}>
          Click to browse or drag & drop files here
        </div>
        <div style={{ fontSize:12, color:'var(--text-light)' }}>
          Supports JPG, PNG, WebP, GIF, MP4, MOV, WebM · Multiple files allowed
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display:'none' }}
          onChange={e=>readFiles(e.target.files)}
        />
      </div>

      {/* Preview grid */}
      {mediaFiles.length > 0 && (
        <div>
          <div style={{ fontSize:12, color:'var(--text-light)', marginBottom:8 }}>
            {mediaFiles.length} file{mediaFiles.length!==1?'s':''} added · First image is used as product thumbnail · Drag to reorder
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10 }}>
            {mediaFiles.map((m, i) => (
              <div key={i} style={{ position:'relative', borderRadius:12, overflow:'hidden', border:`2px solid ${i===0?'var(--forest)':'rgba(45,80,22,0.15)'}`, background:'#f9f9f9' }}>
                {/* Thumbnail */}
                {m.type === 'image' ? (
                  <img src={m.dataUrl} alt={m.name} style={{ width:'100%', height:100, objectFit:'cover', display:'block' }} />
                ) : (
                  <video src={m.dataUrl} style={{ width:'100%', height:100, objectFit:'cover', display:'block' }} muted />
                )}

                {/* Type badge */}
                <div style={{ position:'absolute', top:6, left:6, background:'rgba(0,0,0,0.55)', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:8, textTransform:'uppercase' }}>
                  {m.type === 'video' ? '🎬 Video' : '🖼 Image'}
                </div>

                {/* Primary badge on first item */}
                {i === 0 && (
                  <div style={{ position:'absolute', top:6, right:6, background:'var(--forest)', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:8 }}>
                    PRIMARY
                  </div>
                )}

                {/* Info + actions bar */}
                <div style={{ padding:'6px 8px', background:'#fff' }}>
                  <div style={{ fontSize:10, color:'var(--text-mid)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={m.name}>
                    {m.name}
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-light)' }}>{fmtSize(m.size)}</div>

                  <div style={{ display:'flex', gap:4, marginTop:5 }}>
                    {i > 0 && (
                      <button onClick={()=>moveMedia(i,i-1)} title="Move left"
                        style={{ flex:1, background:'rgba(45,80,22,0.08)', border:'none', borderRadius:6, padding:'3px 0', fontSize:11, cursor:'pointer', color:'var(--forest)' }}>◀</button>
                    )}
                    {i < mediaFiles.length-1 && (
                      <button onClick={()=>moveMedia(i,i+1)} title="Move right"
                        style={{ flex:1, background:'rgba(45,80,22,0.08)', border:'none', borderRadius:6, padding:'3px 0', fontSize:11, cursor:'pointer', color:'var(--forest)' }}>▶</button>
                    )}
                    <button onClick={()=>removeMedia(i)} title="Remove"
                      style={{ flex:1, background:'rgba(229,57,53,0.1)', border:'none', borderRadius:6, padding:'3px 0', fontSize:11, cursor:'pointer', color:'#c62828', fontWeight:700 }}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ─── */
export default function AdminPanel() {
  const [authed, setAuthed]     = useState(() => sessionStorage.getItem('vv_admin') === 'true')
  const [pwd, setPwd]           = useState('')
  const [tab, setTab]           = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders]     = useState([])
  const [stats, setStats]       = useState(null)
  const [form, setForm]         = useState(INIT)
  const [editing, setEditing]   = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [statusFilter, setStatusFilter]   = useState('ALL')

  const loadProducts = async () => { try { const r = await getProducts(); setProducts(r.data) } catch { toast.error('Could not load products') } }
  const loadOrders   = async () => { try { const r = await getAllOrders();  setOrders(r.data)   } catch { toast.error('Could not load orders')   } }
  const loadStats    = async () => { try { const r = await getAdminStats(); setStats(r.data)    } catch {} }

  useEffect(() => {
    if (!authed) return
    if (tab === 'dashboard') loadStats()
    if (tab === 'products')  loadProducts()
    if (tab === 'orders')    loadOrders()
  }, [authed, tab])

  const handleLogin = async () => {
    if (!pwd.trim()) { toast.error('Please enter a password'); return }
    setLoading(true)
    try {
      const res = await verifyAdmin(pwd)
      if (res.data.success) {
        sessionStorage.setItem('vv_admin', 'true')
        if (res.data.token) sessionStorage.setItem('vv_admin_token', res.data.token)
        setAuthed(true)
        toast.success('Welcome, Admin! 🌿', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
      } else {
        toast.error('Incorrect password')
      }
    } catch {
      const envPwd = import.meta.env.VITE_ADMIN_PASSWORD
      if (envPwd && pwd === envPwd) {
        sessionStorage.setItem('vv_admin', 'true')
        setAuthed(true)
        toast.success('Welcome, Admin! 🌿', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
      } else {
        toast.error('Incorrect password')
      }
    } finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price and stock are required'); return }
    setLoading(true)
    try {
      // Primary imageUrl = first image in mediaFiles, else the URL field
      const firstImg = (form.mediaFiles||[]).find(m => m.type === 'image')
      const imageUrl = firstImg ? firstImg.dataUrl : (form.imageUrl || '')

      const payload = {
        name: form.name,
        description: form.description,
        price: +form.price,
        stock: +form.stock,
        imageUrl,
        mediaFiles: form.mediaFiles && form.mediaFiles.length > 0
          ? JSON.stringify(form.mediaFiles)
          : null,
        category: form.category,
        badge: form.badge || '',
      }

      if (editing !== null) {
        const r = await updateProduct(editing, payload)
        setProducts(prev => prev.map(p => p.id === editing ? r.data : p))
        toast.success('Product updated ✓', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
      } else {
        const r = await addProduct(payload)
        setProducts(prev => [r.data, ...prev])
        toast.success('Product added! 🌿', { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
      }
      setForm(INIT); setEditing(null); setShowForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product')
    } finally { setLoading(false) }
  }

  const handleEdit = (p) => {
    let parsedMedia = []
    if (p.mediaFiles) {
      try { parsedMedia = JSON.parse(p.mediaFiles) } catch {}
    }
    if (!parsedMedia.length && p.imageUrl) {
      parsedMedia = [{ name:'current-image.jpg', type:'image', dataUrl: p.imageUrl, size: 0 }]
    }
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      imageUrl: p.imageUrl || '',
      mediaFiles: parsedMedia,
      category: p.category,
      stock: String(p.stock),
      badge: p.badge || '',
    })
    setEditing(p.id); setShowForm(true); window.scrollTo({top:0,behavior:'smooth'})
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast(`${name} deleted`, { style:{ background:'var(--bark)', color:'#fff', borderRadius:12 } })
    } catch { toast.error('Could not delete product') }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      const r = await updateOrderStatus(orderId, status)
      setOrders(prev => prev.map(o => o.id === orderId ? r.data : o))
      toast.success(`Status → ${status}`, { style:{ background:'var(--forest)', color:'#fff', borderRadius:12 } })
    } catch { toast.error('Could not update status') }
  }

  /* ── Login screen ── */
  if (!authed) return (
    <div style={{ paddingTop:90, minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:28, padding:'48px 40px', boxShadow:'0 20px 60px rgba(45,80,22,0.12)', maxWidth:400, width:'100%', margin:'0 24px', textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🌿</div>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:'var(--forest)', marginBottom:8 }}>Admin Panel</h1>
        <p style={{ fontSize:14, color:'var(--text-light)', marginBottom:32 }}>Vaidya Vatika — Secure Access</p>
        <input type="password" placeholder="Enter admin password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
          style={{ width:'100%', padding:'14px 18px', borderRadius:50, border:'2px solid rgba(45,80,22,0.15)', background:'#fff', fontSize:15, fontFamily:'Lato,sans-serif', outline:'none', marginBottom:16, textAlign:'center', boxSizing:'border-box' }}
          onFocus={e=>e.target.style.borderColor='var(--forest)'} onBlur={e=>e.target.style.borderColor='rgba(45,80,22,0.15)'} />
        <button onClick={handleLogin} disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,var(--forest),#3d6b1f)', color:'#fff', padding:14, borderRadius:50, border:'none', fontWeight:700, fontSize:16, cursor:loading?'not-allowed':'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 6px 20px rgba(45,80,22,0.3)' }}>
          {loading ? '⏳ Verifying…' : 'Login →'}
        </button>
        <p style={{ marginTop:16, fontSize:12, color:'var(--text-light)' }}>Contact your system administrator for access</p>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop:90, minHeight:'100vh', background:'var(--cream)' }}>
      <div style={{ background:'linear-gradient(135deg,var(--bark),#5c3410)', padding:'40px 0 32px' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:36, color:'#fff' }}>Admin Dashboard</h1>
            <p style={{ color:'rgba(255,255,255,0.65)', marginTop:6 }}>Manage your Vaidya Vatika store</p>
          </div>
          <button onClick={() => { sessionStorage.removeItem('vv_admin'); sessionStorage.removeItem('vv_admin_token'); setAuthed(false); setPwd('') }}
            style={{ background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.3)', color:'#fff', padding:'10px 22px', borderRadius:50, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>
            🚪 Sign Out
          </button>
          {stats && (
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {[['📦',stats.totalProducts,'Products'],['🛒',stats.totalOrders,'Orders'],['⏳',stats.pendingOrders,'Pending'],['💰',`₹${stats.totalRevenue}`,'Revenue']].map(([icon,count,label]) => (
                <div key={label} style={{ textAlign:'center', background:'rgba(255,255,255,0.1)', borderRadius:16, padding:'12px 16px', minWidth:80 }}>
                  <div style={{ fontSize:20 }}>{icon}</div>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, color:'var(--saffron)', fontWeight:700 }}>{count}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop:32, paddingBottom:80 }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
          {[['dashboard','📊 Dashboard'],['products','📦 Products'],['orders','🛒 Orders']].map(([t,label]) => (
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'11px 24px', borderRadius:50, border:'2px solid', borderColor:tab===t?'var(--forest)':'rgba(45,80,22,0.15)', background:tab===t?'var(--forest)':'#fff', color:tab===t?'#fff':'var(--text-mid)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>{label}</button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab==='dashboard' && stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
            {[['📦','Total Products',stats.totalProducts,'var(--forest)'],['🛒','Total Orders',stats.totalOrders,'#1976d2'],['⏳','Pending Orders',stats.pendingOrders,'#f9a825'],['💰','Total Revenue',`₹${stats.totalRevenue}`,'#2e7d32'],['⚠️','Low Stock Items',stats.lowStockProducts,'#e53935']].map(([icon,label,val,color]) => (
              <div key={label} style={{ background:'#fff', borderRadius:20, padding:'28px 24px', boxShadow:'0 4px 20px rgba(45,80,22,0.07)', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, color, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:13, color:'var(--text-light)', marginTop:8, textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {tab==='products' && (
          <div>
            <button onClick={()=>{setShowForm(!showForm);setEditing(null);setForm(INIT)}} style={{ marginBottom:20, background:showForm?'#e53935':'var(--forest)', color:'#fff', padding:'12px 28px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif', boxShadow:'0 4px 14px rgba(45,80,22,0.25)' }}>
              {showForm ? '✕ Cancel' : '+ Add New Product'}
            </button>

            {showForm && (
              <div style={{ background:'#fff', borderRadius:20, padding:28, boxShadow:'0 4px 20px rgba(45,80,22,0.09)', marginBottom:28, border:'2px solid rgba(45,80,22,0.08)' }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:'var(--bark)', marginBottom:24 }}>{editing ? '✏️ Edit Product' : '+ Add New Product'}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div style={{ gridColumn:'1/-1' }}><F label="Product Name *" name="name" placeholder="e.g. Multigrain Daliya" form={form} setForm={setForm} /></div>
                  <div style={{ gridColumn:'1/-1' }}><F label="Description" name="description" placeholder="Describe the product…" as="textarea" form={form} setForm={setForm} /></div>
                  <F label="Price (₹) *" name="price" type="number" placeholder="199" form={form} setForm={setForm} />
                  <F label="Stock *" name="stock" type="number" placeholder="50" form={form} setForm={setForm} />
                  <F label="Category" name="category" as="select" form={form} setForm={setForm} />
                  <F label="Badge" name="badge" as="select" form={form} setForm={setForm} />
                  <div style={{ gridColumn:'1/-1' }}>
                    <MediaUploader mediaFiles={form.mediaFiles||[]} setForm={setForm} />
                  </div>
                </div>
                <div style={{ marginTop:20, display:'flex', gap:12 }}>
                  <button onClick={handleSave} disabled={loading} style={{ background:'var(--forest)', color:'#fff', padding:'12px 32px', borderRadius:50, border:'none', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>
                    {loading ? '⏳ Saving…' : editing ? '✓ Update Product' : '+ Save Product'}
                  </button>
                  <button onClick={()=>{setShowForm(false);setEditing(null);setForm(INIT)}} style={{ background:'none', border:'2px solid rgba(45,80,22,0.15)', color:'var(--text-mid)', padding:'12px 24px', borderRadius:50, fontWeight:600, fontSize:14, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(45,80,22,0.07)' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'rgba(45,80,22,0.04)', borderBottom:'2px solid rgba(45,80,22,0.08)' }}>
                      {['Product','Category','Price','Stock','Media','Actions'].map(h => (
                        <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:1, whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      let mediaCount = 0
                      if (p.mediaFiles) { try { mediaCount = JSON.parse(p.mediaFiles).length } catch {} }
                      return (
                        <tr key={p.id} style={{ borderBottom:'1px solid rgba(45,80,22,0.06)' }}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(45,80,22,0.02)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'14px 20px' }}>
                            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                              <img src={getProductImage(p)} alt={p.name} style={{ width:44, height:44, borderRadius:8, objectFit:'cover', flexShrink:0 }} onError={e=>e.target.style.display='none'} />
                              <div>
                                <div style={{ fontWeight:700, fontSize:14, color:'var(--bark)' }}>{p.name}</div>
                                {p.badge && <span style={{ fontSize:10, background:'rgba(45,80,22,0.1)', color:'var(--forest)', padding:'2px 8px', borderRadius:10, fontWeight:700 }}>{p.badge}</span>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'14px 20px', fontSize:13, color:'var(--text-mid)' }}>{p.category}</td>
                          <td style={{ padding:'14px 20px', fontFamily:'Playfair Display,serif', fontWeight:700, color:'var(--forest)', fontSize:16 }}>₹{p.price}</td>
                          <td style={{ padding:'14px 20px', fontSize:13, fontWeight:600, color:p.stock>10?'#2e7d32':p.stock>0?'#f57f17':'#c62828' }}>{p.stock>0?`${p.stock} left`:'Out of stock'}</td>
                          <td style={{ padding:'14px 20px', fontSize:13, color:'var(--text-mid)' }}>
                            {mediaCount > 0 ? `${mediaCount} file${mediaCount!==1?'s':''}` : '—'}
                          </td>
                          <td style={{ padding:'14px 20px' }}>
                            <div style={{ display:'flex', gap:8 }}>
                              <button onClick={()=>handleEdit(p)} style={{ background:'rgba(45,80,22,0.08)', color:'var(--forest)', border:'none', padding:'7px 16px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>Edit</button>
                              <button onClick={()=>handleDelete(p.id,p.name)} style={{ background:'rgba(229,57,53,0.08)', color:'#c62828', border:'none', padding:'7px 16px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Lato,sans-serif' }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab==='orders' && (() => {
          const STATUS_BADGE = { PLACED:'#1976d2', PROCESSING:'#f9a825', SHIPPED:'#43a047', DELIVERED:'#8e24aa', CANCELLED:'#e53935' }
          const filtered = statusFilter==='ALL' ? orders : orders.filter(o=>o.status===statusFilter)
          return (
            <div>
              <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
                {['ALL',...STATUSES].map(s => {
                  const count = s==='ALL' ? orders.length : orders.filter(o=>o.status===s).length
                  const active = statusFilter===s
                  return (
                    <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:'8px 16px', borderRadius:50, border:`2px solid ${active?(STATUS_BADGE[s]||'var(--forest)'):'rgba(45,80,22,0.15)'}`, background:active?(STATUS_BADGE[s]||'var(--forest)'):'#fff', color:active?'#fff':'var(--text-mid)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Lato,sans-serif', transition:'all 0.2s' }}>
                      {s} <span style={{ opacity:0.75 }}>({count})</span>
                    </button>
                  )
                })}
                <span style={{ marginLeft:'auto', fontSize:13, color:'var(--text-light)', fontWeight:600 }}>
                  {filtered.length} order{filtered.length!==1?'s':''}
                </span>
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign:'center', padding:'80px 0', background:'#fff', borderRadius:20, boxShadow:'0 4px 20px rgba(45,80,22,0.07)' }}>
                  <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--bark)' }}>No orders{statusFilter!=='ALL'?` with status ${statusFilter}`:''}</h3>
                  <p style={{ color:'var(--text-light)', marginTop:8 }}>Customer orders will appear here</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {filtered.map(order => {
                    const expanded = expandedOrder === order.id
                    return (
                      <div key={order.id} style={{ background:'#fff', borderRadius:18, boxShadow:'0 4px 16px rgba(45,80,22,0.07)', overflow:'hidden', border:`2px solid ${expanded?'rgba(45,80,22,0.15)':'transparent'}`, transition:'border-color 0.2s' }}>
                        <div style={{ padding:'18px 24px', display:'flex', gap:16, alignItems:'center', flexWrap:'wrap', cursor:'pointer' }} onClick={()=>setExpandedOrder(expanded?null:order.id)}>
                          <div style={{ fontSize:14, color:'var(--forest)', transform:expanded?'rotate(90deg)':'rotate(0deg)', transition:'transform 0.2s', fontWeight:900, flexShrink:0 }}>▶</div>
                          <div style={{ minWidth:140 }}>
                            <div style={{ fontFamily:'Playfair Display,serif', fontSize:17, fontWeight:700, color:'var(--forest)' }}>#{order.id}</div>
                            <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'}
                            </div>
                          </div>
                          <div style={{ flex:1, minWidth:160 }}>
                            <div style={{ fontWeight:700, fontSize:14, color:'var(--bark)' }}>👤 {order.customerName||'—'}</div>
                            <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>✉ {order.customerEmail||'—'}</div>
                            <div style={{ fontSize:12, color:'var(--text-light)' }}>📞 {order.customerPhone||'—'}</div>
                          </div>
                          <div style={{ textAlign:'center', minWidth:60 }}>
                            <div style={{ fontWeight:700, fontSize:16, color:'var(--bark)' }}>{order.items?.length||0}</div>
                            <div style={{ fontSize:11, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:0.5 }}>Items</div>
                          </div>
                          <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:'var(--forest)', minWidth:80, textAlign:'right' }}>₹{order.totalAmount}</div>
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }} onClick={e=>e.stopPropagation()}>
                            <span style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, color:'#fff', background:STATUS_BADGE[order.status]||'#2D5016', letterSpacing:0.5 }}>{order.status}</span>
                            <select value={order.status} onChange={e=>handleStatusChange(order.id,e.target.value)}
                              style={{ padding:'6px 12px', borderRadius:50, border:'2px solid rgba(45,80,22,0.15)', background:'#fff', fontSize:12, fontWeight:700, color:'var(--forest)', fontFamily:'Lato,sans-serif', cursor:'pointer', outline:'none' }}>
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        {expanded && (
                          <div style={{ borderTop:'2px solid rgba(45,80,22,0.07)', padding:'20px 24px', background:'rgba(45,80,22,0.01)' }}>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
                              <div>
                                <h4 style={{ fontFamily:'Playfair Display,serif', fontSize:15, color:'var(--bark)', marginBottom:12 }}>Customer Details</h4>
                                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                  {[['👤 Name',order.customerName],['✉ Email',order.customerEmail],['📞 Phone',order.customerPhone],['💳 Payment',order.paymentMethod||'COD']].map(([label,val]) => (
                                    <div key={label} style={{ display:'flex', gap:8, fontSize:13 }}>
                                      <span style={{ color:'var(--text-light)', minWidth:90 }}>{label}</span>
                                      <span style={{ fontWeight:600, color:'var(--bark)' }}>{val||'—'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 style={{ fontFamily:'Playfair Display,serif', fontSize:15, color:'var(--bark)', marginBottom:12 }}>Delivery Address</h4>
                                <div style={{ background:'rgba(45,80,22,0.05)', borderRadius:12, padding:'14px 16px', fontSize:13, color:'var(--text-mid)', lineHeight:1.8 }}>
                                  <div style={{ fontWeight:600 }}>{order.address||'—'}</div>
                                  <div>{[order.city, order.pincode].filter(Boolean).join(' – ')}</div>
                                </div>
                              </div>
                            </div>
                            {order.items && order.items.length > 0 && (
                              <div style={{ marginTop:20 }}>
                                <h4 style={{ fontFamily:'Playfair Display,serif', fontSize:15, color:'var(--bark)', marginBottom:12 }}>Order Items</h4>
                                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                  {order.items.map((item, i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#fff', borderRadius:12, border:'1px solid rgba(45,80,22,0.08)' }}>
                                      {item.productImage && <img src={item.productImage} alt={item.productName} style={{ width:44, height:44, borderRadius:8, objectFit:'cover', flexShrink:0 }} onError={e=>e.target.style.display='none'} />}
                                      <div style={{ flex:1 }}>
                                        <div style={{ fontWeight:700, fontSize:14, color:'var(--bark)' }}>{item.productName||'Product'}</div>
                                        <div style={{ fontSize:12, color:'var(--text-light)' }}>Qty: {item.quantity} × ₹{item.unitPrice}</div>
                                      </div>
                                      <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:15, color:'var(--forest)' }}>₹{item.quantity * item.unitPrice}</div>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ marginTop:12, padding:'12px 16px', background:'var(--forest)', borderRadius:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                  <span style={{ color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600 }}>Order Total</span>
                                  <span style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:'#fff' }}>₹{order.totalAmount}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}