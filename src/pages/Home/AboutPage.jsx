import { Link } from 'react-router-dom'
import {
  TrendingUp, ArrowRight, Shield, Zap, Heart,
  BarChart3, Bell, ScanText, Globe, Lock, Star
} from 'lucide-react'

const TECH_STACK = [
  { name: 'React + Vite', desc: 'Lightning-fast frontend framework', color: '#3ECFCF', icon: '⚛️' },
  { name: 'Supabase', desc: 'Auth, database & edge functions', color: '#4CFF8F', icon: '🔥' },
  { name: 'OpenAI GPT-4o', desc: 'AI insights & email scanning', color: '#6C63FF', icon: '🤖' },
  { name: 'Stripe', desc: 'Secure subscription payments', color: '#FFD700', icon: '💳' },
  { name: 'TailwindCSS', desc: 'Utility-first styling system', color: '#3ECFCF', icon: '🎨' },
  { name: 'Vercel', desc: 'Global CDN deployment', color: '#E8E8F0', icon: '🚀' },
]

const VALUES = [
  {
    icon: Shield,
    color: '#4CFF8F',
    title: 'Privacy First',
    desc: 'Your financial data is yours alone. We use Row-Level Security, end-to-end encryption, and we never sell your data to anyone.',
  },
  {
    icon: Zap,
    color: '#6C63FF',
    title: 'AI That Works For You',
    desc: 'We use AI to surface what matters — not to upsell you. Every insight is designed to put money back in your pocket.',
  },
  {
    icon: Heart,
    color: '#FF63B3',
    title: 'Built With Purpose',
    desc: 'SubTrackr was built to solve a real problem. The average person wastes $348/year on unused subscriptions. We\'re here to change that.',
  },
  {
    icon: Globe,
    color: '#FFD700',
    title: 'Always Improving',
    desc: 'We ship updates weekly. Every feature is shaped by real user feedback. Your voice drives the roadmap.',
  },
]

const MILESTONES = [
  { year: '2024', event: 'SubTrackr founded to solve the "forgotten subscription" problem' },
  { year: 'Q1 2025', event: 'Launched with AI insights powered by GPT-4o-mini' },
  { year: 'Q2 2025', event: 'Added AI email scanner and cancellation guides' },
  { year: 'Q3 2025', event: '50,000+ active users and $2M+ in subscriptions tracked' },
  { year: 'Today', event: 'Continuing to save users money, one subscription at a time' },
]

export default function AboutPage() {
  return (
    <div className="landing-page">
      {/* Background */}
      <div className="hero-bg" style={{ position: 'fixed', zIndex: 0 }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* Nav */}
      <nav className="landing-nav" style={{ position: 'relative', zIndex: 10 }}>
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon"><TrendingUp size={18} color="#fff" /></div>
          <span>SubTrackr</span>
        </Link>
        <div className="nav-links">
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about" style={{ color: '#E8E8F0', fontWeight: 600 }}>About</Link>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-signin">Sign in</Link>
          <Link to="/register" className="nav-cta">Start Free</Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '5rem 5vw 3rem' }}>
        <div className="section-badge" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>About SubTrackr</div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 700,
          margin: '0 0 1.25rem', letterSpacing: '-0.025em',
          color: '#E8E8F0', lineHeight: 1.1,
        }}>
          We help people stop paying<br />
          <span className="text-gradient">for things they forgot about</span>
        </h1>
        <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          SubTrackr is an AI-powered subscription tracker that helps you find, manage, and eliminate wasteful recurring charges — saving you real money every month.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="hero-cta-primary">Get Started Free <ArrowRight size={16} /></Link>
          <Link to="/features" className="hero-cta-secondary">See Features</Link>
        </div>
      </div>

      {/* ══ STAT BAR ══ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 900, margin: '0 auto', padding: '0 5vw 5rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px', background: 'rgba(255,255,255,0.06)',
          borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {[
            { value: '$47', label: 'Avg. savings per user / month' },
            { value: '50K+', label: 'Active users worldwide' },
            { value: '$2M+', label: 'Subscriptions tracked' },
            { value: '99.9%', label: 'Platform uptime' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '2rem 1.5rem', textAlign: 'center',
              background: 'rgba(15,15,26,0.8)',
            }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {s.value}
              </div>
              <div style={{ color: '#666680', fontSize: '0.8rem', marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ OUR STORY ══ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 860, margin: '0 auto', padding: '0 5vw 6rem' }}>
        <div style={{
          background: 'rgba(15,15,26,0.7)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24, padding: '3rem', backdropFilter: 'blur(20px)',
        }}>
          <div className="section-badge" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>Our Story</div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#E8E8F0', margin: '0 0 1.5rem', lineHeight: 1.2 }}>
            Born from a $340 mistake
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              'It started with a credit card statement. The founder noticed 6 subscriptions they had completely forgotten about — a VPN, two streaming services, a design tool, and a SaaS trial that auto-renewed. Total: $340 wasted in 3 months.',
              'The natural reaction was frustration. Not at the companies charging them, but at themselves for not tracking it. And then a question: how many other people have this exact problem?',
              'Turns out, a lot. The average American spends $219/month on subscriptions but underestimates their spending by 2.5x. Subscriptions are deliberately designed to be easy to sign up for and hard to notice.',
              'SubTrackr was built to flip that equation. With AI-powered detection, smart alerts, and spending analysis, we make it effortless to see exactly where your money goes — and take back control.',
            ].map((p, i) => (
              <p key={i} style={{ color: '#9999BB', fontSize: '0.975rem', lineHeight: 1.8, margin: 0 }}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MISSION ══ */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '0 5vw 6rem' }}>
        <div className="section-badge" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>Our Mission</div>
        <h2 className="section-title">
          Give everyone the power to<br />
          <span className="text-gradient">make smarter financial decisions</span>
        </h2>
        <p style={{ color: '#9999BB', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
          We believe financial clarity shouldn't require a finance degree. SubTrackr makes it simple, visual, and even a little satisfying to manage your recurring expenses.
        </p>
      </div>

      {/* ══ VALUES ══ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 1000, margin: '0 auto', padding: '0 5vw 6rem' }}>
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-badge">Values</div>
          <h2 className="section-title">What we stand for</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{
              background: 'rgba(15,15,26,0.7)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '1.75rem', backdropFilter: 'blur(20px)',
              transition: 'border-color 0.2s',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: '1rem',
                background: `${v.color}15`, border: `1px solid ${v.color}2A`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <v.icon size={22} style={{ color: v.color }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#E8E8F0', margin: '0 0 0.6rem' }}>{v.title}</h3>
              <p style={{ color: '#9999BB', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ TIMELINE ══ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 700, margin: '0 auto', padding: '0 5vw 6rem' }}>
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-badge">Journey</div>
          <h2 className="section-title">Our timeline</h2>
        </div>
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 7, top: 8, bottom: 8,
            width: 2, background: 'linear-gradient(to bottom, #6C63FF, #3ECFCF, transparent)',
            borderRadius: 2,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -33, top: 4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: i === MILESTONES.length - 1
                    ? 'linear-gradient(135deg, #6C63FF, #3ECFCF)'
                    : 'rgba(108,99,255,0.3)',
                  border: '2px solid #6C63FF',
                  boxShadow: i === MILESTONES.length - 1 ? '0 0 12px rgba(108,99,255,0.6)' : 'none',
                }} />
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: '#6C63FF', marginBottom: 4,
                  }}>{m.year}</div>
                  <p style={{ color: '#9999BB', fontSize: '0.95rem', margin: 0, lineHeight: 1.65 }}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TECH STACK ══ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 1000, margin: '0 auto', padding: '0 5vw 6rem' }}>
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-badge">Built With</div>
          <h2 className="section-title">World-class technology<br /><span className="text-gradient">under the hood</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {TECH_STACK.map((t) => (
            <div key={t.name} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'rgba(15,15,26,0.7)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '1.25rem', backdropFilter: 'blur(20px)',
            }}>
              <span style={{ fontSize: 28 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: '#E8E8F0', fontSize: 14, marginBottom: 3 }}>{t.name}</div>
                <div style={{ color: '#666680', fontSize: 12, lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SECURITY ══ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 860, margin: '0 auto', padding: '0 5vw 6rem' }}>
        <div style={{
          background: 'rgba(76,255,143,0.04)', border: '1px solid rgba(76,255,143,0.15)',
          borderRadius: 24, padding: '2.5rem', backdropFilter: 'blur(20px)',
          display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
              background: 'rgba(76,255,143,0.12)', border: '2px solid rgba(76,255,143,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={36} style={{ color: '#4CFF8F' }} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E8E8F0' }}>Security Promise</div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#E8E8F0', margin: '0 0 0.75rem' }}>
              Your data is always yours
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Row-Level Security (RLS) on all database tables',
                'AES-256 encryption for all data at rest',
                'SSL/TLS for all data in transit',
                'No data ever sold or shared with third parties',
                'GDPR-compliant data handling and user rights',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9999BB', fontSize: 14 }}>
                  <span style={{ color: '#4CFF8F', fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ══ CTA ══ */}
      <section className="cta-section" style={{ position: 'relative', zIndex: 5 }}>
        <div className="cta-orb-1" /><div className="cta-orb-2" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to take control?</h2>
          <p className="cta-sub">Join 50,000+ users who stopped losing money to forgotten subscriptions.</p>
          <Link to="/register" className="btn-primary cta-btn">
            Start Free — No Credit Card <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" style={{ position: 'relative', zIndex: 5 }}>
        <div className="footer-logo">
          <div className="nav-logo-icon"><TrendingUp size={16} color="#fff" /></div>
          <span>SubTrackr</span>
        </div>
        <p className="footer-copy">© 2025 SubTrackr. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/features" style={{ color: '#666680', textDecoration: 'none', fontSize: '0.85rem' }}>Features</Link>
          <Link to="/pricing" style={{ color: '#666680', textDecoration: 'none', fontSize: '0.85rem' }}>Pricing</Link>
          <Link to="/about" style={{ color: '#666680', textDecoration: 'none', fontSize: '0.85rem' }}>About</Link>
        </div>
      </footer>
    </div>
  )
}
