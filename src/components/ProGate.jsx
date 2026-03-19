import React from 'react'
import { Lock, Sparkles, ChevronRight } from 'lucide-react'
import { redirectToCheckout } from '../lib/razorpay'

export default function ProGate({ featureName, children }) {
  const [upgrading, setUpgrading] = React.useState(false)

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      await redirectToCheckout()
    } finally {
      setUpgrading(false)
    }
  }

  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '400px',
    borderRadius: '24px',
    overflow: 'hidden',
  }

  const blurredContentStyle = {
    filter: 'blur(8px)',
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.4,
  }

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 10, 15, 0.4)',
    zIndex: 10,
    padding: '24px',
  }

  const cardStyle = {
    background: '#1A1A2A',
    border: '1px solid transparent',
    borderRadius: '24px',
    padding: '40px 32px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
    backgroundImage: 'linear-gradient(#1A1A2A, #1A1A2A), linear-gradient(135deg, #6C63FF, #3ECFCF)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    animation: 'shimmer 2s infinite linear',
  }

  const iconContainerStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'rgba(108, 99, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    color: '#6C63FF',
  }

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(62, 207, 207, 0.2))',
    border: '1px solid rgba(108, 99, 255, 0.3)',
    borderRadius: '100px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#3ECFCF',
    letterSpacing: '0.05em',
    marginBottom: '16px',
    textTransform: 'uppercase',
  }

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '800',
    color: '#E8E8F0',
    marginBottom: '12px',
  }

  const descStyle = {
    fontSize: '15px',
    color: '#9999BB',
    lineHeight: '1.6',
    marginBottom: '32px',
  }

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'transform 0.2s',
    boxShadow: '0 8px 24px rgba(108, 99, 255, 0.3)',
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.9; }
          50% { opacity: 1; }
          100% { opacity: 0.9; }
        }
      `}</style>
      <div style={blurredContentStyle}>
        {children}
      </div>
      <div style={overlayStyle}>
        <div style={cardStyle}>
          <div style={iconContainerStyle}>
            <Lock size={32} />
          </div>
          <div style={badgeStyle}>
            <Sparkles size={14} />
            PRO FEATURE
          </div>
          <h2 style={titleStyle}>{featureName}</h2>
          <p style={descStyle}>
            This premium feature is only available to Pro members. Upgrade now to unlock AI-powered insights and smarter subscription management.
          </p>
          <button 
            style={{ 
                ...buttonStyle, 
                opacity: upgrading ? 0.7 : 1, 
                cursor: upgrading ? 'not-allowed' : 'pointer' 
              }}
            onClick={handleUpgrade}
            disabled={upgrading}
            onMouseEnter={(e) => !upgrading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !upgrading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {upgrading ? 'Connecting...' : 'Upgrade to Pro'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
