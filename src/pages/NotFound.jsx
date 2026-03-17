import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = '404 — SubTrackr'
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#E8E8F0',
      fontFamily: 'Inter, system-ui, sans-serif',
      textAlign: 'center',
      padding: 24,
    }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>💳</div>
      <h1 style={{
        fontSize: 96,
        fontWeight: 900,
        background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 8px',
        lineHeight: 1,
      }}>404</h1>
      <h2 style={{ margin: '16px 0 12px', fontSize: 22, fontWeight: 700, color: '#E8E8F0' }}>
        Page not found
      </h2>
      <p style={{ color: '#666680', marginBottom: 36, fontSize: 15, maxWidth: 320 }}>
        Looks like this subscription got cancelled. The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '13px 28px',
          background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
          border: 'none',
          borderRadius: 12,
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.target.style.opacity = '0.85'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        Back to Home →
      </button>
    </div>
  )
}
