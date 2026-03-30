import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProGate from '../components/ProGate'
import toast from 'react-hot-toast'

const POPULAR_SERVICES = [
  'Netflix', 'Spotify', 'Adobe CC', 'Amazon Prime',
  'YouTube Premium', 'Hotstar', 'Notion', 'GitHub Pro',
  'Canva Pro', 'Grammarly'
]

const STEP_ICONS = {
  website: '🌐',
  settings: '⚙️',
  customer_service: '📞',
  warning: '⚠️',
}

export default function CancelGuide({ userPlan }) {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [guide, setGuide] = useState(null)
  const [userSubs, setUserSubs] = useState([])

  useEffect(() => {
    fetchUserSubs()
  }, [])

  async function fetchUserSubs() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
    setUserSubs(data || [])
  }

  async function generateGuide(serviceName) {
    if (!serviceName.trim()) return
    setLoading(true)
    setGuide(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const matchedSub = userSubs.find(s =>
        s.name.toLowerCase().includes(serviceName.toLowerCase())
      )

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-cancel-guide`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_name: serviceName,
            renewal_date: matchedSub?.next_renewal_date || null,
          }),
        }
      )

      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setGuide({ ...data, matchedSub })
    } catch (err) {
      toast.error('Failed to generate guide. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function markCancelled() {
    if (!guide?.matchedSub) return
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', guide.matchedSub.id)
    if (!error) {
      toast.success(`${guide.service} marked as cancelled`)
      setGuide(null)
      setSearch('')
    }
  }

  const pageContent = (
    <div style={{ padding: '32px 36px', maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Cancellation Guides
        </h1>
        <p style={{ color: '#666680', margin: 0, fontSize: 14 }}>
          Step-by-step instructions to cancel any subscription in minutes
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{
          position: 'absolute', left: 16, top: '50%',
          transform: 'translateY(-50%)', fontSize: 16,
        }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generateGuide(search)}
          placeholder="Search a service to cancel... (e.g. Netflix)"
          style={{
            width: '100%',
            padding: '14px 16px 14px 46px',
            background: '#1A1A2A',
            border: '1px solid #2A2A3A',
            borderRadius: 12,
            color: '#E8E8F0',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = '#6C63FF'}
          onBlur={e => e.target.style.borderColor = '#2A2A3A'}
        />
        <button
          onClick={() => generateGuide(search)}
          style={{
            position: 'absolute', right: 8, top: '50%',
            transform: 'translateY(-50%)',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
            border: 'none', borderRadius: 8,
            color: '#fff', fontWeight: 700, fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Generate →
        </button>
      </div>

      {/* Popular chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {POPULAR_SERVICES.map(service => (
          <button
            key={service}
            onClick={() => { setSearch(service); generateGuide(service) }}
            style={{
              padding: '6px 14px',
              background: '#1A1A2A',
              border: '1px solid #2A2A3A',
              borderRadius: 20,
              color: '#A0A0B8',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#6C63FF'
              e.currentTarget.style.color = '#A89CFF'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2A2A3A'
              e.currentTarget.style.color = '#A0A0B8'
            }}
          >
            {service}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{
          background: '#0F0F1A',
          border: '1px solid #1E1E2E',
          borderRadius: 16,
          padding: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1A1A2A', animation: 'pulse 1.5s infinite' }} />
            <div>
              <div style={{ width: 120, height: 16, background: '#1A1A2A', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
              <div style={{ width: 80, height: 12, background: '#1A1A2A', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
            </div>
          </div>
          {[1,2,3].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A1A2A', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, background: '#1A1A2A', borderRadius: 6, marginBottom: 6, animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: 12, width: '60%', background: '#1A1A2A', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
              </div>
            </div>
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      )}

      {/* Guide card */}
      {guide && !loading && (
        <div style={{
          background: '#0F0F1A',
          border: '1px solid #1E1E2E',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {/* Guide header */}
          <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid #1E1E2E',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <img
              src={`https://logo.clearbit.com/${guide.service?.toLowerCase().replace(' ', '')}.com`}
              alt={guide.service}
              style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>
                How to Cancel {guide.service}
              </h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{
                  padding: '2px 10px', borderRadius: 20,
                  background: guide.difficulty === 'easy' ? '#4CFF8F22' : guide.difficulty === 'hard' ? '#FF636322' : '#FFD70022',
                  color: guide.difficulty === 'easy' ? '#4CFF8F' : guide.difficulty === 'hard' ? '#FF6363' : '#FFD700',
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                }}>
                  {guide.difficulty}
                </span>
                <span style={{ fontSize: 12, color: '#666680' }}>
                  ⏱ {guide.estimated_time}
                </span>
              </div>
            </div>
          </div>

          {/* Renewal warning */}
          {guide.matchedSub?.next_renewal_date && (
            <div style={{
              margin: '20px 28px 0',
              padding: '12px 16px',
              background: '#FFD70011',
              border: '1px solid #FFD70033',
              borderRadius: 10,
              fontSize: 13,
              color: '#FFD700',
              fontWeight: 600,
            }}>
              ⚠️ Cancel before {guide.matchedSub.next_renewal_date} to avoid being charged ₹{guide.matchedSub.amount}
            </div>
          )}

          {/* Steps */}
          <div style={{ padding: '24px 28px' }}>
            {guide.steps?.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24, position: 'relative' }}>
                {/* Connector line */}
                {i < guide.steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: 15,
                    top: 36,
                    width: 2,
                    height: 'calc(100% + 8px)',
                    background: 'repeating-linear-gradient(to bottom, #6C63FF 0, #6C63FF 4px, transparent 4px, transparent 8px)',
                  }} />
                )}
                {/* Step number */}
                <div style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: step.type === 'warning'
                    ? '#FFD70022'
                    : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#fff',
                  flexShrink: 0,
                  border: step.type === 'warning' ? '1px solid #FFD70044' : 'none',
                  zIndex: 1,
                }}>
                  {step.type === 'warning' ? '⚠️' : step.number}
                </div>
                {/* Step content */}
                <div style={{
                  flex: 1,
                  background: step.type === 'warning' ? '#FFD70008' : 'transparent',
                  borderRadius: step.type === 'warning' ? 10 : 0,
                  padding: step.type === 'warning' ? '10px 14px' : '4px 0',
                  border: step.type === 'warning' ? '1px solid #FFD70022' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{STEP_ICONS[step.type] || '▸'}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.5, color: '#E8E8F0' }}>
                      {step.instruction}
                    </span>
                  </div>
                  {step.url && (
                    <a
                      href={step.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#6C63FF', textDecoration: 'none' }}
                    >
                      {step.url} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Warnings */}
          {guide.warnings?.length > 0 && (
            <div style={{
              margin: '0 28px 20px',
              padding: 16,
              background: '#1A1A2A',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Important Notes
              </div>
              {guide.warnings.map((w, i) => (
                <div key={i} style={{ fontSize: 13, color: '#A0A0B8', marginBottom: 4, paddingLeft: 12, borderLeft: '2px solid #6C63FF' }}>
                  {w}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{
            padding: '20px 28px',
            borderTop: '1px solid #1E1E2E',
            display: 'flex',
            gap: 12,
          }}>
            {guide.matchedSub && (
              <button
                onClick={markCancelled}
                style={{
                  padding: '11px 20px',
                  background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                  border: 'none', borderRadius: 10,
                  color: '#fff', fontWeight: 700,
                  fontSize: 13, cursor: 'pointer',
                }}
              >
                ✓ Mark as Cancelled
              </button>
            )}
            {guide.customer_service && (
              <div style={{
                padding: '11px 20px',
                background: '#1A1A2A',
                border: '1px solid #2A2A3A',
                borderRadius: 10,
                fontSize: 13,
                color: '#888',
              }}>
                📞 Customer Service: {guide.customer_service}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  if (userPlan !== 'pro') {
    return <ProGate featureName="Cancellation Guides">{pageContent}</ProGate>
  }

  return pageContent
}