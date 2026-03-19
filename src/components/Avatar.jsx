import { Loader2 } from 'lucide-react'

export default function Avatar({ 
  url, 
  name, 
  size = 40, 
  onClick, 
  loading = false,
  showOverlay = false,
  overlayIcon: Icon,
  overlayText = "Change"
}) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    flexShrink: 0,
    background: url ? 'none' : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
    border: '1px solid #1E1E2E'
  }

  return (
    <div style={containerStyle} onClick={onClick} className="avatar-container">
      {url ? (
        <img 
          src={url} 
          alt={name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        <span style={{ 
          fontSize: `${size / 2.77}px`, 
          fontWeight: '800', 
          color: 'white',
          userSelect: 'none'
        }}>
          {initials}
        </span>
      )}

      {/* Hover Overlay */}
      {showOverlay && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.2s', color: 'white'
        }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
           {loading ? (
             <Loader2 size={size / 4} className="animate-spin" />
           ) : (
             <>
               {Icon && <Icon size={size / 4} style={{ marginBottom: '4px' }} />}
               <span style={{ fontSize: '11px', fontWeight: '700' }}>{overlayText}</span>
             </>
           )}
        </div>
      )}

      {/* Loading Spinner for small avatars */}
      {loading && !showOverlay && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <Loader2 size={size / 3} className="animate-spin text-white opacity-80" />
        </div>
      )}
    </div>
  )
}
