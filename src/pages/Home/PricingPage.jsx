import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Check, ArrowRight, Zap, Shield, Star, ChevronDown } from 'lucide-react'

const FREE_FEATURES = [
  'Up to 5 subscriptions',
  'Dashboard & charts',
  'Renewal alerts (in-app)',
  'Category breakdown',
  'Manual entry',
]
const PRO_FEATURES = [
  'Unlimited subscriptions',
  'AI spending insights',
  'AI email scanner',
  'AI cancellation guides',
  'Advanced analytics',
  'Priority support',
  'Export to CSV',
]

const COMPARE_ROWS = [
  { feature: 'Subscriptions tracked', free: '5', pro: 'Unlimited' },
  { feature: 'Dashboard & charts', free: true, pro: true },
  { feature: 'Renewal alerts', free: true, pro: true },
  { feature: 'Category breakdown', free: true, pro: true },
  { feature: 'AI spending insights', free: false, pro: true },
  { feature: 'AI email scanner', free: false, pro: true },
  { feature: 'AI cancellation guides', free: false, pro: true },
  { feature: 'Advanced analytics', free: false, pro: true },
  { feature: 'Export to CSV', free: false, pro: true },
  { feature: 'Priority support', free: false, pro: true },
]

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Freelance Designer', text: 'Found 3 subscriptions I forgot about. Saved ₹3,900 in the first week.', stars: 5 },
  { name: 'Marcus T.', role: 'Software Engineer', text: 'The AI scanner is unreal. Pasted my bank statement and it found everything.', stars: 5 },
  { name: 'Priya M.', role: 'Marketing Manager', text: 'Worth every penny. The ROI is insane — ₹199/month to save ₹5,000+.', stars: 5 },
]

function CheckIcon({ value, isProCol }) {
  if (typeof value === 'boolean') {
    return value
      ? <span style={{ color: isProCol ? '#4CFF8F' : '#6C63FF', fontSize: 18, fontWeight: 700 }}>✓</span>
      : <span style={{ color: '#2A2A3E', fontSize: 18 }}>—</span>
  }
  return <span style={{ color: isProCol ? '#4CFF8F' : '#9999BB', fontWeight: 600, fontSize: 13 }}>{value}</span>
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const proPrice = annual ? '166' : '199'
  const proSavings = annual ? 'Save ₹396/year' : null

  return (
    <div className="landing-page">
      <div className="hero-bg" style={{ position: 'fixed', zIndex: 0 }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="grid-overlay" />
      </div>

      {/* Nav */}
      <nav className="landing-nav" style={{ position: 'relative', zIndex: 10 }}>
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon"><TrendingUp size={18} color="#fff" /></div>
          <span>SubTrackr</span>
        </Link>
        <div className="nav-links">
          <Link to="/features" style={{ color: '#9999BB', textDecoration: 'none' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: '#9999BB', textDecoration: 'none' }}>How it works</Link>
          <Link to="/pricing" style={{ color: '#E8E8F0', textDecoration: 'none', fontWeight: 600 }}>Pricing</Link>
          <Link to="/about" style={{ color: '#9999BB', textDecoration: 'none' }}>About</Link>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-signin">Sign in</Link>
          <Link to="/register" className="nav-cta">Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '5rem 5vw 3rem' }}>
        <div className="section-badge" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>Pricing</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 1rem', letterSpacing: '-0.025em', color: '#E8E8F0', lineHeight: 1.1 }}>
          Simple pricing.<br /><span className="text-gradient">Big savings.</span>
        </h1>
        <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75 }}>
          Start free. Upgrade when you're ready. Our Pro plan pays for itself — usually within the first day.
        </p>

        {/* Annual toggle */}
        <div className="pricing-toggle">
          <span style={{ color: !annual ? '#E8E8F0' : '#666680', fontWeight: 500 }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="toggle-switch"
            style={{ background: annual ? '#6C63FF' : '#1E1E2E' }}
          >
            <span className="toggle-thumb" style={{ left: annual ? 26 : 2 }} />
          </button>
          <span style={{ color: annual ? '#E8E8F0' : '#666680', fontWeight: 500 }}>Annual</span>
          {annual && <span style={{
            background: 'rgba(76,255,143,0.1)', border: '1px solid rgba(76,255,143,0.3)',
            color: '#4CFF8F', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
          }}>Save 17%</span>}
        </div>
      </div>

      {/* Plans */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 800, margin: '0 auto', padding: '0 5vw 4rem' }}>
        <div className="pricing-grid" style={{ maxWidth: '100%' }}>
          {/* Free plan */}
          <div className="pricing-card">
            <div className="pricing-name">Free</div>
            <div className="pricing-price">₹0<span className="pricing-period">/month</span></div>
            <p style={{ color: '#666680', fontSize: 13, marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Perfect for getting started and tracking a handful of subscriptions.
            </p>
            <ul className="pricing-features">
              {FREE_FEATURES.map(f => (
                <li key={f} className="pricing-feature-item">
                  <Check size={14} style={{ color: '#6C63FF', flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-secondary pricing-btn" style={{ textDecoration: 'none' }}>Get Started Free</Link>
          </div>

          {/* Pro plan */}
          <div className="pricing-card pricing-card-pro" style={{ position: 'relative' }}>
            <div className="pricing-popular">Most Popular</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div className="pricing-name" style={{ margin: 0 }}>Pro</div>
              <Zap size={16} style={{ color: '#6C63FF' }} />
            </div>
            <div className="pricing-price">
              ₹{proPrice}<span className="pricing-period">/month</span>
              {proSavings && <span style={{ fontSize: 11, color: '#4CFF8F', marginLeft: 8, fontWeight: 600 }}>{proSavings}</span>}
            </div>
            <p style={{ color: '#9999BB', fontSize: 13, marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Everything in Free, plus AI-powered features that pay for themselves.
            </p>
            <ul className="pricing-features">
              {PRO_FEATURES.map(f => (
                <li key={f} className="pricing-feature-item">
                  <Check size={14} style={{ color: '#4CFF8F', flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary pricing-btn" style={{ textDecoration: 'none' }}>
              <Zap size={16} /> Start Pro
            </Link>
            <p style={{ textAlign: 'center', color: '#444460', fontSize: 11, marginTop: 10 }}>
              Cancel anytime. No lock-in.
            </p>
          </div>
        </div>

        {/* ROI card */}
        <div style={{
          marginTop: '1.5rem', padding: '1.25rem 1.5rem',
          background: 'rgba(76,255,143,0.05)', border: '1px solid rgba(76,255,143,0.2)',
          borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 28, }}>💡</div>
          <div>
            <div style={{ fontWeight: 700, color: '#E8E8F0', fontSize: 15 }}>The average user saves ₹3,900/month</div>
            <div style={{ color: '#9999BB', fontSize: 13, marginTop: 2 }}>
              That's a <span style={{ color: '#4CFF8F', fontWeight: 700 }}>1859% ROI</span> on Pro — paid back in hours, not months.
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 750, margin: '0 auto', padding: '0 5vw 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">Full feature comparison</h2>
        </div>
        <div style={{
          background: 'rgba(15,15,26,0.7)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, overflow: 'hidden', backdropFilter: 'blur(20px)',
        }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '14px 20px', background: 'rgba(108,99,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#666680', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Feature</div>
            <div style={{ color: '#9999BB', fontSize: 12, fontWeight: 600, textAlign: 'center' }}>Free</div>
            <div style={{ color: '#6C63FF', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>Pro ⚡</div>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
              padding: '13px 20px',
              borderBottom: i < COMPARE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
            }}>
              <div style={{ color: '#E8E8F0', fontSize: 13 }}>{row.feature}</div>
              <div style={{ textAlign: 'center' }}><CheckIcon value={row.free} isProCol={false} /></div>
              <div style={{ textAlign: 'center' }}><CheckIcon value={row.pro} isProCol={true} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 900, margin: '0 auto 6rem', padding: '0 5vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">What our users say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: 'rgba(15,15,26,0.7)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18, padding: '1.5rem', backdropFilter: 'blur(20px)',
            }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: '0.75rem' }}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                ))}
              </div>
              <p style={{ color: '#9999BB', fontSize: 13, lineHeight: 1.7, marginBottom: '1rem' }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, color: '#E8E8F0', fontSize: 13 }}>{t.name}</div>
              <div style={{ color: '#444460', fontSize: 11 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 640, margin: '0 auto', padding: '0 5vw 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">Frequently asked</h2>
        </div>
        {[
          { q: 'Is the free plan really free?', a: 'Yes. The free plan is free forever. Track up to 5 subscriptions with no credit card required.' },
          { q: 'Can I cancel Pro at any time?', a: 'Yes. Cancel anytime from your settings page. You\'ll keep Pro features until the end of your billing period.' },
          { q: 'How does the AI work?', a: 'We use OpenAI\'s GPT-4o models to analyze your subscriptions and detect patterns, overlaps, and savings opportunities.' },
          { q: 'Is my financial data safe?', a: 'Absolutely. We never store bank credentials. You only paste text — no direct bank connections. Data is encrypted with RLS.' },
          { q: 'What if I have more than 5 subscriptions?', a: 'Upgrade to Pro for unlimited subscriptions. At ₹199/month, you only need to find one forgotten subscription to break even.' },
        ].map((faq, i) => <PricingFaq key={i} faq={faq} />)}
      </div>

      {/* CTA */}
      <section className="cta-section" style={{ position: 'relative', zIndex: 5 }}>
        <div className="cta-orb-1" /><div className="cta-orb-2" />
        <div className="cta-content">
          <h2 className="cta-title">Start saving today</h2>
          <p className="cta-sub">Free plan, no credit card. Upgrade when you're ready.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary cta-btn">Start Free <ArrowRight size={18} /></Link>
            <Link to="/features" className="hero-cta-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>See all features</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer" style={{ position: 'relative', zIndex: 5 }}>
        <div className="footer-logo">
          <div className="nav-logo-icon"><TrendingUp size={16} color="#fff" /></div>
          <span>SubTrackr</span>
        </div>
        <div className="footer-links">
          <Link to="/" style={{ color: '#666680', textDecoration: 'none', fontSize: '0.85rem' }}>Home</Link>
          <Link to="/features" style={{ color: '#666680', textDecoration: 'none', fontSize: '0.85rem' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: '#666680', textDecoration: 'none', fontSize: '0.85rem' }}>How it works</Link>
        </div>
      </footer>
    </div>
  )
}

function PricingFaq({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginBottom: 10,
      background: 'rgba(15,15,26,0.6)', overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
          color: '#E8E8F0', fontWeight: 600, fontSize: 15, gap: 12, textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        {faq.q}
        <ChevronDown size={18} style={{ color: '#666680', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      {open && <div style={{ padding: '0 20px 16px', color: '#9999BB', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>}
    </div>
  )
}
