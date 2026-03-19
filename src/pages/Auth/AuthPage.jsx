import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  TrendingUp, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, ArrowLeft, Sparkles, Sun, Moon, CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import toast from 'react-hot-toast'

/* ─── Rotating taglines ─── */
const QUOTES = [
  'Stop leaking money silently.',
  'Every rupee deserves a reason.',
  'Your subscriptions, finally under control.',
  'Clarity over every charge.',
]

/* ─── Social proof chips on the left panel ─── */
const CHIPS = [
  { emoji: '📊', text: 'Smart Dashboard' },
  { emoji: '🛎', text: 'Renewal Alerts' },
  { emoji: '🤖', text: 'AI Insights' },
  { emoji: '🔒', text: 'Bank-level Security' },
]

/* ─── Particle canvas ─── */
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const r = canvas.getBoundingClientRect()
    canvas.width = r.width * dpr
    canvas.height = r.height * dpr
    ctx.scale(dpr, dpr)
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * r.width, y: Math.random() * r.height,
      r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.4 + 0.1,
      vx: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.45 + 0.05,
    }))
    let id
    const tick = () => {
      ctx.clearRect(0, 0, r.width, r.height)
      pts.forEach(p => {
        p.y -= p.vy; p.x += p.vx
        if (p.y < -6) p.y = r.height + 6
        if (p.x < -6) p.x = r.width + 6
        if (p.x > r.width + 6) p.x = -6
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(108,99,255,${p.o})`
        ctx.fill()
      })
      id = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <canvas ref={ref} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 1,
    }} />
  )
}

/* ─── Input row ─── */
function AuthInput({ id, type, icon: Icon, label, value, onChange, showToggle, onToggle, error }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  return (
    <div style={{ position: 'relative' }}>
      {/* icon */}
      <div style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        color: error ? '#FF6363' : focused ? '#6C63FF' : '#666680',
        transition: 'color 0.25s', pointerEvents: 'none', zIndex: 2,
        display: 'flex', alignItems: 'center',
      }}>
        <Icon size={17} />
      </div>

      {/* floating label */}
      <label htmlFor={id} style={{
        position: 'absolute', left: 44, zIndex: 2, pointerEvents: 'none',
        top: active ? 7 : '50%',
        transform: active ? 'translateY(0) scale(0.78)' : 'translateY(-50%) scale(1)',
        transformOrigin: 'left top',
        fontSize: 14, fontWeight: 500,
        color: error ? '#FF6363' : focused ? '#6C63FF' : '#666680',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
      }}>{label}</label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        required
        autoComplete={id}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: error
            ? 'rgba(255,99,99,0.06)'
            : focused
            ? 'rgba(108,99,255,0.07)'
            : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${error ? '#FF6363' : focused ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 14,
          color: '#E8E8F0',
          fontSize: 15,
          fontFamily: 'inherit',
          padding: active ? '26px 44px 10px' : '18px 44px',
          outline: 'none',
          transition: 'all 0.22s ease',
        }}
      />

      {/* show/hide toggle */}
      {showToggle !== undefined && (
        <button type="button" onClick={onToggle} style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#666680', display: 'flex', padding: 4,
        }}>
          {showToggle ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}

      {/* focus glow underline */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2,
        borderRadius: 99,
        background: 'linear-gradient(90deg,#6C63FF,#3ECFCF)',
        opacity: focused ? 1 : 0,
        transition: 'opacity 0.25s',
      }} />
    </div>
  )
}

/* ─── Shared google SVG ─── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

/* ═══════════════════════════════════════ MAIN ═══════════════════════════════════════ */
export default function AuthPage({ initialMode = 'login' }) {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState(initialMode)
  const [quoteIdx, setQuoteIdx] = useState(0)

  // --- login ---
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginErr, setLoginErr] = useState(false)

  // --- register ---
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [showRegPass, setShowRegPass] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regErr, setRegErr] = useState(false)

  // --- google ---
  const [googleLoad, setGoogleLoad] = useState(false)

  const passStrength = Math.min(100, (regPass.length / 12) * 100)

  // Sync URL ↔ mode
  useEffect(() => {
    if (location.pathname === '/register' && mode === 'login') setMode('register')
    if (location.pathname === '/login' && mode === 'register') setMode('login')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  useEffect(() => {
    if (mode === 'login' && location.pathname !== '/login') navigate('/login', { replace: true })
    if (mode === 'register' && location.pathname !== '/register') navigate('/register', { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // Rotating quotes
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 4000)
    return () => clearInterval(t)
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoginLoading(true); setLoginErr(false)
    try {
      await signIn(loginEmail, loginPass)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed')
      setLoginErr(true)
      setTimeout(() => setLoginErr(false), 600)
    } finally { setLoginLoading(false) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (regPass.length < 6) {
      toast.error('Password must be at least 6 characters')
      setRegErr(true); setTimeout(() => setRegErr(false), 600)
      return
    }
    setRegLoading(true); setRegErr(false)
    try {
      await signUp(regEmail, regPass, regName)
      toast.success('Account created! Check your email to confirm.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
      setRegErr(true); setTimeout(() => setRegErr(false), 600)
    } finally { setRegLoading(false) }
  }

  async function handleGoogle() {
    setGoogleLoad(true)
    try { await signInWithGoogle() }
    catch (err) { toast.error(err.message || 'Google login failed'); setGoogleLoad(false) }
  }

  const isLogin = mode === 'login'
  const busy = loginLoading || regLoading || googleLoad

  /* ─── form variant animation ─── */
  const formVariants = {
    enter: dir => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: dir => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }
  const dir = isLogin ? -1 : 1

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #080810;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #E8E8F0;
        }

        .auth-root {
          display: flex;
          min-height: 100vh;
          background: #080810;
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-height: 100vh;
        }
        .auth-left-bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .auth-left-blob {
          position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.6;
          animation: breathe 18s ease-in-out infinite alternate;
        }
        @keyframes breathe {
          0% { transform: scale(1) translate(0,0); }
          100% { transform: scale(1.12) translate(30px,-30px); }
        }

        /* ── RIGHT PANEL ── */
        .auth-right {
          position: relative;
          width: min(520px, 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          background: rgba(10,10,20,0.85);
          border-left: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          min-height: 100vh;
          overflow: hidden;
        }

        .form-inner {
          width: 100%;
          max-width: 400px;
        }

        /* google btn */
        .google-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          color: #E8E8F0;
          font-family: inherit; font-size: 15px; font-weight: 600;
          padding: 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .google-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .google-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        /* divider */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-txt {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #444460;
        }

        /* submit */
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #6C63FF, #3ECFCF);
          color: #fff;
          border: none; font-family: inherit;
          font-size: 15px; font-weight: 700;
          padding: 16px;
          border-radius: 14px;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 8px;
          box-shadow: 0 6px 28px rgba(108,99,255,0.35);
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(108,99,255,0.5);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .submit-btn .shine {
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.28), transparent);
          transition: left 0.55s ease;
          transform: skewX(-18deg);
        }
        .submit-btn:hover .shine { left: 160%; }

        /* switch link */
        .switch-link {
          color: #6C63FF; font-weight: 700; cursor: pointer;
          text-decoration: none; transition: color 0.2s;
          margin-left: 4px; display: inline;
        }
        .switch-link:hover { color: #3ECFCF; }

        /* top chrome */
        .chrome-btn {
          position: fixed; z-index: 200;
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          color: rgba(255,255,255,0.65);
          font-family: inherit; font-size: 13px; font-weight: 600;
          padding: 9px 18px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          text-decoration: none;
          transition: all 0.2s;
        }
        .chrome-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
          transform: translateX(-3px);
        }
        .chrome-btn-right {
          transform: none !important;
          border-radius: 50%;
          padding: 10px;
        }
        .chrome-btn-right:hover { transform: rotate(15deg) !important; }

        /* strength */
        .strength-bar {
          height: 3px; border-radius: 99px;
          background: rgba(255,255,255,0.06);
          margin-top: 6px; overflow: hidden;
        }
        .strength-fill {
          height: 100%; border-radius: 99px;
          transition: width 0.3s ease, background 0.3s;
        }

        /* shake animation */
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.45s ease; }

        /* spinner */
        .spin { animation: spinA 0.75s linear infinite; }
        @keyframes spinA { to { transform: rotate(360deg); } }

        /* mobile */
        @media (max-width: 820px) {
          .auth-root { flex-direction: column; }
          .auth-left { min-height: 38vh; flex: none; }
          .auth-right {
            width: 100%; border-left: none; border-top: 1px solid rgba(255,255,255,0.06);
            padding: 36px 24px; min-height: auto;
          }
          .chrome-btn { top: 14px !important; left: 14px !important; }
          .chrome-btn-right { top: 14px !important; right: 14px !important; }
        }
      `}</style>

      {/* ── Fixed chrome ── */}
      <Link to="/" className="chrome-btn" style={{ top: 24, left: 32 }}>
        <ArrowLeft size={15} /> Back
      </Link>
      <button onClick={toggleTheme} className="chrome-btn chrome-btn-right" style={{ top: 24, right: 32 }}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="auth-root">

        {/* ════════ LEFT PANEL ════════ */}
        <div className="auth-left">
          {/* aurora bg */}
          <div className="auth-left-bg">
            <div className="auth-left-blob" style={{ width: '70vw', height: '70vh', top: '-15%', left: '-15%', background: 'radial-gradient(circle,rgba(108,99,255,0.3) 0%,transparent 70%)' }} />
            <div className="auth-left-blob" style={{ width: '60vw', height: '60vh', bottom: '-10%', right: '-10%', background: 'radial-gradient(circle,rgba(62,207,207,0.2) 0%,transparent 70%)', animationDelay: '-7s' }} />
            <div className="auth-left-blob" style={{ width: '40vw', height: '40vh', top: '40%', left: '30%', background: 'radial-gradient(circle,rgba(255,99,179,0.12) 0%,transparent 70%)', animationDelay: '-13s' }} />
          </div>

          <ParticleCanvas />

          {/* content */}
          <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg,#6C63FF,#3ECFCF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 60px rgba(108,99,255,0.5), 0 12px 40px rgba(108,99,255,0.4)',
              }}>
                <TrendingUp size={34} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>SubTrackr</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 500 }}>Subscription Manager</div>
              </div>
            </Link>

            {/* rotating quote */}
            <div style={{ height: 28, position: 'relative', width: '100%' }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute', left: 0, right: 0,
                    margin: 0, fontSize: 16, fontWeight: 400, fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {QUOTES[quoteIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* feature chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 320 }}>
              {CHIPS.map(c => (
                <div key={c.text} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100, padding: '7px 14px',
                  fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <span>{c.emoji}</span> {c.text}
                </div>
              ))}
            </div>

            {/* social proof */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(76,255,143,0.08)',
              border: '1px solid rgba(76,255,143,0.2)',
              borderRadius: 100, padding: '8px 18px',
            }}>
              <CheckCircle2 size={15} color="#4CFF8F" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4CFF8F' }}>
                50,000+ users saving on subscriptions
              </span>
            </div>
          </div>
        </div>

        {/* ════════ RIGHT PANEL ════════ */}
        <div className="auth-right">
          <div className="form-inner">

            {/* Mode toggle pill */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: 4, gap: 4, marginBottom: 32,
            }}>
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, border: 'none', borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                    padding: '11px 0',
                    background: mode === m
                      ? 'linear-gradient(135deg,#6C63FF,#3ECFCF)'
                      : 'transparent',
                    color: mode === m ? '#fff' : '#666680',
                    transition: 'all 0.25s',
                    boxShadow: mode === m ? '0 4px 16px rgba(108,99,255,0.35)' : 'none',
                  }}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* ── Animated form swap ── */}
            <AnimatePresence mode="wait" custom={dir}>
              {isLogin ? (
                <motion.div
                  key="login"
                  custom={dir}
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <Sparkles size={20} style={{ color: '#6C63FF' }} />
                      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#E8E8F0', letterSpacing: '-0.02em' }}>
                        Welcome back
                      </h1>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: '#666680', fontWeight: 500 }}>
                      Log in to your SubTrackr account
                    </p>
                  </div>

                  {/* Google */}
                  <button className="google-btn" onClick={handleGoogle} disabled={busy}>
                    {googleLoad
                      ? <div className="spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%' }} />
                      : <GoogleIcon />
                    }
                    Continue with Google
                  </button>

                  <div className="divider">
                    <div className="divider-line" />
                    <span className="divider-txt">or with email</span>
                    <div className="divider-line" />
                  </div>

                  <motion.form
                    onSubmit={handleLogin}
                    animate={loginErr ? { x: [0, -7, 7, -7, 7, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                  >
                    <AuthInput
                      id="loginEmail" type="email" icon={Mail} label="Email address"
                      value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                      error={loginErr}
                    />
                    <AuthInput
                      id="loginPassword" type={showLoginPass ? 'text' : 'password'} icon={Lock} label="Password"
                      value={loginPass} onChange={e => setLoginPass(e.target.value)}
                      showToggle={showLoginPass} onToggle={() => setShowLoginPass(!showLoginPass)}
                      error={loginErr}
                    />

                    <button type="submit" className="submit-btn" disabled={busy}>
                      <div className="shine" />
                      {loginLoading
                        ? <div className="spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                        : <><span>Sign In</span><ArrowRight size={17} /></>
                      }
                    </button>
                  </motion.form>

                  <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: '#666680' }}>
                    No account yet?
                    <span className="switch-link" onClick={() => setMode('register')}>Create one free</span>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  custom={dir}
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: 28 }}>
                    <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#E8E8F0', letterSpacing: '-0.02em' }}>
                      Create your account
                    </h1>
                    <p style={{ margin: 0, fontSize: 14, color: '#666680', fontWeight: 500 }}>
                      Start tracking subscriptions for free
                    </p>
                  </div>

                  {/* Google */}
                  <button className="google-btn" onClick={handleGoogle} disabled={busy}>
                    {googleLoad
                      ? <div className="spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%' }} />
                      : <GoogleIcon />
                    }
                    Sign up with Google
                  </button>

                  <div className="divider">
                    <div className="divider-line" />
                    <span className="divider-txt">or with email</span>
                    <div className="divider-line" />
                  </div>

                  <motion.form
                    onSubmit={handleRegister}
                    animate={regErr ? { x: [0, -7, 7, -7, 7, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                  >
                    <AuthInput
                      id="regName" type="text" icon={User} label="Full Name"
                      value={regName} onChange={e => setRegName(e.target.value)}
                      error={regErr}
                    />
                    <AuthInput
                      id="regEmail" type="email" icon={Mail} label="Email address"
                      value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      error={regErr}
                    />
                    <div>
                      <AuthInput
                        id="regPassword" type={showRegPass ? 'text' : 'password'} icon={Lock} label="Password (min. 6 chars)"
                        value={regPass} onChange={e => setRegPass(e.target.value)}
                        showToggle={showRegPass} onToggle={() => setShowRegPass(!showRegPass)}
                        error={regErr}
                      />
                      {regPass.length > 0 && (
                        <div className="strength-bar">
                          <div className="strength-fill" style={{
                            width: `${passStrength}%`,
                            background: passStrength < 33 ? '#FF6363' : passStrength < 66 ? '#FFD700' : '#4CFF8F',
                          }} />
                        </div>
                      )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={busy}>
                      <div className="shine" />
                      {regLoading
                        ? <div className="spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                        : <><span>Create Free Account</span><ArrowRight size={17} /></>
                      }
                    </button>
                  </motion.form>

                  <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: '#666680' }}>
                    Already have an account?
                    <span className="switch-link" onClick={() => setMode('login')}>Sign in</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* legal footer */}
            <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: '#444460', lineHeight: 1.6 }}>
              By continuing you agree to our{' '}
              <Link to="/terms" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 600 }}>Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
