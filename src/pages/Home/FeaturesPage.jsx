import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3, Zap, Bell, ScanText, Shield, DollarSign,
  ArrowRight, Check
} from 'lucide-react'
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter'

const FEATURES = [
  {
    id: 'dashboard',
    icon: BarChart3,
    color: '#6C63FF',
    glow: 'rgba(108,99,255,0.15)',
    tag: 'Core',
    title: 'Smart Dashboard',
    headline: 'Everything at a glance',
    desc: 'Your personal financial command center. See all subscriptions, spending totals, and renewal timelines in one beautiful view.',
    bullets: [
      'Monthly & yearly spend overview',
      'Interactive spending trend charts',
      'Category breakdown with pie chart',
      'Upcoming renewals countdown',
    ],
    preview: [
      { label: 'Monthly Total', value: '₹11,990', sub: '↑ 3% from last month', color: '#6C63FF' },
      { label: 'Active Subs', value: '14', sub: '2 renewing soon', color: '#3ECFCF' },
      { label: 'Yearly Estimate', value: '₹1.43L', sub: 'Save ₹47K with Pro', color: '#4CFF8F' },
    ]
  },
  {
    id: 'ai',
    icon: Zap,
    color: '#3ECFCF',
    glow: 'rgba(62,207,207,0.15)',
    tag: 'Pro',
    title: 'AI Spending Insights',
    headline: 'Let AI find your waste',
    desc: 'Our GPT-4o-powered engine analyzes your portfolio to find hidden inefficiencies — overlapping services, unused apps, and downgrade opportunities.',
    bullets: [
      'Detects overlapping streaming services',
      'Flags unused or rarely-needed apps',
      'Suggests cheaper plan alternatives',
      'Calculates exact monthly savings',
    ],
    preview: [
      { label: 'Overlap Found', value: 'Netflix + YT', sub: 'Same category — save ₹189', color: '#FFD700' },
      { label: 'Downgrade', value: 'Adobe CC', sub: 'Photography plan saves ₹2,490', color: '#3ECFCF' },
      { label: 'Total Savings', value: '₹3,900/mo', sub: 'Potential monthly savings', color: '#4CFF8F' },
    ]
  },
  {
    id: 'alerts',
    icon: Bell,
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.15)',
    tag: 'Core',
    title: 'Renewal Alerts',
    headline: 'Never get surprised again',
    desc: 'Get notified before any subscription charges you. Set your preferred alert window and snooze or cancel with one click.',
    bullets: [
      'Configurable advance alerts (1–14 days)',
      'Snooze alerts until a later date',
      'See AI-generated cancellation guide',
      'Email & in-app notifications',
    ],
    preview: [
      { label: 'Next Alert', value: 'Netflix', sub: 'Renews in 4 days · ₹649', color: '#FF6363' },
      { label: 'This week', value: '3 renewals', sub: 'Total: ₹4,204', color: '#FFD700' },
      { label: 'Saved', value: '₹4,490', sub: 'Cancelled Adobe before charge', color: '#4CFF8F' },
    ]
  },
  {
    id: 'scanner',
    icon: ScanText,
    color: '#4CFF8F',
    glow: 'rgba(76,255,143,0.15)',
    tag: 'Pro',
    title: 'AI Email Scanner',
    headline: 'Paste. Scan. Done.',
    desc: 'Paste any bank statement, email receipt, or transaction history and our AI will extract every subscription in seconds.',
    bullets: [
      'Detects any subscription charge text',
      'Extracts name, amount, and billing cycle',
      'One-click add to your tracker',
      'Works with any bank or email format',
    ],
    preview: [
      { label: 'Scanned', value: '6 found', sub: 'In 2.3 seconds', color: '#4CFF8F' },
      { label: 'New', value: 'Hotstar ₹299', sub: 'Previously untracked', color: '#3ECFCF' },
      { label: 'Saved', value: '₹2,010/mo', sub: 'By cancelling 2 duplicates', color: '#6C63FF' },
    ]
  },
  {
    id: 'security',
    icon: Shield,
    color: '#FF6363',
    glow: 'rgba(255,99,99,0.15)',
    tag: 'Core',
    title: 'Secure & Private',
    headline: 'Your data stays yours',
    desc: 'Built on Supabase with Row-Level Security. Every piece of your data is encrypted and can only ever be accessed by you.',
    bullets: [
      'Row-Level Security (RLS) on all tables',
      'SSL/TLS encryption in transit',
      'No data sold to third parties',
      'GDPR compliant by design',
    ],
    preview: [
      { label: 'Encryption', value: 'AES-256', sub: 'All data at rest', color: '#4CFF8F' },
      { label: 'Auth', value: 'JWT + OAuth', sub: 'Google + Email', color: '#3ECFCF' },
      { label: 'Uptime', value: '99.9%', sub: 'Supabase infrastructure', color: '#6C63FF' },
    ]
  },
  {
    id: 'savings',
    icon: DollarSign,
    color: '#FF63B3',
    glow: 'rgba(255,99,179,0.15)',
    tag: 'Pro',
    title: 'Real Savings',
    headline: 'Turn insights into cash',
    desc: 'Our Pro users find an average of ₹3,900/month in wasted subscriptions within the first week. The product pays for itself in hours.',
    bullets: [
      'Average ₹3,900/month found per user',
      'ROI positive within first week',
      'Track historical savings over time',
      'Share reports with family members',
    ],
    preview: [
      { label: 'Avg Save', value: '₹3,900/mo', sub: 'Per Pro user', color: '#4CFF8F' },
      { label: 'ROI', value: '1859%', sub: 'vs ₹49/mo Pro cost', color: '#FF63B3' },
      { label: 'Year 1', value: '₹46,800', sub: 'Avg annual savings', color: '#FFD700' },
    ]
  },
]

function FeatureCard({ feature, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`feat-tab ${isActive ? 'feat-tab-active' : ''}`}
      style={isActive ? { borderColor: feature.color, background: `${feature.color}10` } : {}}
    >
      <div className="feat-tab-icon" style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}28` }}>
        <feature.icon size={18} style={{ color: feature.color }} />
      </div>
      <span className="feat-tab-name">{feature.title}</span>
      {feature.tag === 'Pro' && (
        <span className="feat-pro-badge">Pro</span>
      )}
    </button>
  )
}

function StatPreview({ preview }) {
  return (
    <div className="feat-preview-grid">
      {preview.map(p => (
        <div key={p.label} className="feat-preview-card">
          <div className="feat-preview-label">{p.label}</div>
          <div className="feat-preview-value" style={{ color: p.color }}>{p.value}</div>
          <div className="feat-preview-sub">{p.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default function FeaturesPage() {
  const [active, setActive] = useState(0)
  const f = FEATURES[active]

  return (
    <div className="landing-page" style={{ background: '#080810' }}>
      {/* BG */}
      <div className="hero-bg" style={{ position: 'fixed', zIndex: 0 }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="grid-overlay" />
      </div>

      <LandingNav activePath="/features" />

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '5rem 5vw 3rem' }}>
        <div className="section-badge" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>All Features</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 1rem', letterSpacing: '-0.025em', color: '#E8E8F0', lineHeight: 1.1 }}>
          Built to save you<br /><span className="text-gradient">time and money</span>
        </h1>
        <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
          Every feature in SubTrackr is designed with one goal: help you spend less on subscriptions you don't need.
        </p>
      </div>

      {/* Feature Explorer */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 1100, margin: '0 auto', padding: '0 5vw 6rem' }}>
        {/* Tab row */}
        <div className="feat-tabs-row">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} feature={f} isActive={active === i} onClick={() => setActive(i)} />
          ))}
        </div>

        {/* Main feature panel */}
        <div className="feat-panel" key={active} style={{ borderColor: `${f.color}30`, boxShadow: `0 0 60px ${f.glow}` }}>
          <div className="feat-panel-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={26} style={{ color: f.color }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: f.color, marginBottom: 2 }}>{f.tag} Feature</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#E8E8F0' }}>{f.title}</div>
              </div>
            </div>
            <h2 className="feat-panel-headline">{f.headline}</h2>
            <p className="feat-panel-desc">{f.desc}</p>
            <ul className="feat-bullets">
              {f.bullets.map(b => (
                <li key={b} className="feat-bullet-item">
                  <span style={{ color: f.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <Link to="/register" className="hero-cta-primary" style={{ marginTop: '1.5rem', alignSelf: 'flex-start', textDecoration: 'none' }}>
              {f.tag === 'Pro' ? 'Unlock with Pro' : 'Get Started Free'}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="feat-panel-right">
            <div style={{ marginBottom: '1rem', fontWeight: 600, fontSize: 13, color: '#666680', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Preview</div>
            <StatPreview preview={f.preview} />
            {/* Visual bar / chart placeholder */}
            <div className="feat-chart-bar">
              {[45, 70, 55, 85, 65, 90, 78].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0',
                  background: i === 6
                    ? `linear-gradient(to top, ${f.color}, ${f.color}88)`
                    : `${f.color}20`,
                  transition: 'height 0.4s ease',
                }} />
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#444460', marginTop: 6 }}>Monthly trend visualization</div>
          </div>
        </div>

        {/* Next/Prev navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button
            onClick={() => setActive(a => Math.max(0, a - 1))}
            disabled={active === 0}
            className="feat-nav-btn"
          >
            ← Previous
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {FEATURES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: active === i ? f.color : '#2A2A3E',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setActive(a => Math.min(FEATURES.length - 1, a + 1))}
            disabled={active === FEATURES.length - 1}
            className="feat-nav-btn"
          >
            Next →
          </button>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section" style={{ position: 'relative', zIndex: 5 }}>
        <div className="cta-orb-1" /><div className="cta-orb-2" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to take control?</h2>
          <p className="cta-sub">Join 50,000+ users who stopped overspending on subscriptions.</p>
          <Link to="/register" className="btn-primary cta-btn">Start Free — No Credit Card <ArrowRight size={18} /></Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
