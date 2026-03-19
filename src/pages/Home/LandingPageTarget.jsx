import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  TrendingUp, BarChart3, Bell, Zap, Shield, ScanText,
  ArrowRight, ChevronDown, Star, DollarSign, Check
} from 'lucide-react'

const FEATURES = [
  { icon: BarChart3, title: 'Smart Dashboard', desc: 'Visualize all your subscriptions with beautiful charts and real-time spending insights.', color: '#6C63FF', glow: 'rgba(108,99,255,0.3)' },
  { icon: Zap, title: 'AI Spending Insights', desc: 'GPT-4o analyzes your subscriptions to find overlaps, unused services & downgrade opportunities.', color: '#3ECFCF', glow: 'rgba(62,207,207,0.3)' },
  { icon: Bell, title: 'Renewal Alerts', desc: 'Never get surprised by a charge again. Get notified days before any subscription renews.', color: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  { icon: ScanText, title: 'Email Scanner', desc: 'Paste your bank statement. Our AI extracts all subscriptions automatically in seconds.', color: '#4CFF8F', glow: 'rgba(76,255,143,0.3)' },
  { icon: Shield, title: 'Secure & Private', desc: 'Bank-level security with Supabase RLS. Your data is yours — never sold or shared.', color: '#FF6363', glow: 'rgba(255,99,99,0.3)' },
  { icon: DollarSign, title: 'Save Real Money', desc: 'Our users find an average of ₹3,900/month in forgotten or duplicate subscriptions.', color: '#FF63B3', glow: 'rgba(255,99,179,0.3)' },
]

const STATS = [
  { value: '₹3,900', label: 'avg. savings/month' },
  { value: '2M+', label: 'subscriptions tracked' },
  { value: '99.9%', label: 'uptime' },
  { value: '4.9★', label: 'user rating' },
]

const PRICING = [
  {
    name: 'Free', price: '₹0', period: '/month',
    features: ['Up to 5 subscriptions', 'Dashboard & charts', 'Renewal alerts', 'Basic analytics'],
    cta: 'Get Started Free', highlight: false,
  },
  {
    name: 'Pro', price: '₹199', period: '/month',
    features: ['Unlimited subscriptions', 'AI spending insights', 'Email scanner', 'Advanced analytics', 'Priority support', 'Cancellation guides'],
    cta: 'Start Pro', highlight: true,
  },
]

// Example subscriptions for the demo table
const DEMO_SUBS = [
  { name: 'Netflix', category: 'Streaming', amount: 649, cycle: 'Monthly', status: 'Active', statusColor: '#4CFF8F', dot: '#E50914', renewal: 'Mar 14' },
  { name: 'Spotify', category: 'Music', amount: 179, cycle: 'Monthly', status: 'Active', statusColor: '#4CFF8F', dot: '#1DB954', renewal: 'Mar 18' },
  { name: 'Adobe CC', category: 'Software', amount: 4490, cycle: 'Monthly', status: '⚠ Overlap', statusColor: '#FFD700', dot: '#FF0000', renewal: 'Mar 22' },
  { name: 'ChatGPT Plus', category: 'AI', amount: 1699, cycle: 'Monthly', status: 'Active', statusColor: '#4CFF8F', dot: '#10A37F', renewal: 'Mar 25' },
  { name: 'GitHub Pro', category: 'Dev Tools', amount: 336, cycle: 'Monthly', status: 'Active', statusColor: '#4CFF8F', dot: '#6C63FF', renewal: 'Apr 1' },
  { name: 'Notion', category: 'Productivity', amount: 660, cycle: 'Monthly', status: '💡 Downgrade', statusColor: '#3ECFCF', dot: '#ffffff', renewal: 'Apr 3' },
  { name: 'YouTube Premium', category: 'Streaming', amount: 189, cycle: 'Monthly', status: '⚠ Overlap', statusColor: '#FFD700', dot: '#FF0000', renewal: 'Apr 7' },
  { name: 'iCloud 200GB', category: 'Storage', amount: 75, cycle: 'Monthly', status: 'Active', statusColor: '#4CFF8F', dot: '#007AFF', renewal: 'Apr 10' },
]

// Mouse parallax hook
function useMouseParallax(sensitivity = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    function handle(e) {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 50 * sensitivity,
        y: (e.clientY / window.innerHeight - 0.5) * 50 * sensitivity
      })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [sensitivity])
  return pos
}

// Custom Cursor
function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    const handleOver = (e) => {
      if (e.target.tagName?.toLowerCase() === 'a' || e.target.tagName?.toLowerCase() === 'button' || e.target.closest('a') || e.target.closest('button')) {
        setHovered(true)
      } else {
        setHovered(false)
      }
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [])

  return (
    <div
      className="custom-cursor"
      style={{
        translate: `${pos.x - 10}px ${pos.y - 10}px`,
        scale: hovered ? 2 : 1,
        background: hovered ? 'rgba(108, 99, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)',
        borderColor: hovered ? 'rgba(108, 99, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
      }}
    />
  )
}

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function handleMouseMove(e) {
    if(!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18
    setTilt({ x, y })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      className={`feature-card ${hovered ? 'hovered' : ''}`}
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(${hovered ? -8 : 0}px)`,
        boxShadow: hovered ? `0 20px 60px ${feature.glow}` : '0 10px 30px rgba(0,0,0,0.2)',
        borderColor: hovered ? feature.color : 'rgba(255,255,255,0.05)',
        transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s ease, box-shadow 0.5s ease',
        animationDelay: `${index * 80}ms`
      }}
    >
      <div className="feature-shimmer" />
      <div className="feature-icon" style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}>
        <feature.icon size={22} style={{ color: feature.color }} />
      </div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-desc">{feature.desc}</p>
      <div className="feature-line" style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }} />
    </div>
  )
}

function DemoTable() {
  const [offset, setOffset] = useState(0)
  const animRef = useRef(null)
  const rowH = 52 // px per row
  const totalHeight = DEMO_SUBS.length * rowH

  useEffect(() => {
    let start = null
    const speed = 28 // px per second

    function step(ts) {
      if (start === null) start = ts
      const elapsed = (ts - start) / 1000
      setOffset((elapsed * speed) % totalHeight)
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [totalHeight])

  // Duplicate for seamless loop
  const rows = [...DEMO_SUBS, ...DEMO_SUBS]

  return (
    <div className="demo-table-wrapper cinematic-card">
      {/* Header */}
      <div className="demo-table-header">
        <span style={{ flex: 2 }}>Service</span>
        <span style={{ flex: 1.2 }}>Category</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Amount</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Renewal</span>
        <span style={{ flex: 1.3, textAlign: 'right' }}>Status</span>
      </div>
      {/* Scrolling rows */}
      <div className="demo-table-scroll-area">
        <div style={{ transform: `translateY(-${offset}px)`, willChange: 'transform' }}>
          {rows.map((sub, i) => (
            <div key={i} className="demo-table-row">
              <span style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: sub.dot === '#ffffff' ? 'rgba(255,255,255,0.08)' : `${sub.dot}22`,
                  border: `1px solid ${sub.dot}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: sub.dot === '#ffffff' ? '#E8E8F0' : sub.dot,
                  flexShrink: 0,
                }}>
                  {sub.name[0]}
                </span>
                <span style={{ fontWeight: 500, color: '#E8E8F0', fontSize: 13, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{sub.name}</span>
              </span>
              <span style={{ flex: 1.2, color: '#666680', fontSize: 12 }}>{sub.category}</span>
              <span style={{ flex: 1, textAlign: 'right', color: '#E8E8F0', fontWeight: 600, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
                ₹{sub.amount.toLocaleString('en-IN')}
              </span>
              <span style={{ flex: 1, textAlign: 'center', color: '#9999BB', fontSize: 12 }}>{sub.renewal}</span>
              <span style={{ flex: 1.3, textAlign: 'right' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 100,
                  background: `${sub.statusColor}14`,
                  border: `1px solid ${sub.statusColor}28`,
                  color: sub.statusColor, fontSize: 11, fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  {sub.status}
                </span>
              </span>
            </div>
          ))}
        </div>
        {/* Fade-out at bottom */}
        <div className="demo-table-fade" />
      </div>
      {/* Footer summary */}
      <div className="demo-table-footer">
        <span style={{ color: '#666680', fontSize: 12 }}>8 subscriptions tracked</span>
        <span style={{ color: '#E8E8F0', fontWeight: 700, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
          ₹8,277<span style={{ color: '#666680', fontWeight: 400, fontSize: 11 }}>/mo</span>
        </span>
        <span style={{ color: '#4CFF8F', fontSize: 12, fontWeight: 600 }}>💡 Save ₹2,300 with AI</span>
      </div>
    </div>
  )
}

function MagneticButton({ children, className, onClick, to, isLink, style: customStyle }) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if(!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPos({ x, y });
  };

  const reset = () => {
    setPos({ x: 0, y: 0 });
  };

  const style = {
    ...customStyle,
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: pos.x === 0 && pos.y === 0 ? 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)' : 'none'
  };

  if (isLink) {
    return (
      <Link ref={btnRef} to={to} className={`magnetic-btn-wrapper ${className}`} onMouseMove={handleMouseMove} onMouseLeave={reset} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={btnRef} className={`magnetic-btn-wrapper ${className}`} onMouseMove={handleMouseMove} onMouseLeave={reset} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

const driftCards = [...Array(8)].map(() => ({
  left: `${10 + Math.random() * 80}%`,
  width: `${140 + Math.random() * 80}px`,
  height: `${70 + Math.random() * 40}px`,
  animationDelay: `${Math.random() * -20}s`,
  animationDuration: `${20 + Math.random() * 10}s`
}));

export default function LandingPage() {
  const { session } = useAuth()
  const mousePos = useMouseParallax(0.5);


  useEffect(() => {
    // Reveal animation
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Cabinet+Grotesk:wght@100..900&family=JetBrains+Mono:wght@400;700&display=swap');

        :root {
          --color-deep-violet: #0D0015;
          --color-electric-indigo: #1A0040;
          --color-teal-black: #001A1A;
          --color-brand-primary: #6C63FF;
          --color-brand-secondary: #3ECFCF;
          --font-hero: 'Playfair Display', serif;
          --font-body: 'Cabinet Grotesk', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        body {
          margin: 0;
          background-color: var(--color-deep-violet);
          color: #E8E8F0;
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
          cursor: none; /* Hide default cursor */
        }
        
        a, button, input {
            cursor: none;
        }

        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          pointer-events: none;
          z-index: 9999;
          transform-origin: center;
          transition: scale 0.15s ease-out, background 0.15s ease, border-color 0.15s ease;
          mix-blend-mode: difference;
        }

        .landing-page {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Animated Deep Space / Aurora Borealis Background ── */
        .cinematic-bg {
          position: fixed;
          inset: 0;
          z-index: -2;
          background: var(--color-deep-violet);
          overflow: hidden;
        }

        .aurora-blob {
          position: absolute;
          filter: blur(140px);
          opacity: 0.6;
          mix-blend-mode: screen;
          border-radius: 50%;
          animation: breathe 20s ease-in-out infinite alternate;
          will-change: transform, opacity;
        }

        .aurora-1 {
          background: radial-gradient(circle, var(--color-electric-indigo) 0%, transparent 70%);
          width: 80vw;
          height: 80vh;
          top: -20%;
          left: -10%;
          animation-delay: 0s;
        }

        .aurora-2 {
          background: radial-gradient(circle, var(--color-teal-black) 0%, rgba(62,207,207,0.15) 50%, transparent 70%);
          width: 70vw;
          height: 70vh;
          bottom: -10%;
          right: -10%;
          animation-delay: -5s;
        }

        .aurora-3 {
          background: radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%);
          width: 60vw;
          height: 60vh;
          top: 30%;
          left: 30%;
          animation-delay: -10s;
        }

        @keyframes breathe {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.5; }
          100% { transform: scale(1.1) translate(40px, -40px); opacity: 0.8; }
        }

        /* Fine noise/grain overlay */
        .noise-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opactiy='0.08'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
        }

        /* Nav */
        .cinematic-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 5vw;
          background: rgba(10, 0, 30, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s ease;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.3rem;
          font-weight: 800;
          font-family: var(--font-body);
          color: #FFF;
          text-decoration: none;
          letter-spacing: -0.02em;
        }

        .nav-logo-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary));
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 15px rgba(108,99,255,0.4);
        }

        .nav-links { display: flex; gap: 2.5rem; }
        .nav-links a {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #FFF; }

        .nav-actions { display: flex; align-items: center; gap: 1.5rem; }
        .nav-signin { color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: color 0.2s; }
        .nav-signin:hover { color: #FFF; }

        .btn-glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #FFF;
          padding: 10px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .btn-glass:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* Hero */
        .cinematic-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 4rem 5vw;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-left {
          flex: 1.2;
          z-index: 10;
        }
        
        .hero-right {
          flex: 1;
          position: relative;
          z-index: 5;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .cinematic-title {
          font-family: var(--font-hero);
          font-size: clamp(3.5rem, 6vw, 6rem);
          line-height: 1.05;
          margin: 0 0 1.5rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          position: relative;
        }

        .title-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(108,99,255,0.3), transparent 60%);
          filter: blur(50px);
          z-index: -1;
        }

        .gradient-shimmer {
          background: linear-gradient(to right, #6C63FF, #3ECFCF, #FF63B3, #6C63FF);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 4s linear infinite;
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        .cinematic-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          max-width: 600px;
          margin-bottom: 3.5rem;
          font-weight: 400;
        }

        .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }

        .btn-primary-cinematic {
          background: linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary));
          color: #FFF;
          padding: 18px 36px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 1.05rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(108,99,255,0.4);
        }

        .btn-primary-cinematic::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }
        
        .btn-primary-cinematic::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 100px;
            box-shadow: 0 0 20px rgba(108,99,255,0) inset;
            transition: box-shadow 0.3s ease;
        }

        .btn-primary-cinematic:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(108,99,255,0.6);
        }

        .btn-primary-cinematic:hover::before { left: 150%; }
        .btn-primary-cinematic:hover::after { box-shadow: 0 0 20px rgba(255,255,255,0.2) inset; }

        /* Floating Cards Background */
        .drifting-cards {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }

        .drift-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 16px;
          backdrop-filter: blur(8px);
          animation: floatUp 25s linear infinite;
          opacity: 0;
        }

        @keyframes floatUp {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20vh) rotate(15deg); opacity: 0; }
        }

        /* Feature Cards Cinematic */
        .cinematic-section {
          padding: 10rem 5vw;
          position: relative;
          z-index: 10;
        }

        .section-header-cinematic {
          text-align: center;
          margin-bottom: 6rem;
        }

        .section-title-cinematic {
          font-family: var(--font-hero);
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 500;
          color: #FFF;
          margin: 0 0 1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(15, 15, 25, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 28px;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(24px);
          will-change: transform, box-shadow;
        }
        
        .feature-icon {
            width: 56px; height: 56px;
            border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 2rem;
            position: relative;
            z-index: 2;
        }
        
        .feature-title { font-size: 1.25rem; font-weight: 600; color: #E8E8F0; margin: 0 0 1rem; font-family: var(--font-body); position: relative; z-index: 2;}
        .feature-desc { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.7; margin: 0; position: relative; z-index: 2;}

        .feature-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.06), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }

        .feature-card.hovered .feature-shimmer {
          transform: translateX(100%);
        }

        /* Pricing Card Cinematic */
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .pricing-card {
            border-radius: 28px;
        }
        
        .pricing-card-pro-cinematic {
          position: relative;
          border-radius: 28px;
          background: rgba(15, 15, 25, 0.8);
          backdrop-filter: blur(24px);
        }

        .pricing-card-pro-cinematic::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 30px;
          background: conic-gradient(from 0deg, var(--color-brand-primary), var(--color-brand-secondary), var(--color-teal-black), var(--color-brand-primary));
          z-index: -1;
          animation: spin-conic 4s linear infinite;
        }
        
        @keyframes spin-conic {
          100% { transform: rotate(360deg); }
        }
        
        .pricing-inner {
          background: rgba(10, 10, 15, 0.95);
          border-radius: 28px;
          padding: 4rem 3rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .pricing-price-cinematic {
          font-family: var(--font-mono);
          font-size: 4rem;
          font-weight: 700;
          color: #FFF;
          margin: 1.5rem 0;
        }
        
        .pricing-features {
            list-style: none; padding: 0; margin: 0 0 2.5rem; flex: 1;
        }

        /* Reveal animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.5, 0, 0, 1), transform 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Magnetic button wrapper */
        .magnetic-btn-wrapper {
          display: inline-block;
          text-decoration: none;
        }

        /* Demo Table adjustments for cinematic look */
        .cinematic-card {
          background: rgba(15, 15, 25, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(30px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.08);
        }

        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
      
      <CustomCursor />

      {/* Cinematic Background Elements */}
      <div className="cinematic-bg">
        <div className="noise-overlay" />
        <div className="aurora-blob aurora-1" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }} />
        <div className="aurora-blob aurora-2" style={{ transform: `translate(${-mousePos.x * 0.3}px, ${-mousePos.y * 0.3}px)` }} />
        <div className="aurora-blob aurora-3" style={{ transform: `translate(${mousePos.x * 0.2}px, ${-mousePos.y * 0.4}px)` }} />
      </div>

      {/* Drifting Cards in Background */}
      <div className="drifting-cards">
        {driftCards.map((style, i) => (
          <div key={i} className="drift-card" style={style} />
        ))}
      </div>

      <div className="landing-page">
        {/* Nav */}
        <nav className="cinematic-nav">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon"><TrendingUp size={18} color="#fff" /></div>
            <span>SubTrackr</span>
          </Link>
          <div className="nav-links">
            <Link to="#features">Features</Link>
            <Link to="#how-it-works">How it works</Link>
            <Link to="#pricing">Pricing</Link>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-signin">Sign in</Link>
            <MagneticButton isLink={true} to="/register" className="btn-glass">
              Get Started Free
            </MagneticButton>
          </div>
        </nav>

        {/* Hero */}
        <section className="cinematic-hero">
          <div className="hero-left">
            <div className="hero-badge reveal active">
              <Star size={14} fill="#FFD700" color="#FFD700" />
              <span>Trusted by 50,000+ users worldwide</span>
            </div>
            
            <h1 className="cinematic-title reveal active" style={{ transitionDelay: '0.1s' }}>
              <div className="title-glow" />
              Stop leaking money on<br />
              <span className="gradient-shimmer">forgotten subscriptions.</span>
            </h1>
            
            <p className="cinematic-subtitle reveal active" style={{ transitionDelay: '0.2s' }}>
              SubTrackr tracks every subscription, detects hidden charges, and helps you save an average of <strong style={{ color: '#4CFF8F' }}>₹3,900/month</strong> with AI-powered insights.
            </p>
            
            <div className="hero-actions reveal active" style={{ transitionDelay: '0.3s' }}>
              <MagneticButton isLink={true} to={session ? '/dashboard' : '/register'} className="btn-primary-cinematic">
                {session ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight size={18} />
              </MagneticButton>
            </div>
          </div>
          
          <div className="hero-right reveal active" style={{ transitionDelay: '0.4s' }}>
            <DemoTable />
          </div>
        </section>

        {/* ══════════ STATS ══════════ */}
        <section className="cinematic-section" style={{ padding: '6rem 5vw', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="stat-item reveal active" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="stat-value gradient-shimmer" style={{ fontFamily: 'var(--font-mono)', fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1 }}>{s.value}</div>
                <div className="stat-label" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.9rem', marginTop: '12px', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ FEATURES ══════════ */}
        <section className="cinematic-section" id="features">
          <div className="section-header-cinematic reveal active">
            <h2 className="cinematic-title" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}>
              Everything you need to<br /><span className="gradient-shimmer">take control.</span>
            </h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
          </div>
        </section>

        {/* ══════════ PRICING ══════════ */}
        <section className="cinematic-section" id="pricing">
          <div className="section-header-cinematic reveal active">
            <h2 className="cinematic-title" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}>
              Simple, transparent<br /><span className="gradient-shimmer">pricing.</span>
            </h2>
          </div>
          <div className="pricing-grid">
            {PRICING.map((plan, i) => (
              <div key={plan.name} className={`reveal active ${plan.highlight ? 'pricing-card-pro-cinematic' : ''}`} style={{ transitionDelay: `${i * 0.2}s` }}>
                <div className={plan.highlight ? 'pricing-inner' : 'pricing-card cinematic-card'} style={plan.highlight ? {} : { height: '100%', padding: '4rem 3rem', display: 'flex', flexDirection: 'column' }}>
                  {plan.highlight && <div className="pricing-popular" style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', fontSize: '0.8rem', fontWeight: 700, padding: '8px 20px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Most Popular</div>}
                  <div className="pricing-name" style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{plan.name}</div>
                  <div className="pricing-price-cinematic">{plan.price}<span className="pricing-period" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{plan.period}</span></div>
                  <ul className="pricing-features">
                    {plan.features.map(f => (
                      <li key={f} className="pricing-feature-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 0', fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Check size={18} style={{ color: plan.highlight ? '#4CFF8F' : '#6C63FF', flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <MagneticButton isLink={true} to="/register" className={plan.highlight ? 'btn-primary-cinematic' : 'btn-glass'} style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                    {plan.cta}
                  </MagneticButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section className="cinematic-section" style={{ textAlign: 'center', padding: '12rem 5vw', overflow: 'hidden' }}>
          <div className="title-glow" style={{ opacity: 0.6 }} />
          <div className="reveal active">
            <h2 className="cinematic-title" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>Ready to stop overspending?</h2>
            <p className="cinematic-subtitle" style={{ margin: '0 auto 4rem', fontSize: '1.3rem' }}>Join 50,000+ people who saved money with SubTrackr.</p>
            <MagneticButton isLink={true} to="/register" className="btn-primary-cinematic">
              Start for Free — No Credit Card <ArrowRight size={18} />
            </MagneticButton>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)', padding: '2.5rem 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="nav-logo-icon" style={{ width: 28, height: 28 }}><TrendingUp size={14} color="#fff" /></div>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>SubTrackr</span>
          </div>
          <p className="footer-copy" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>© 2026 SubTrackr. All rights reserved.</p>
          <div className="footer-links" style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}>Privacy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}>Terms</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}>Contact</a>
          </div>
        </footer>
      </div>
    </>
  )
}
