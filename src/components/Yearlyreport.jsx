import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import ProGate from '../components/ProGate'
import toast from 'react-hot-toast'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function YearlyReport({ userPlan }) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [subscriptions, setSubscriptions] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiSavings, setAiSavings] = useState(null)
  const reportRef = useRef(null)

  useEffect(() => { fetchSubs() }, [])

  async function fetchSubs() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
    setSubscriptions(data || [])
  }

  function generateReport() {
    setLoading(true)
    setAiSavings(null)

    setTimeout(() => {
      const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'cancelled')

      // Total spend
      const totalSpend = activeSubs.reduce((sum, s) => sum + (parseFloat(s.amount) * 12), 0)

      // Most expensive
      const sorted = [...activeSubs].sort((a, b) => b.amount - a.amount)
      const mostExpensive = sorted[0]

      // By category
      const byCategory = {}
      activeSubs.forEach(s => {
        byCategory[s.category || 'Other'] = (byCategory[s.category || 'Other'] || 0) + 1
      })
      const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

      // Monthly breakdown (simulated)
      const monthlyData = MONTHS.map((m, i) => ({
        month: m,
        amount: activeSubs.reduce((sum, s) => sum + parseFloat(s.amount), 0) +
          (Math.random() - 0.5) * 200,
      }))

      setReport({
        year,
        totalSpend,
        subsCount: activeSubs.length,
        mostExpensive,
        topCategory,
        monthly: monthlyData,
        subs: sorted,
      })

      setLoading(false)

      // Fetch AI savings
      fetchAiSavings(activeSubs)
    }, 1200)
  }

  async function fetchAiSavings(subs) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-insights`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscriptions: subs }),
        }
      )
      const data = await res.json()
      setAiSavings(data.insights || [])
    } catch {
      setAiSavings([])
    }
  }

  async function downloadImage() {
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#0A0A0F',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `subtrackr-${year}-report.png`
      link.href = canvas.toDataURL()
      link.click()
      toast.success('Report downloaded!')
    } catch {
      toast.error('Download failed. Try again.')
    }
  }

  function copyShareText() {
    const text = `I spent ₹${report?.totalSpend?.toFixed(0)} on ${report?.subsCount} subscriptions in ${year} 😅\nTracked with SubTrackr — subtrackr.co`
    navigator.clipboard.writeText(text)
    toast.success('Share text copied!')
  }

  const maxMonthly = report ? Math.max(...report.monthly.map(m => m.amount)) : 1

  const pageContent = (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Yearly Waste Report
        </h1>
        <p style={{ color: '#666680', margin: 0, fontSize: 14 }}>
          Your complete subscription spending summary — shareable like Spotify Wrapped
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, alignItems: 'center' }}>
        {[2024, 2025, 2026].map(y => (
          <button
            key={y}
            onClick={() => { setYear(y); setReport(null) }}
            style={{
              padding: '8px 20px',
              background: year === y ? 'linear-gradient(135deg, #6C63FF, #3ECFCF)' : '#1A1A2A',
              border: '1px solid',
              borderColor: year === y ? 'transparent' : '#2A2A3A',
              borderRadius: 20,
              color: year === y ? '#fff' : '#888',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {y}
          </button>
        ))}
        <button
          onClick={generateReport}
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? '#1A1A2A' : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
            border: 'none',
            borderRadius: 12,
            color: loading ? '#666' : '#fff',
            fontWeight: 800,
            fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: 14, height: 14,
                border: '2px solid #444',
                borderTop: '2px solid #888',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                display: 'inline-block',
              }} />
              Generating...
            </>
          ) : '✨ Generate Report'}
        </button>
      </div>

      {/* Report card */}
      {report && (
        <>
          <div ref={reportRef} style={{
            background: '#0A0A0F',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid #1E1E2E',
            marginBottom: 20,
          }}>
            {/* Hero section */}
            <div style={{
              background: 'linear-gradient(135deg, #0D0A2E 0%, #0A1A2E 50%, #0A0A1E 100%)',
              padding: '48px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Background orbs */}
              <div style={{
                position: 'absolute', top: -40, left: -40,
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)',
                borderRadius: '50%',
              }} />
              <div style={{
                position: 'absolute', bottom: -40, right: -40,
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(62,207,207,0.1), transparent)',
                borderRadius: '50%',
              }} />

              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#A89CFF',
                textTransform: 'uppercase',
                letterSpacing: 2,
                marginBottom: 12,
              }}>
                SubTrackr · {report.year} Wrapped
              </div>
              <div style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: '-3px',
                background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 8,
              }}>
                ₹{report.totalSpend.toFixed(0)}
              </div>
              <div style={{ fontSize: 16, color: '#888', marginBottom: 4 }}>
                spent on <strong style={{ color: '#E8E8F0' }}>{report.subsCount} subscriptions</strong> in {report.year}
              </div>
              <div style={{ fontSize: 13, color: '#555' }}>
                That's ₹{(report.totalSpend / 12).toFixed(0)}/month on average
              </div>
            </div>

            {/* Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              background: '#1E1E2E',
            }}>
              {[
                {
                  label: 'Most Expensive',
                  value: report.mostExpensive?.name || '—',
                  sub: `₹${(parseFloat(report.mostExpensive?.amount || 0) * 12).toFixed(0)}/yr`,
                  color: '#FF6363',
                },
                {
                  label: 'Top Category',
                  value: report.topCategory?.[0] || '—',
                  sub: `${report.topCategory?.[1] || 0} subscriptions`,
                  color: '#6C63FF',
                },
                {
                  label: 'Monthly Average',
                  value: `₹${(report.totalSpend / 12).toFixed(0)}`,
                  sub: 'per month',
                  color: '#3ECFCF',
                },
              ].map((card, i) => (
                <div key={i} style={{
                  background: '#0F0F1A',
                  padding: '24px 20px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: '#555570', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: card.color, marginBottom: 4 }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: 12, color: '#666680' }}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Monthly breakdown */}
            <div style={{ padding: '32px 40px' }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
                Monthly Breakdown
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
                {report.monthly.map((m, i) => {
                  const height = (m.amount / maxMonthly) * 100
                  const isMax = m.amount === maxMonthly
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      {isMax && (
                        <span style={{ fontSize: 9, color: '#FFD700', fontWeight: 700 }}>PEAK</span>
                      )}
                      <div
                        title={`₹${m.amount.toFixed(0)}`}
                        style={{
                          width: '100%',
                          height: `${height}px`,
                          background: isMax
                            ? 'linear-gradient(180deg, #FFD700, #FF9F43)'
                            : 'linear-gradient(180deg, #6C63FF, #3ECFCF)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.8s ease',
                        }}
                      />
                      <span style={{ fontSize: 9, color: '#555' }}>{m.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top subscriptions */}
            <div style={{ padding: '0 40px 32px' }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                Top Subscriptions
              </div>
              {report.subs.slice(0, 5).map((sub, i) => (
                <div key={sub.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 0',
                  borderBottom: '1px solid #1A1A2A',
                }}>
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6C63FF22, #3ECFCF11)',
                    border: '1px solid #6C63FF44',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: '#A89CFF',
                    flexShrink: 0,
                  }}>
                    #{i + 1}
                  </div>
                  <img
                    src={`https://logo.clearbit.com/${sub.name.toLowerCase().replace(/ /g, '')}.com`}
                    style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain' }}
                    onError={e => e.target.style.display = 'none'}
                    alt={sub.name}
                  />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{sub.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#6C63FF' }}>
                    ₹{(sub.amount * 12).toFixed(0)}/yr
                  </span>
                  <span style={{ fontSize: 11, color: '#555' }}>
                    {report.totalSpend > 0 ? ((sub.amount * 12 / report.totalSpend) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              ))}
            </div>

            {/* AI Savings */}
            {aiSavings && aiSavings.length > 0 && (
              <div style={{
                margin: '0 40px 32px',
                background: 'linear-gradient(135deg, #0A1A0A, #0A2A0A)',
                border: '1px solid #1A4A1A',
                borderRadius: 14,
                padding: 24,
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#4CFF8F', marginBottom: 16 }}>
                  💡 You could have saved more
                </div>
                {aiSavings.map((insight, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    fontSize: 13,
                    color: '#A0A0B8',
                  }}>
                    <span>→ {insight.title}</span>
                    <span style={{ color: '#4CFF8F', fontWeight: 700, flexShrink: 0 }}>
                      Save ₹{(parseFloat(insight.saving_amount) * 12).toFixed(0)}/yr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div style={{
            background: '#0F0F1A',
            border: '1px solid #1E1E2E',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>📸 Share your wrapped</div>
              <div style={{ fontSize: 12, color: '#666680' }}>
                Show your friends how much you spend on subscriptions
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={copyShareText}
                style={{
                  padding: '10px 18px',
                  background: '#1A1A2A',
                  border: '1px solid #2A2A3A',
                  borderRadius: 10,
                  color: '#C0C0D0',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Copy for WhatsApp
              </button>
              <button
                onClick={downloadImage}
                style={{
                  padding: '10px 18px',
                  background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Download Image 📥
              </button>
            </div>
          </div>
        </>
      )}

      {!report && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          color: '#666680',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#E8E8F0', margin: '0 0 8px' }}>
            Your {year} Subscription Wrapped
          </h3>
          <p style={{ fontSize: 14, marginBottom: 28 }}>
            Select a year and generate your personalized spending report
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )

  if (userPlan !== 'pro') {
    return <ProGate featureName="Yearly Waste Report">{pageContent}</ProGate>
  }

  return pageContent
}