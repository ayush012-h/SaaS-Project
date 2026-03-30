import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProGate from '../components/ProGate'
import toast from 'react-hot-toast'

export default function Budget({ userPlan }) {
  const [budget, setBudget] = useState('')
  const [savedBudget, setSavedBudget] = useState(0)
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const [profileRes, subsRes] = await Promise.all([
      supabase.from('profiles').select('monthly_budget').eq('id', session.user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', session.user.id).eq('status', 'active'),
    ])

    if (profileRes.data?.monthly_budget) {
      setSavedBudget(profileRes.data.monthly_budget)
      setBudget(profileRes.data.monthly_budget.toString())
    }
    setSubscriptions(subsRes.data || [])
    setLoading(false)
  }

  async function saveBudget() {
    if (!budget || isNaN(parseFloat(budget))) {
      toast.error('Please enter a valid budget amount')
      return
    }
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    const { error } = await supabase
      .from('profiles')
      .update({ monthly_budget: parseFloat(budget) })
      .eq('id', session.user.id)

    if (!error) {
      setSavedBudget(parseFloat(budget))
      toast.success('Budget saved!')
    } else {
      toast.error('Failed to save budget')
    }
    setSaving(false)
  }

  const totalMonthly = subscriptions.reduce((s, sub) => s + parseFloat(sub.amount || 0), 0)
  const percentage = savedBudget > 0 ? Math.min((totalMonthly / savedBudget) * 100, 150) : 0
  const displayPercentage = savedBudget > 0 ? ((totalMonthly / savedBudget) * 100).toFixed(0) : 0

  // SVG ring
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDash = circumference - (Math.min(percentage, 100) / 100) * circumference
  const ringColor = percentage <= 70 ? '#4CFF8F' : percentage <= 90 ? '#FF9F43' : '#FF6363'

  function getStatusMessage() {
    if (!savedBudget) return { icon: '💡', msg: 'Set a budget to start tracking', color: '#666680' }
    if (percentage <= 70) return { icon: '✅', msg: "You're within budget", color: '#4CFF8F' }
    if (percentage <= 90) return { icon: '⚠️', msg: 'Approaching your budget limit', color: '#FF9F43' }
    if (percentage <= 100) return { icon: '🚨', msg: 'Almost at your limit', color: '#FF6363' }
    return { icon: '❌', msg: `Budget exceeded by ₹${(totalMonthly - savedBudget).toFixed(0)}`, color: '#FF6363' }
  }

  const status = getStatusMessage()
  const sortedSubs = [...subscriptions].sort((a, b) => b.amount - a.amount)

  const pageContent = (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Budget Alerts
        </h1>
        <p style={{ color: '#666680', margin: 0, fontSize: 14 }}>
          Set a monthly limit and get alerted before you overspend
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left column */}
        <div>
          {/* Budget setup */}
          <div style={{
            background: '#0F0F1A',
            border: '1px solid #1E1E2E',
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>
              Monthly Subscription Budget
            </h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#1A1A2A',
                border: '1px solid #2A2A3A',
                borderRadius: 10,
                padding: '0 14px',
                flex: 1,
              }}>
                <span style={{ color: '#6C63FF', fontWeight: 800, marginRight: 8 }}>₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="2000"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#E8E8F0',
                    fontSize: 18,
                    fontWeight: 700,
                    outline: 'none',
                    width: '100%',
                    padding: '12px 0',
                  }}
                />
              </div>
              <button
                onClick={saveBudget}
                disabled={saving}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 13,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Budget ring */}
          <div style={{
            background: '#0F0F1A',
            border: '1px solid #1E1E2E',
            borderRadius: 16,
            padding: 28,
            textAlign: 'center',
          }}>
            <svg width={200} height={200} style={{ overflow: 'visible', margin: '0 auto', display: 'block' }}>
              {/* Background ring */}
              <circle
                cx={100} cy={100} r={radius}
                fill="none"
                stroke="#1A1A2A"
                strokeWidth={16}
              />
              {/* Progress ring */}
              <circle
                cx={100} cy={100} r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth={16}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{
                  transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease',
                  animation: percentage > 100 ? 'ringPulse 1s ease-in-out infinite' : 'none',
                }}
              />
              {/* Center text */}
              <text x={100} y={92} textAnchor="middle" fill="#E8E8F0" fontSize={22} fontWeight={800}>
                ₹{totalMonthly.toFixed(0)}
              </text>
              <text x={100} y={112} textAnchor="middle" fill="#666680" fontSize={12}>
                of ₹{savedBudget || '—'}
              </text>
              <text x={100} y={132} textAnchor="middle" fill={ringColor} fontSize={14} fontWeight={700}>
                {savedBudget ? `${displayPercentage}%` : 'No budget set'}
              </text>
            </svg>

            <div style={{
              marginTop: 16,
              fontSize: 14,
              fontWeight: 700,
              color: status.color,
            }}>
              {status.icon} {status.msg}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Subscription breakdown */}
          <div style={{
            background: '#0F0F1A',
            border: '1px solid #1E1E2E',
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>
              Breakdown by Subscription
            </h3>
            {sortedSubs.length === 0 ? (
              <p style={{ color: '#666680', fontSize: 13 }}>No active subscriptions</p>
            ) : (
              sortedSubs.map(sub => {
                const pct = savedBudget > 0 ? (sub.amount / savedBudget) * 100 : 0
                return (
                  <div key={sub.id} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#C0C0D0' }}>{sub.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>₹{sub.amount}</span>
                    </div>
                    <div style={{ height: 6, background: '#1A1A2A', borderRadius: 4 }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(pct, 100)}%`,
                        background: 'linear-gradient(90deg, #6C63FF, #3ECFCF)',
                        borderRadius: 4,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#555570', marginTop: 3 }}>
                      {savedBudget ? `${pct.toFixed(0)}% of budget` : '—'}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Insights */}
          {savedBudget > 0 && (
            <div style={{
              background: '#0F0F1A',
              border: '1px solid #1E1E2E',
              borderRadius: 16,
              padding: 24,
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>
                💡 Budget Insights
              </h3>
              {sortedSubs.slice(0, 1).map(sub => (
                <div key={sub.id} style={{
                  padding: '12px 14px',
                  background: '#1A1A2A',
                  borderRadius: 10,
                  marginBottom: 10,
                  fontSize: 13,
                  color: '#A0A0B8',
                  lineHeight: 1.6,
                }}>
                  💡 If you cancelled <strong style={{ color: '#E8E8F0' }}>{sub.name}</strong>,
                  you'd be at <strong style={{ color: '#4CFF8F' }}>
                    {((totalMonthly - sub.amount) / savedBudget * 100).toFixed(0)}%
                  </strong> of your budget
                </div>
              ))}
              <div style={{
                padding: '12px 14px',
                background: '#1A1A2A',
                borderRadius: 10,
                fontSize: 13,
                color: '#A0A0B8',
              }}>
                📅 Budget resets on the 1st of next month
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%, 100% { opacity: 1 }
          50% { opacity: 0.5 }
        }
      `}</style>
    </div>
  )

  if (userPlan !== 'pro') {
    return <ProGate featureName="Budget Alerts">{pageContent}</ProGate>
  }

  return pageContent
}