import { useParams, Link } from 'react-router-dom'

const CONTENT = {
  terms: {
    title: 'Terms & Conditions',
    icon: '📄',
    updated: 'January 1, 2024',
    sections: [
      { heading: '1. Acceptance of Terms', body: 'By accessing and using the Vaidya Vatika website (vaidyavatika.com), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.' },
      { heading: '2. Products & Descriptions', body: 'We strive to ensure that all product descriptions, images, and pricing are accurate. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. All products are subject to availability.' },
      { heading: '3. Pricing & Payment', body: 'All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. We reserve the right to change prices at any time without prior notice. Payment must be received before dispatch of goods.' },
      { heading: '4. Order Acceptance', body: 'We reserve the right to accept or decline any order at our sole discretion. Your receipt of an order confirmation does not constitute acceptance of an order. We reserve the right to cancel orders due to product unavailability, pricing errors, or suspected fraud.' },
      { heading: '5. Shipping & Delivery', body: 'We aim to dispatch orders within 1–2 business days. Delivery typically takes 3–5 business days for standard shipping. Vaidya Vatika is not responsible for delays caused by courier partners, natural disasters, or other events outside our control.' },
      { heading: '6. Intellectual Property', body: 'All content on this website including text, graphics, logos, images, and software is the property of Vaidya Vatika and is protected by Indian and international intellectual property laws. Unauthorized use is strictly prohibited.' },
      { heading: '7. Disclaimer', body: 'Ayurvedic products are not intended to diagnose, treat, cure, or prevent any disease. Information provided on this website is for educational purposes only and should not substitute professional medical advice. Always consult a qualified healthcare provider before starting any supplement regimen.' },
      { heading: '8. Governing Law', body: 'These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Haridwar, Uttarakhand.' },
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    icon: '🔒',
    updated: 'January 1, 2024',
    sections: [
      { heading: '1. Information We Collect', body: 'We collect information you provide directly, including your name, email address, phone number, delivery address, and payment information when you place an order. We also collect browsing data, device information, and usage patterns to improve our services.' },
      { heading: '2. How We Use Your Information', body: 'Your information is used to process orders, send order confirmations, provide customer support, send promotional emails (only if you opt in), improve our products and website, and comply with legal obligations. We never sell your personal data to third parties.' },
      { heading: '3. Data Sharing', body: 'We share your information only with: (a) Courier partners to deliver your orders, (b) Payment gateways to process transactions, (c) Legal authorities when required by law. All third-party partners are bound by strict confidentiality agreements.' },
      { heading: '4. Cookies', body: 'We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies in your browser settings, though this may affect website functionality. We do not use cookies to track you across other websites.' },
      { heading: '5. Data Security', body: 'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information. However, no method of transmission over the internet is 100% secure.' },
      { heading: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. You may also opt out of marketing communications. To exercise these rights, contact us at privacy@vaidyavatika.com. We will respond within 30 days.' },
      { heading: '7. Data Retention', body: 'We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Order data is retained for 7 years for tax and legal purposes. You may request deletion of non-essential data at any time.' },
      { heading: '8. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. Your continued use of our services after changes constitutes acceptance of the updated policy.' },
    ]
  },
  refund: {
    title: 'Refund & Return Policy',
    icon: '↩️',
    updated: 'January 1, 2024',
    sections: [
      { heading: '1. Return Eligibility', body: 'You may return most unopened, unused products within 7 days of delivery. Products must be in their original packaging with all seals intact. We cannot accept returns of opened consumable products due to hygiene and safety reasons, unless the product is defective.' },
      { heading: '2. Damaged or Incorrect Products', body: 'If you receive a damaged, defective, or incorrect product, please contact us within 48 hours of delivery with photographs of the issue. We will arrange a replacement or full refund at no additional cost to you.' },
      { heading: '3. How to Initiate a Return', body: 'Email us at returns@vaidyavatika.com with your Order ID, product name, reason for return, and photographs if applicable. Our team will review your request within 24 hours and provide a Return Merchandise Authorization (RMA) number.' },
      { heading: '4. Return Shipping', body: 'For defective or incorrect products, we will arrange free pickup. For other eligible returns, the customer is responsible for return shipping costs. We recommend using a tracked courier service as we cannot be responsible for lost return shipments.' },
      { heading: '5. Refund Processing', body: 'Once we receive and inspect the returned product, we will notify you of refund approval. Approved refunds are processed within 5–7 business days. The amount will be credited to your original payment method or as store credit, as per your preference.' },
      { heading: '6. Non-Returnable Items', body: 'The following items cannot be returned: opened or used products, products damaged due to improper use or storage, products without original packaging, items purchased during clearance sales, and free gifts or samples.' },
      { heading: '7. Order Cancellation', body: 'You may cancel an order within 2 hours of placing it, provided it has not been dispatched. After dispatch, cancellations are not possible, but you may initiate a return upon delivery. Cancellation requests must be made via email or the My Orders page.' },
      { heading: '8. Contact for Returns', body: 'For all return and refund queries, contact our support team at returns@vaidyavatika.com or call +91 98765 43210 during business hours (Mon–Sat, 9AM–7PM IST). We are committed to resolving all issues within 48 hours.' },
    ]
  }
}

export default function LegalPage() {
  const { page } = useParams()
  const content = CONTENT[page]

  if (!content) return (
    <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ fontSize: 64 }}>📄</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--bark)', margin: '16px 0 8px' }}>Page not found</h2>
      <Link to="/" style={{ color: 'var(--forest)', fontWeight: 600 }}>← Go Home</Link>
    </div>
  )

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--bark), #5c3410)', padding: '48px 0 40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{content.icon}</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#fff', marginBottom: 10 }}>{content.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>Last updated: {content.updated}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 800 }}>

        {/* Quick Nav */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {[['terms', '📄 Terms'], ['privacy', '🔒 Privacy'], ['refund', '↩️ Refund Policy']].map(([slug, label]) => (
            <Link key={slug} to={`/legal/${slug}`} style={{ padding: '9px 20px', borderRadius: 50, fontWeight: 600, fontSize: 13, border: '2px solid', borderColor: page === slug ? 'var(--forest)' : 'rgba(45,80,22,0.15)', background: page === slug ? 'var(--forest)' : '#fff', color: page === slug ? '#fff' : 'var(--text-mid)', transition: 'all 0.2s' }}>{label}</Link>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '40px 44px', boxShadow: '0 4px 24px rgba(45,80,22,0.08)' }}>
          <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: 36, paddingBottom: 28, borderBottom: '2px solid rgba(45,80,22,0.08)' }}>
            Please read these {content.title.toLowerCase()} carefully before using Vaidya Vatika's website or purchasing our products. By using our services, you agree to be bound by these terms.
          </p>

          {content.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--forest)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(45,80,22,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--forest)', flexShrink: 0 }}>{i + 1}</span>
                {section.heading.replace(/^\d+\.\s/, '')}
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.9, paddingLeft: 38 }}>{section.body}</p>
            </div>
          ))}

          {/* Contact Box */}
          <div style={{ background: 'rgba(45,80,22,0.05)', borderRadius: 16, padding: '24px', marginTop: 36, border: '1px solid rgba(45,80,22,0.1)' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--forest)', marginBottom: 10 }}>📬 Questions About This Policy?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 16 }}>If you have any questions or concerns about these policies, please don't hesitate to reach out to us.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/contact" style={{ background: 'var(--forest)', color: '#fff', padding: '11px 24px', borderRadius: 50, fontWeight: 700, fontSize: 13, display: 'inline-block' }}>Contact Us</Link>
              <a href="mailto:legal@vaidyavatika.com" style={{ background: '#fff', color: 'var(--forest)', padding: '11px 24px', borderRadius: 50, fontWeight: 700, fontSize: 13, border: '2px solid rgba(45,80,22,0.2)', display: 'inline-block' }}>legal@vaidyavatika.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
