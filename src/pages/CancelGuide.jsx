import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Search, 
  Sparkles, 
  ChevronRight, 
  Globe, 
  Settings, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import ProGate from '../components/ProGate'

const POPULAR_SERVICES = [
  'Netflix', 'Spotify', 'Adobe CC', 'Amazon Prime', 
  'YouTube Premium', 'Hotstar', 'Notion', 'GitHub Pro', 
  'Canva Pro', 'Grammarly'
]

export default function CancelGuide({ userPlan }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [guide, setGuide] = useState(null)

  const isPro = userPlan === 'pro'

  async function generateGuide(serviceName) {
    const name = serviceName || query
    if (!name) return

    setLoading(true)
    setGuide(null)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/Generate-Cancel-guide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ service_name: name })
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)
      setGuide(result)
    } catch (error) {
      console.error('Error generating guide:', error)
      toast.error('Failed to generate guide. Try once more.')
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#E8E8F0', marginBottom: '12px' }}>
          AI Cancellation Guide
        </h1>
        <p style={{ color: '#9999BB', fontSize: '16px' }}>
          Stop wasting time on hold. Tell us what you want to cancel, and our AI will give you the fastest path.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <div style={{
          background: '#1A1A2A',
          border: '1px solid #2A2A3E',
          borderRadius: '20px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <div style={{ paddingLeft: '16px', color: '#666680' }}>
            <Search size={22} />
          </div>
          <input 
            type="text"
            placeholder="Search for a service... (e.g. Netflix)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateGuide()}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              padding: '12px 0'
            }}
          />
          <button 
            onClick={() => generateGuide()}
            disabled={loading || !query}
            style={{
              background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 24px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Generate
          </button>
        </div>
      </div>

      {/* Popular Chips */}
      {!guide && !loading && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
          {POPULAR_SERVICES.map(service => (
            <button 
              key={service}
              onClick={() => {
                setQuery(service)
                generateGuide(service)
              }}
              style={{
                background: 'rgba(108, 99, 255, 0.05)',
                border: '1px solid #2A2A3E',
                borderRadius: '100px',
                padding: '8px 18px',
                color: '#9999BB',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6C63FF'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A3E'
                e.currentTarget.style.color = '#9999BB'
              }}
            >
              {service}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#1A1A2A',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #2A2A3E',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}>
              <div style={{ height: '24px', width: '30%', background: '#2A2A3E', borderRadius: '6px', marginBottom: '12px' }} />
              <div style={{ height: '16px', width: '100%', background: '#2A2A3E', borderRadius: '4px' }} />
            </div>
          ))}
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}</style>
        </div>
      )}

      {/* Guide Result */}
      {guide && (
        <div style={{ 
          background: '#13131F', 
          borderRadius: '24px', 
          border: '1px solid #1E1E2E',
          overflow: 'hidden',
          boxShadow: '0 20px 80px rgba(0,0,0,0.4)',
          position: 'relative'
        }}>
          {/* Header Section */}
          <div style={{ 
            padding: '32px', 
            borderBottom: '1px solid #1E1E2E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, rgba(108, 99, 255, 0.05), transparent)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img 
                src={`https://logo.clearbit.com/${guide.service_name.toLowerCase().replace(' ', '')}.com`}
                alt={guide.service_name}
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${guide.service_name}&background=13131F&color=6C63FF`}
                style={{ width: '48px', height: '48px', borderRadius: '12px' }}
              />
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>{guide.service_name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    padding: '2px 8px', 
                    borderRadius: '6px',
                    background: guide.difficulty === 'hard' ? 'rgba(255, 99, 99, 0.1)' : 'rgba(76, 255, 143, 0.1)',
                    color: guide.difficulty === 'hard' ? '#FF6363' : '#4CFF8F',
                    textTransform: 'uppercase'
                  }}>
                    {guide.difficulty} Difficulty
                  </span>
                  <span style={{ color: '#666680', fontSize: '12px' }}>⏱ {guide.estimated_time}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setGuide(null)}
              style={{ background: 'none', border: 'none', color: '#666680', cursor: 'pointer' }}
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            {/* Steps */}
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#E8E8F0', marginBottom: '24px' }}>Cancellation Steps</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {guide.steps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '800',
                      zIndex: 2
                    }}>
                      {idx + 1}
                    </div>
                    {idx !== guide.steps.length - 1 && (
                      <div style={{ 
                        width: '2px', 
                        flex: 1, 
                        borderLeft: '2px dashed #1E1E2E',
                        margin: '8px 0'
                      }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: idx === guide.steps.length - 1 ? 0 : '32px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {step.type === 'website' ? '🌐' : step.type === 'settings' ? '⚙️' : step.type === 'phone' ? '📞' : '⚠️'}
                      </span>
                      <div>
                        <p style={{ color: '#E8E8F0', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{step.instruction}</p>
                        {step.link && <a href={step.link} target="_blank" rel="noreferrer" style={{ color: '#6C63FF', fontSize: '13px', textDecoration: 'none', display: 'block', marginTop: '4px' }}>Open link →</a>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Notes */}
            {guide.important_notes && (
              <div style={{ 
                marginTop: '32px', 
                padding: '20px', 
                background: 'rgba(255, 215, 0, 0.05)', 
                border: '1px solid rgba(255, 215, 0, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                gap: '12px'
              }}>
                <AlertTriangle size={20} style={{ color: '#FFD700', flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#FFD700', fontSize: '13px', fontWeight: '700', margin: '0 0 4px 0' }}>Important Notes</p>
                  <p style={{ color: '#A8A8C0', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{guide.important_notes}</p>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div style={{ 
              marginTop: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: '32px',
              borderTop: '1px solid #1E1E2E'
            }}>
              <div>
                <p style={{ fontSize: '12px', color: '#666680', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '8px' }}>Customer Service</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E8E8F0', fontSize: '14px' }}>
                    <Phone size={14} /> {guide.contact_info?.phone || 'Not available'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E8E8F0', fontSize: '14px' }}>
                    <Globe size={14} /> {guide.contact_info?.website || 'Visit Site'}
                  </div>
                </div>
              </div>
              <button style={{
                background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={18} />
                Mark as Cancelled
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return isPro ? content : <ProGate featureName="AI Cancellation Guides">{content}</ProGate>
}
