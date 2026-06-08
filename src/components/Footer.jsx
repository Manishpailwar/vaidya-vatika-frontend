import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bark)', color: 'var(--cream)', paddingTop: 60, marginTop: 80 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, paddingBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2D5016, #F4A224)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌿</div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 20, color: 'var(--cream)' }}>Vaidya Vatika</div>
                <div style={{ fontSize: 10, color: 'var(--saffron)', letterSpacing: 2, textTransform: 'uppercase' }}>Pure Ayurveda</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#c8b98a', maxWidth: 240 }}>Bringing ancient Ayurvedic wisdom to your doorstep. 100% natural, ethically sourced products since 2009.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, marginBottom: 20, color: 'var(--saffron)' }}>Quick Links</h4>
            {[['/', 'Home'], ['/products', 'All Products'], ['/about', 'About Us'], ['/contact', 'Contact Us'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', color: '#c8b98a', fontSize: 14, marginBottom: 9, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--saffron)'}
                onMouseLeave={e => e.target.style.color = '#c8b98a'}>→ {label}</Link>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, marginBottom: 20, color: 'var(--saffron)' }}>Categories</h4>
            {[['Grains', '🌾'], ['Honey', '🍯'], ['Herbs', '🌿'], ['Oils', '🫙']].map(([cat, icon]) => (
              <Link key={cat} to={`/products?category=${cat}`} style={{ display: 'block', color: '#c8b98a', fontSize: 14, marginBottom: 9, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--saffron)'}
                onMouseLeave={e => e.target.style.color = '#c8b98a'}>
                {icon} {cat}
              </Link>
            ))}
          </div>

          {/* Contact + Legal */}
          <div>
            <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, marginBottom: 20, color: 'var(--saffron)' }}>Contact Us</h4>
            {[['📍', 'Haridwar, Uttarakhand'], ['📞', '+91 98765 43210'], ['✉️', 'hello@vaidyavatika.com'], ['🕐', 'Mon–Sat: 9AM – 7PM']].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span style={{ fontSize: 13, color: '#c8b98a', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Legal</div>
              {[['terms', 'Terms & Conditions'], ['privacy', 'Privacy Policy'], ['refund', 'Refund Policy']].map(([slug, label]) => (
                <Link key={slug} to={`/legal/${slug}`} style={{ display: 'block', color: '#c8b98a', fontSize: 13, marginBottom: 7, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--saffron)'}
                  onMouseLeave={e => e.target.style.color = '#c8b98a'}>→ {label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <p style={{ fontSize: 13, color: '#a09070' }}>© 2024 Vaidya Vatika. All rights reserved.</p>
          <p style={{ fontSize: 13, color: '#a09070' }}>Made with 🌿 for your wellness</p>
        </div>
      </div>
    </footer>
  )
}
