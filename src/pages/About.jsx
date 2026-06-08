import { Link } from 'react-router-dom'

const TEAM = [
  { name: 'Dr. Arjun Sharma', role: 'Founder & Ayurvedic Expert', exp: '20+ years', icon: '👨‍⚕️', desc: 'BAMS graduate from BHU Varanasi. Dedicated to making authentic Ayurveda accessible to every household.' },
  { name: 'Priya Vatika', role: 'Head of Sourcing', exp: '12+ years', icon: '👩‍🌾', desc: 'Travels across India to handpick the best organic farms and tribal honey collectors for our products.' },
  { name: 'Rajan Mehta', role: 'Quality & Lab Testing', exp: '15+ years', icon: '👨‍🔬', desc: 'Ensures every batch meets our strict purity standards before it reaches your doorstep.' },
]

const MILESTONES = [
  { year: '2009', title: 'Founded in Haridwar', desc: 'Started as a small herbal shop near the Ganges with just 12 products.' },
  { year: '2013', title: 'First Farm Partnership', desc: 'Partnered with 5 certified organic farms across Uttarakhand and Himachal Pradesh.' },
  { year: '2017', title: 'Lab Testing Facility', desc: 'Opened our in-house quality testing lab to ensure purity of every product.' },
  { year: '2020', title: 'Went Online', desc: 'Launched Vaidya Vatika online to reach wellness seekers across India.' },
  { year: '2024', title: '10,000+ Happy Customers', desc: 'Serving over 10,000 families their daily dose of pure Ayurveda.' },
]

const VALUES = [
  { icon: '🌱', title: 'Purity First', desc: 'We never compromise on quality. Every product is tested for purity, potency and safety.' },
  { icon: '🤝', title: 'Farmer First', desc: 'We pay fair prices to our farmers and work directly with them — no middlemen.' },
  { icon: '🌍', title: 'Eco Conscious', desc: 'Biodegradable packaging, zero plastic policy, and carbon-neutral shipping.' },
  { icon: '📖', title: 'Knowledge Sharing', desc: 'We believe Ayurvedic wisdom belongs to everyone, not just the privileged.' },
  { icon: '🔬', title: 'Science Backed', desc: 'All our health claims are backed by traditional texts and modern research.' },
  { icon: '💚', title: 'Community Care', desc: '5% of profits go towards tribal community welfare programs in forest regions.' },
]

export default function About() {
  return (
    <div style={{ paddingTop: 70 }}>

      {/* HERO */}
      <section style={{ minHeight: '70vh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1a3a08 0%, #2D5016 50%, #3d6b1f 100%)', display: 'flex', alignItems: 'center' }}>
        {[{ w: 500, h: 500, top: -150, right: -100 }, { w: 300, h: 300, bottom: -80, left: -60 }].map((s, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)', width: s.w, height: s.h, top: s.top, bottom: s.bottom, left: s.left, right: s.right }} />
        ))}
        {['🌿', '🍃', '✨', '🌱'].map((icon, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: 24, opacity: 0.12, top: `${20 + i * 18}%`, left: `${8 + i * 22}%`, animation: `float ${3 + i * 0.6}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>{icon}</div>
        ))}
        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(244,162,36,0.2)', border: '1px solid rgba(244,162,36,0.4)', borderRadius: 50, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>Est. 2009 · Haridwar, India</span>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,58px)', color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
              Rooted in Tradition,<br /><span style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>Growing</span> with Purpose
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: 32, maxWidth: 480 }}>
              Vaidya Vatika was born from a simple belief — that the ancient wisdom of Ayurveda should be accessible to every family, not just the privileged few. We source the purest ingredients straight from nature so you can heal naturally.
            </p>
            <Link to="/products" style={{ background: 'var(--saffron)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 24px rgba(244,162,36,0.4)', display: 'inline-block' }}>
              Explore Our Products →
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(244,162,36,0.25) 0%, rgba(45,80,22,0.1) 60%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.1)', animation: 'float 4s ease-in-out infinite' }}>
              <span style={{ fontSize: 100 }}>🌿</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--cream)" /></svg>
        </div>
      </section>

      {/* STORY */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, letterSpacing: 3, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Our Story</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,42px)', color: 'var(--bark)', marginBottom: 20 }}>From a Haridwar Herb Shop<br />to Your Doorstep</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="story-grid">
            <div>
              <p style={{ fontSize: 16, color: 'var(--text-mid)', lineHeight: 1.9, marginBottom: 20 }}>
                It started in 2009, on a narrow lane near the Har Ki Pauri ghat in Haridwar. Dr. Arjun Sharma had just returned from 5 years of studying Ayurveda at BHU and opened a small shop to share what he'd learned — pure herbs, honest prices, and genuine care.
              </p>
              <p style={{ fontSize: 16, color: 'var(--text-mid)', lineHeight: 1.9, marginBottom: 20 }}>
                Word spread. Pilgrims became customers. Customers became families. The little shop grew. But one thing never changed — the commitment to sourcing only what nature intended, without shortcuts, adulterants or compromise.
              </p>
              <p style={{ fontSize: 16, color: 'var(--text-mid)', lineHeight: 1.9 }}>
                Today, Vaidya Vatika serves over 10,000 families across India. We work with 30+ certified organic farmers, maintain our own testing lab, and ship in biodegradable packaging. The name may have grown — but the roots remain the same.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['🌿', '30+', 'Certified Organic Farm Partners'], ['🧪', '100%', 'Products Lab Tested'], ['👨‍👩‍👧‍👦', '10K+', 'Families Served Across India'], ['🏆', '15+', 'Years of Ayurvedic Expertise']].map(([icon, num, label]) => (
                <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#fff', borderRadius: 16, padding: '18px 20px', boxShadow: '0 4px 16px rgba(45,80,22,0.07)', border: '1px solid rgba(45,80,22,0.06)' }}>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--forest)', lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 3 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(to bottom, var(--cream-dark), var(--cream))' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 12, letterSpacing: 3, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>What We Stand For</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,42px)', color: 'var(--bark)' }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ background: '#fff', borderRadius: 20, padding: '28px', boxShadow: '0 4px 20px rgba(45,80,22,0.07)', border: '1px solid rgba(45,80,22,0.06)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(45,80,22,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,80,22,0.07)' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--forest)', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 12, letterSpacing: 3, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Our Journey</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,42px)', color: 'var(--bark)' }}>15 Years of Growth</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(45,80,22,0.15)', transform: 'translateX(-50%)' }} />
            {MILESTONES.map((m, i) => (
              <div key={m.year} style={{ display: 'flex', gap: 32, marginBottom: 40, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', alignItems: 'center' }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                  <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 16px rgba(45,80,22,0.08)', display: 'inline-block', maxWidth: 280 }}>
                    <div style={{ fontSize: 12, letterSpacing: 2, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{m.year}</div>
                    <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--forest)', marginBottom: 6 }}>{m.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.6 }}>{m.desc}</p>
                  </div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0, boxShadow: '0 4px 14px rgba(45,80,22,0.3)', zIndex: 1 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: '72px 0', background: 'var(--cream-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 12, letterSpacing: 3, color: 'var(--earth)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>The People Behind It</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,42px)', color: 'var(--bark)' }}>Meet Our Team</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28 }}>
            {TEAM.map(member => (
              <div key={member.name} style={{ background: '#fff', borderRadius: 24, padding: '36px 28px', textAlign: 'center', boxShadow: '0 4px 20px rgba(45,80,22,0.08)', border: '1px solid rgba(45,80,22,0.06)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(45,80,22,0.13)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,80,22,0.08)' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(45,80,22,0.1), rgba(244,162,36,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 16px', border: '3px solid rgba(45,80,22,0.1)' }}>{member.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--bark)', marginBottom: 6 }}>{member.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--forest)', fontWeight: 700, marginBottom: 4 }}>{member.role}</div>
                <div style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600, marginBottom: 14, background: 'rgba(244,162,36,0.1)', padding: '3px 12px', borderRadius: 20, display: 'inline-block' }}>{member.exp} experience</div>
                <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--forest), #3d6b1f)', padding: '64px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,4vw,42px)', color: '#fff', marginBottom: 16 }}>Start Your Wellness Journey Today</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>Experience the Vaidya Vatika difference — pure, potent, and purposeful.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{ background: 'var(--saffron)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 24px rgba(244,162,36,0.4)', display: 'inline-block' }}>🌿 Shop Now</Link>
            <Link to="/contact" style={{ background: 'transparent', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 600, fontSize: 15, border: '2px solid rgba(255,255,255,0.4)', display: 'inline-block' }}>📞 Contact Us</Link>
          </div>
        </div>
      </section>

      <style>{`@media(max-width:768px){.story-grid,.about-hero-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
