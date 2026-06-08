import { useState } from 'react'
import toast from 'react-hot-toast'

const FAQS = [
  { q: 'Are all your products 100% natural?', a: 'Yes, absolutely. Every product at Vaidya Vatika is made from 100% natural ingredients sourced from certified organic farms. We never use artificial additives, preservatives, or synthetic chemicals.' },
  { q: 'How do I know if a product is right for me?', a: 'Each product page has a detailed description, benefits, and usage guide. For specific health conditions, we always recommend consulting a certified Ayurvedic practitioner or your doctor.' },
  { q: 'What is your return & refund policy?', a: 'We offer a 7-day return policy for unopened products. If you receive a damaged or incorrect product, contact us within 48 hours and we will arrange a replacement or full refund.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days across India. Express delivery (1–2 days) is available for select pin codes at an additional charge.' },
  { q: 'Do you ship outside India?', a: 'Currently we only ship within India. International shipping is coming soon — sign up to our newsletter to be notified.' },
]

const CONTACT_INFO = [
  { icon: '📍', title: 'Our Address', lines: ['Vaidya Vatika Natural Products', 'Near Har Ki Pauri, Haridwar', 'Uttarakhand – 249401, India'] },
  { icon: '📞', title: 'Phone & WhatsApp', lines: ['+91 98765 43210', '+91 98765 43211', 'Mon–Sat: 9AM – 7PM IST'] },
  { icon: '✉️', title: 'Email Us', lines: ['hello@vaidyavatika.com', 'support@vaidyavatika.com', 'We reply within 24 hours'] },
]

const Field = ({ label, name, type = 'text', placeholder, as, form, setForm, errors, setErrors }) => (
  <div>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</label>
    {as === 'textarea' ? (
      <textarea value={form[name]} placeholder={placeholder} rows={5}
        onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); if (errors[name]) setErrors(er => ({ ...er, [name]: '' })) }}
        style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: `2px solid ${errors[name] ? '#e53935' : 'rgba(45,80,22,0.15)'}`, background: '#fff', fontSize: 14, fontFamily: 'Lato, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
        onFocus={e => { if (!errors[name]) e.target.style.borderColor = 'var(--forest)' }}
        onBlur={e => { if (!errors[name]) e.target.style.borderColor = 'rgba(45,80,22,0.15)' }} />
    ) : as === 'select' ? (
      <select value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '2px solid rgba(45,80,22,0.15)', background: '#fff', fontSize: 14, fontFamily: 'Lato, sans-serif', outline: 'none', boxSizing: 'border-box' }}>
        {['General Inquiry', 'Order Issue', 'Product Question', 'Return & Refund', 'Bulk Order', 'Other'].map(opt => <option key={opt}>{opt}</option>)}
      </select>
    ) : (
      <input type={type} value={form[name]} placeholder={placeholder}
        onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); if (errors[name]) setErrors(er => ({ ...er, [name]: '' })) }}
        style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: `2px solid ${errors[name] ? '#e53935' : 'rgba(45,80,22,0.15)'}`, background: '#fff', fontSize: 14, fontFamily: 'Lato, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => { if (!errors[name]) e.target.style.borderColor = 'var(--forest)' }}
        onBlur={e => { if (!errors[name]) e.target.style.borderColor = 'rgba(45,80,22,0.15)' }} />
    )}
    {errors[name] && <p style={{ color: '#e53935', fontSize: 12, marginTop: 4 }}>⚠ {errors[name]}</p>}
  </div>
)

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim() || form.message.length < 10) e.message = 'Please write at least 10 characters'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false); setSent(true)
    toast.success('Message sent! We\'ll reply within 24 hours 🌿', { style: { background: 'var(--forest)', color: '#fff', borderRadius: 12 } })
  }

  return (
    <div style={{ paddingTop: 70 }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a3a08, #2D5016, #3d6b1f)', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {['🌿', '📞', '✉️', '💬'].map((icon, i) => (
            <div key={i} style={{ position: 'absolute', fontSize: 24, opacity: 0.1, top: `${15 + i * 20}%`, left: `${5 + i * 23}%`, animation: `float ${3 + i * 0.5}s ease-in-out infinite` }}>{icon}</div>
          ))}
        </div>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,52px)', color: '#fff', marginBottom: 16 }}>Get In Touch</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', maxWidth: 520, margin: '0 auto' }}>
            Have a question about our products, an order issue, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="var(--cream)" /></svg>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 60 }}>
            {CONTACT_INFO.map(info => (
              <div key={info.title} style={{ background: '#fff', borderRadius: 20, padding: '28px', textAlign: 'center', boxShadow: '0 4px 20px rgba(45,80,22,0.08)', border: '1px solid rgba(45,80,22,0.06)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(45,80,22,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,80,22,0.08)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(45,80,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>{info.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--forest)', marginBottom: 12 }}>{info.title}</h3>
                {info.lines.map(line => <p key={line} style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.8 }}>{line}</p>)}
              </div>
            ))}
          </div>

          {/* FORM + FAQ GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }} className="contact-grid">

            {/* FORM */}
            <div style={{ background: '#fff', borderRadius: 24, padding: 36, boxShadow: '0 8px 32px rgba(45,80,22,0.09)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 64, marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>🎉</div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--forest)', marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 24 }}>Thank you for reaching out, <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }) }}
                    style={{ background: 'var(--forest)', color: '#fff', padding: '12px 28px', borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Lato, sans-serif' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--bark)', marginBottom: 8 }}>Send Us a Message</h2>
                  <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 28 }}>We typically respond within 24 hours on business days.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Your Name *" name="name" placeholder="Rahul Sharma" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                      <Field label="Phone" name="phone" placeholder="9876543210 (optional)" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                    </div>
                    <Field label="Email Address *" name="email" type="email" placeholder="you@email.com" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                    <Field label="Subject" name="subject" as="select" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                    <Field label="Your Message *" name="message" placeholder="Tell us how we can help you…" as="textarea" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
                    <button onClick={handleSubmit} disabled={sending} style={{ background: sending ? 'var(--earth)' : 'linear-gradient(135deg, var(--forest), #3d6b1f)', color: '#fff', padding: '15px', borderRadius: 50, border: 'none', fontWeight: 700, fontSize: 16, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'Lato, sans-serif', boxShadow: '0 6px 20px rgba(45,80,22,0.3)' }}>
                      {sending ? '⏳ Sending…' : '🌿 Send Message'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--bark)', marginBottom: 8 }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 24 }}>Quick answers to common questions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FAQS.map((faq, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(45,80,22,0.07)', border: `2px solid ${openFaq === i ? 'rgba(45,80,22,0.15)' : 'rgba(45,80,22,0.06)'}`, transition: 'border-color 0.2s' }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'Lato, sans-serif' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bark)', lineHeight: 1.4 }}>{faq.q}</span>
                      <span style={{ fontSize: 18, color: 'var(--forest)', flexShrink: 0, transition: 'transform 0.25s', display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.8 }}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div style={{ background: 'var(--forest)', borderRadius: 20, padding: '24px', marginTop: 24 }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#fff', marginBottom: 16 }}>🕐 Business Hours</h3>
                {[['Monday – Friday', '9:00 AM – 7:00 PM'], ['Saturday', '10:00 AM – 5:00 PM'], ['Sunday', 'Closed']].map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>{day}</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}