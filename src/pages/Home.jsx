import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/api'

const CATEGORIES = [
  { icon: '🌾', label: 'Grains', desc: 'Ancient whole grains' },
  { icon: '🍯', label: 'Honey', desc: 'Raw & forest honey' },
  { icon: '🌿', label: 'Herbs', desc: 'Medicinal powders' },
  { icon: '🫙', label: 'Oils', desc: 'Cold pressed oils' },
]

const TRUST = [
  { icon: '🌱', title: '100% Natural', desc: 'No artificial additives or preservatives ever' },
  { icon: '🧪', title: 'Lab Tested', desc: 'Every batch tested for purity and potency' },
  { icon: '🚜', title: 'Farm Direct', desc: 'Sourced directly from certified organic farmers' },
  { icon: '📦', title: 'Safe Delivery', desc: 'Eco-friendly packaging to your doorstep' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Delhi', text: 'The Ashwagandha powder is unlike anything I\'ve tried before. My energy levels improved dramatically in just 3 weeks!', avatar: '👩' },
  { name: 'Rajesh Kumar', city: 'Mumbai', text: 'Best quality honey I\'ve ever tasted. Rich, raw, and pure. My whole family loves it.', avatar: '👨' },
  { name: 'Anita Patel', city: 'Ahmedabad', text: 'The multigrain daliya is perfect for breakfast. My kids love it and I know they\'re getting proper nutrition!', avatar: '👩‍🦱' },
]

function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let s = 0; const step = (end / 1500) * 16
        const t = setInterval(() => { s += step; if (s >= end) { setCount(end); clearInterval(t) } else setCount(Math.floor(s)) }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  useEffect(() => {
    getProducts().then(res => setFeatured(res.data.slice(0, 4))).catch(() => {})
  }, [])
  const [activeT, setActiveT] = useState(0)
  useEffect(() => { const t = setInterval(() => setActiveT(p => (p + 1) % 3), 4000); return () => clearInterval(t) }, [])

  return (
    <div style={{ paddingTop: 70 }}>

      {/* HERO */}
      <section style={{ minHeight: '92vh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1a3a08 0%, #2D5016 40%, #3d6b1f 70%, #8B6914 100%)', display: 'flex', alignItems: 'center' }}>
        {[{ w:600,h:600,top:-200,right:-100 },{ w:400,h:400,bottom:-100,left:-80 }].map((s,i) => (
          <div key={i} style={{ position:'absolute', borderRadius:'50%', border:'2px solid #fff', width:s.w, height:s.h, top:s.top, bottom:s.bottom, left:s.left, right:s.right, opacity:0.06, animation:`spin-slow ${20+i*5}s linear infinite` }} />
        ))}
        {['🌿','🍃','✨','🌱','🌾','🍀'].map((icon,i) => (
          <div key={i} style={{ position:'absolute', fontSize:20+i*4, opacity:0.15, top:`${15+i*13}%`, left:`${5+i*15}%`, animation:`float ${3+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }}>{icon}</div>
        ))}

        <div className="container" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', position:'relative', zIndex:1 }}>
          <div style={{ animation:'fadeInUp 0.8s ease both' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(244,162,36,0.2)', border:'1px solid rgba(244,162,36,0.4)', borderRadius:50, padding:'6px 16px', marginBottom:24 }}>
              <span style={{ fontSize:12, color:'var(--saffron)', fontWeight:600, letterSpacing:1.5, textTransform:'uppercase' }}>✨ Ancient Wisdom, Modern Wellness</span>
            </div>
            <h1 style={{ fontSize:'clamp(36px,5vw,62px)', color:'#fff', fontFamily:'Playfair Display,serif', lineHeight:1.15, marginBottom:20 }}>
              Nature's Finest<br /><span style={{ color:'var(--saffron)', fontStyle:'italic' }}>Ayurvedic</span><br />Products
            </h1>
            <p style={{ fontSize:17, color:'rgba(255,255,255,0.8)', lineHeight:1.8, marginBottom:36, maxWidth:460 }}>
              Handpicked herbs, cold-pressed oils, raw honey and ancient grains — straight from certified organic farms across India.
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              <Link to="/products" style={{ background:'var(--saffron)', color:'#fff', padding:'14px 32px', borderRadius:50, fontWeight:700, fontSize:15, boxShadow:'0 8px 24px rgba(244,162,36,0.4)', display:'inline-block' }}>Shop Now →</Link>
              <Link to="/products" style={{ background:'transparent', color:'#fff', padding:'14px 32px', borderRadius:50, fontWeight:600, fontSize:15, border:'2px solid rgba(255,255,255,0.4)', display:'inline-block' }}>Explore Herbs</Link>
            </div>
            <div style={{ display:'flex', gap:32, marginTop:44 }}>
              {[['500','+','Products'],['10K','+','Customers'],['100','%','Natural']].map(([n,s,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:'var(--saffron)', fontWeight:700, lineHeight:1 }}>{n}{s}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:4, textTransform:'uppercase', letterSpacing:1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', animation:'float 4s ease-in-out infinite' }}>
            <div style={{ width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle at 40% 40%, rgba(244,162,36,0.3) 0%, rgba(45,80,22,0.1) 60%, transparent 100%)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', border:'2px solid rgba(255,255,255,0.1)', boxShadow:'0 0 80px rgba(244,162,36,0.15)' }}>
              <div style={{ fontSize:120, filter:'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>🌿</div>
              {['🍯','🌾','🫙','🌱'].map((icon,i) => (
                <div key={i} style={{ position:'absolute', fontSize:30, top:`${50-45*Math.cos(i*Math.PI/2)}%`, left:`${50+45*Math.sin(i*Math.PI/2)}%`, transform:'translate(-50%,-50%)', background:'rgba(255,255,255,0.1)', borderRadius:'50%', width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.2)' }}>{icon}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <svg viewBox="0 0 1440 80" fill="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" /></svg>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding:'72px 0 48px' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:12, letterSpacing:3, color:'var(--earth)', textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Explore By Category</p>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,40px)', color:'var(--bark)' }}>What Are You Looking For?</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.label} to={`/products?category=${cat.label}`}>
                <div style={{ background:'#fff', borderRadius:20, padding:'32px 24px', textAlign:'center', boxShadow:'0 4px 20px rgba(45,80,22,0.08)', border:'1px solid rgba(45,80,22,0.06)', transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(45,80,22,0.15)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(45,80,22,0.08)'}}>
                  <div style={{ fontSize:48, marginBottom:16 }}>{cat.icon}</div>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, color:'var(--forest)', marginBottom:6 }}>{cat.label}</h3>
                  <p style={{ fontSize:13, color:'var(--text-light)' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding:'48px 0 72px', background:'linear-gradient(to bottom,var(--cream),var(--cream-dark))' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <p style={{ fontSize:12, letterSpacing:3, color:'var(--earth)', textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Handpicked For You</p>
              <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,40px)', color:'var(--bark)' }}>Featured Products</h2>
            </div>
            <Link to="/products" style={{ background:'var(--forest)', color:'#fff', padding:'12px 28px', borderRadius:50, fontWeight:600, fontSize:14, boxShadow:'0 4px 16px rgba(45,80,22,0.25)', display:'inline-block' }}>View All →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:'var(--forest)', padding:'60px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:32, textAlign:'center' }}>
            {[{end:500,suffix:'+',label:'Products'},{end:10000,suffix:'+',label:'Customers'},{end:15,suffix:'+',label:'Years Expertise'},{end:100,suffix:'%',label:'Natural'}].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:44, color:'var(--saffron)', fontWeight:700, lineHeight:1 }}><Counter end={s.end} suffix={s.suffix} /></div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding:'72px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:12, letterSpacing:3, color:'var(--earth)', textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Why Choose Us</p>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,40px)', color:'var(--bark)' }}>The Vaidya Vatika Promise</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:24 }}>
            {TRUST.map(b => (
              <div key={b.title} style={{ background:'#fff', borderRadius:20, padding:'32px 28px', boxShadow:'0 4px 20px rgba(45,80,22,0.07)', transition:'transform 0.3s,box-shadow 0.3s' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(45,80,22,0.12)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(45,80,22,0.07)'}}>
                <div style={{ fontSize:40, marginBottom:16 }}>{b.icon}</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, color:'var(--forest)', marginBottom:10 }}>{b.title}</h3>
                <p style={{ fontSize:14, color:'var(--text-light)', lineHeight:1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:'60px 0 80px', background:'var(--cream-dark)' }}>
        <div className="container" style={{ maxWidth:720 }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <p style={{ fontSize:12, letterSpacing:3, color:'var(--earth)', textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Customer Love</p>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,40px)', color:'var(--bark)' }}>What Our Customers Say</h2>
          </div>
          <div style={{ background:'#fff', borderRadius:24, padding:'40px 48px', boxShadow:'0 8px 40px rgba(45,80,22,0.10)', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>{TESTIMONIALS[activeT].avatar}</div>
            <div style={{ display:'flex', justifyContent:'center', gap:4, marginBottom:16 }}>{'⭐⭐⭐⭐⭐'.split('').map((s,i)=><span key={i}>{s}</span>)}</div>
            <p style={{ fontFamily:'Playfair Display,serif', fontStyle:'italic', fontSize:18, color:'var(--text-mid)', lineHeight:1.8, marginBottom:20 }}>"{TESTIMONIALS[activeT].text}"</p>
            <div style={{ fontWeight:700, color:'var(--forest)' }}>{TESTIMONIALS[activeT].name}</div>
            <div style={{ fontSize:13, color:'var(--text-light)', marginTop:4 }}>{TESTIMONIALS[activeT].city}</div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
            {TESTIMONIALS.map((_,i) => (
              <button key={i} onClick={()=>setActiveT(i)} style={{ width:i===activeT?24:8, height:8, borderRadius:4, border:'none', background:i===activeT?'var(--forest)':'rgba(45,80,22,0.2)', transition:'all 0.3s', cursor:'pointer' }} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'linear-gradient(135deg,var(--earth),var(--saffron))', padding:'64px 0', textAlign:'center' }}>
        <div className="container">
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,44px)', color:'#fff', marginBottom:16 }}>Begin Your Wellness Journey Today</h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.85)', marginBottom:36, maxWidth:500, margin:'0 auto 36px' }}>Explore our complete collection and experience the ancient art of natural healing.</p>
          <Link to="/products" style={{ background:'#fff', color:'var(--forest)', padding:'16px 40px', borderRadius:50, fontWeight:700, fontSize:16, display:'inline-block', boxShadow:'0 8px 24px rgba(0,0,0,0.15)' }}>🌿 Shop All Products</Link>
        </div>
      </section>

      <style>{`@media(max-width:768px){section .container>div[style*="1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
