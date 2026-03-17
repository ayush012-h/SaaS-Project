import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, Mail, Lock, Eye, EyeOff, Chrome, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const FLOATING_CARDS = [
  { name: 'Netflix', amount: '15.99', color: '#E50914', savings: null, top: '12%', left: '6%', delay: '0s' },
  { name: 'Spotify', amount: '9.99', color: '#1DB954', savings: 'Save $10', top: '70%', left: '4%', delay: '0.6s' },
  { name: 'Adobe CC', amount: '54.99', color: '#FF0000', savings: '⚠️ Overlap', top: '38%', left: '2%', delay: '1.2s' },
  { name: 'ChatGPT', amount: '20.00', color: '#10A37F', savings: null, top: '18%', right: '5%', delay: '0.3s' },
  { name: 'GitHub', amount: '4.00', color: '#6C63FF', savings: null, top: '60%', right: '4%', delay: '0.9s' },
  { name: 'Notion', amount: '8.00', color: '#000', savings: '💡 Downgrade', top: '82%', right: '6%', delay: '1.5s' },
]

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [focusedField, setFocusedField] = useState(null)

  function handleCardMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    setTilt({ x, y })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error(err.message || 'Google login failed')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-orb-1" />
        <div className="login-orb-2" />
        <div className="login-orb-3" />
        <div className="login-grid" />
        {/* Floating particle dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="login-particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
          }} />
        ))}
        </div>

      {/* Floating subscription cards (background) */}
      {FLOATING_CARDS.map((card, i) => (
        <div key={i} className="login-floating-card" style={{
          top: card.top,
          left: card.left,
          right: card.right,
          animationDelay: card.delay,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {card.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#E8E8F0', whiteSpace: 'nowrap' }}>{card.name}</div>
              <div style={{ fontSize: 10, color: '#666680' }}>${card.amount}/mo</div>
            </div>
            {card.savings && (
              <div style={{ fontSize: 9, color: '#4CFF8F', marginLeft: 6, whiteSpace: 'nowrap', fontWeight: 600 }}>
                {card.savings}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Central login card */}
      <div className="login-container">
        {/* Logo */}
        <Link to="/" className="login-logo-link">
          <div className="login-logo">
            <TrendingUp size={20} color="#fff" />
          </div>
          <span className="login-logo-text">SubTrackr</span>
        </Link>

        <div
          ref={cardRef}
          className="login-card"
          onMouseMove={handleCardMouseMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          style={{
            transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transition: 'transform 0.15s ease',
          }}
        >
          {/* Shimmer top border */}
          <div className="login-card-shimmer" />

          {/* Sparkle icon */}
          <div className="login-header-icon">
            <Sparkles size={16} className="sparkle-anim" style={{ color: '#6C63FF' }} />
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="google-btn"
          >
            {googleLoading ? (
              <span className="btn-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className={`field-group ${focusedField === 'email' ? 'field-focused' : ''}`}>
              <label className="field-label">Email</label>
              <div className="field-wrapper">
                <Mail size={15} className="field-icon" />
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <div className="field-glow" />
              </div>
            </div>

            {/* Password */}
            <div className={`field-group ${focusedField === 'password' ? 'field-focused' : ''}`}>
              <label className="field-label">Password</label>
              <div className="field-wrapper">
                <Lock size={15} className="field-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="field-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <button type="button" className="field-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <div className="field-glow" />
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
              <div className="btn-shine" />
            </button>
          </form>

          <p className="login-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="login-link">Create one free</Link>
          </p>
        </div>

        {/* Trust signals */}
        <div className="login-trust">
          <span>🔒 Secure</span>
          <span>·</span>
          <span>⚡ Instant setup</span>
          <span>·</span>
          <span>🆓 Free forever</span>
        </div>
      </div>
    </div>
  )
}
