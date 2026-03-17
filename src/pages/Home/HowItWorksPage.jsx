import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, UserPlus, LayoutDashboard, Zap, ArrowRight,
  Mail, MousePointer, Bell, PlusCircle, ChevronDown
} from 'lucide-react'

const STEPS = [
  {
    n: '01',
    icon: UserPlus,
    color: '#6C63FF',
    title: 'Create your account',
    subtitle: 'Free forever — no credit card needed',
    desc: 'Sign up with your email address or continue with Google in one click. Your account is ready instantly.',
    details: [
      { icon: Mail, text: 'Sign up via email or Google' },
      { icon: MousePointer, text: 'Instant access — no waiting' },
      { icon: UserPlus, text: 'Free plan available forever' },
    ],
    visual: {
      type: 'form',
      label: 'Create Account',
      fields: ['Email address', 'Password'],
      button: 'Start Free',
    }
  },
  {
    n: '02',
    icon: PlusCircle,
    color: '#3ECFCF',
    title: 'Add your subscriptions',
    subtitle: 'Manual or AI-powered — you choose',
    desc: 'Add subscriptions one by one, or paste your bank statement and let our AI detect and import everything automatically in seconds.',
    details: [
      { icon: PlusCircle, text: 'Add manually in seconds' },
      { icon: Mail, text: 'AI scan from bank statement text' },
      { icon: LayoutDashboard, text: 'Instantly appears in dashboard' },
    ],
    visual: {
      type: 'table',
      rows: [
        { name: 'Netflix', amount: '$15.99/mo', status: '✓ Added' },
        { name: 'Spotify', amount: '$9.99/mo', status: '✓ Added' },
        { name: 'Adobe CC', amount: '$54.99/mo', status: '⚡ Scanning...' },
      ]
    }
  },
  {
    n: '03',
    icon: Bell,
    color: '#FFD700',
    title: 'Get renewal alerts',
    subtitle: 'Never miss a renewal again',
    desc: 'Configure alerts for 1, 3, 7, or 14 days before each renewal. Snooze, cancel, or take action — all without leaving the app.',
    details: [
      { icon: Bell, text: 'Alerts sent days in advance' },
      { icon: MousePointer, text: 'Snooze or dismiss with one click' },
      { icon: Mail, text: 'Email notifications (coming soon)' },
    ],
    visual: {
      type: 'alerts',
      items: [
        { name: 'Netflix', days: '4 days', amount: '$15.99', urgency: 'high' },
        { name: 'Spotify', days: '9 days', amount: '$9.99', urgency: 'med' },
        { name: 'GitHub', days: '14 days', amount: '$4.00', urgency: 'low' },
      ]
    }
  },
  {
    n: '04',
    icon: Zap,
    color: '#4CFF8F',
    title: 'Unlock AI insights',
    subtitle: 'Let AI do the money-saving work',
    desc: 'Upgrade to Pro and our AI scans your entire subscription portfolio — finding overlaps, unused apps, and downgrade opportunities automatically.',
    details: [
      { icon: Zap, text: 'Powered by GPT-4o' },
      { icon: TrendingUp, text: 'Avg. $47/month found' },
      { icon: MousePointer, text: 'One-click action items' },
    ],
    visual: {
      type: 'insights',
      items: [
        { type: '⚠ Overlap', desc: 'Netflix + YouTube Premium', save: 'Save $13.99/mo' },
        { type: '💡 Downgrade', desc: 'Adobe CC → Photography', save: 'Save $30/mo' },
        { type: '🗑 Unused', desc: 'Dropbox — no logins in 60d', save: 'Save $9.99/mo' },
      ]
    }
  },
]

function StepVisual({ step }) {
  if (step.visual.type === 'form') {
    return (
      <div className="hiw-visual-card">
        <div className="hiw-visual-title">{step.visual.label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {step.visual.fields.map(f => (
            <div key={f} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '10px 14px', color: '#444460', fontSize: 13,
            }}>{f}</div>
          ))}
        </div>
        <div style={{
          marginTop: 14, padding: '11px', borderRadius: 10, textAlign: 'center',
          background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff',
          fontWeight: 600, fontSize: 14,
        }}>{step.visual.button} →</div>
        <div style={{ textAlign: 'center', color: '#444460', fontSize: 11, marginTop: 10 }}>
          Or continue with Google
        </div>
      </div>
    )
  }

  if (step.visual.type === 'table') {
    return (
      <div className="hiw-visual-card">
        <div className="hiw-visual-title">My Subscriptions</div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {step.visual.rows.map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '9px 12px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontWeight: 600, color: '#E8E8F0', fontSize: 13 }}>{r.name}</span>
              <span style={{ color: '#9999BB', fontSize: 12 }}>{r.amount}</span>
              <span style={{ color: r.status.includes('✓') ? '#4CFF8F' : '#3ECFCF', fontSize: 11, fontWeight: 600 }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (step.visual.type === 'alerts') {
    return (
      <div className="hiw-visual-card">
        <div className="hiw-visual-title">Upcoming Renewals</div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {step.visual.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 10,
              background: item.urgency === 'high' ? 'rgba(255,99,99,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${item.urgency === 'high' ? 'rgba(255,99,99,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontWeight: 600, color: '#E8E8F0', fontSize: 13 }}>{item.name}</span>
              <span style={{ color: item.urgency === 'high' ? '#FF6363' : '#FFD700', fontSize: 11, fontWeight: 600 }}>
                in {item.days}
              </span>
              <span style={{ color: '#9999BB', fontSize: 12 }}>{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (step.visual.type === 'insights') {
    return (
      <div className="hiw-visual-card">
        <div className="hiw-visual-title">AI Insights</div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {step.visual.items.map((item, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: 11, color: '#FFD700', fontWeight: 700, marginBottom: 3 }}>{item.type}</div>
              <div style={{ fontSize: 12, color: '#E8E8F0', marginBottom: 3 }}>{item.desc}</div>
              <div style={{ fontSize: 11, color: '#4CFF8F', fontWeight: 600 }}>{item.save}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0)
  const s = STEPS[activeStep]

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
          <Link to="/how-it-works" style={{ color: '#E8E8F0', textDecoration: 'none', fontWeight: 600 }}>How it works</Link>
          <Link to="/pricing" style={{ color: '#9999BB', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/about" style={{ color: '#9999BB', textDecoration: 'none' }}>About</Link>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-signin">Sign in</Link>
          <Link to="/register" className="nav-cta">Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '5rem 5vw 3rem' }}>
        <div className="section-badge" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>How It Works</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 1rem', letterSpacing: '-0.025em', color: '#E8E8F0', lineHeight: 1.1 }}>
          Up and running in<br /><span className="text-gradient">under 60 seconds</span>
        </h1>
        <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
          Four simple steps from signup to saving money. No complexity, no learning curve.
        </p>
      </div>

      {/* Steps progress */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 900, margin: '0 auto', padding: '0 5vw' }}>
        <div className="hiw-progress-bar">
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`hiw-step-btn ${activeStep === i ? 'hiw-step-btn-active' : ''} ${activeStep > i ? 'hiw-step-btn-done' : ''}`}
              style={activeStep === i ? { borderColor: step.color, color: step.color } : activeStep > i ? { borderColor: '#4CFF8F', color: '#4CFF8F' } : {}}
            >
              <span className="hiw-step-num">{activeStep > i ? '✓' : step.n}</span>
              <span className="hiw-step-label">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Connector line */}
        <div className="hiw-connector">
          <div className="hiw-connector-fill" style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%`, background: `linear-gradient(90deg, #6C63FF, ${s.color})` }} />
        </div>

        {/* Active step panel */}
        <div className="hiw-panel" key={activeStep} style={{ borderColor: `${s.color}25` }}>
          <div className="hiw-panel-left">
            <div className="hiw-step-number" style={{ color: s.color }}>{s.n}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${s.color}15`, border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <s.icon size={24} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{s.subtitle}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#E8E8F0' }}>{s.title}</div>
              </div>
            </div>
            <p style={{ color: '#9999BB', fontSize: '0.975rem', lineHeight: 1.75, margin: '0 0 1.5rem' }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {s.details.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9999BB', fontSize: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: `${s.color}12`, border: `1px solid ${s.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <d.icon size={15} style={{ color: s.color }} />
                  </div>
                  {d.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
              {activeStep < STEPS.length - 1 ? (
                <button onClick={() => setActiveStep(a => a + 1)} className="hero-cta-primary" style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }}>
                  Next step <ArrowRight size={16} />
                </button>
              ) : (
                <Link to="/register" className="hero-cta-primary" style={{ textDecoration: 'none' }}>
                  Start now <ArrowRight size={16} />
                </Link>
              )}
              {activeStep > 0 && (
                <button onClick={() => setActiveStep(a => a - 1)} className="hero-cta-secondary" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' }}>
                  ← Back
                </button>
              )}
            </div>
          </div>
          <div className="hiw-panel-right">
            <StepVisual step={s} />
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <section style={{ position: 'relative', zIndex: 5, maxWidth: 700, margin: '5rem auto', padding: '0 5vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-badge" style={{ display: 'inline-block', marginBottom: '1rem' }}>FAQ</div>
          <h2 className="section-title">Common questions</h2>
        </div>
        {[
          { q: 'Is my data safe?', a: 'Yes. We use Supabase with Row-Level Security — your data is visible only to you and is never sold or shared.' },
          { q: 'How does the AI scanner work?', a: 'Paste any text (bank statement, email receipts, transaction history) and our AI extracts all subscription charges automatically.' },
          { q: 'Can I cancel Pro anytime?', a: 'Absolutely. Cancel anytime from the settings page. Your data remains accessible on the free plan.' },
          { q: 'What counts as a subscription?', a: 'Anything that charges you on a recurring basis — apps, streaming, software, memberships, utilities.' },
        ].map((faq, i) => <FaqItem key={i} faq={faq} />)}
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ position: 'relative', zIndex: 5 }}>
        <div className="cta-orb-1" /><div className="cta-orb-2" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-sub">It takes less than 60 seconds. No credit card needed.</p>
          <Link to="/register" className="btn-primary cta-btn">Create Free Account <ArrowRight size={18} /></Link>
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
          <Link to="/pricing" style={{ color: '#666680', textDecoration: 'none', fontSize: '0.85rem' }}>Pricing</Link>
        </div>
      </footer>
    </div>
  )
}

function FaqItem({ faq }) {
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
      {open && (
        <div style={{ padding: '0 20px 16px', color: '#9999BB', fontSize: 14, lineHeight: 1.7 }}>
          {faq.a}
        </div>
      )}
    </div>
  )
}
