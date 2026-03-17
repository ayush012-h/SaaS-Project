export default function BetaBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
      padding: '10px 24px',
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 600,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      position: 'relative',
      zIndex: 100,
    }}>
      🎉 SubTrackr is in Beta — All Pro features are FREE during launch.
      <span style={{ opacity: 0.8 }}>No credit card required.</span>
    </div>
  )
}
