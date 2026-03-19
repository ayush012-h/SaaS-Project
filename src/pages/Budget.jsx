import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { Wallet, Target, TrendingDown, Save, Loader2, CreditCard, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import ProGate from '../components/ProGate'

export default function Budget({ userPlan }) {
  const [budget, setBudget] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])

  const isPro = userPlan === 'pro'

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const [profileRes, subsRes] = await Promise.all([
        supabase.from('profiles').select('monthly_budget').eq('id', user.id).single(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active')
      ])

      if (profileRes.data) setBudget(profileRes.data.monthly_budget || 0)
      if (subsRes.data) setSubscriptions(subsRes.data)
    } catch (error) {
      console.error('Error fetching budget data:', error)
      toast.error('Could not load budget data')
    } finally {
      setLoading(false)
    }
  }

  async function saveBudget() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('profiles')
        .update({ monthly_budget: budget })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Budget updated! 🎯')
    } catch (error) {
      toast.error('Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  const totals = useMemo(() => {
    const totalSpent = subscriptions.reduce((sum, sub) => {
      let amount = sub.amount || 0
      if (sub.billing_cycle === 'yearly') amount /= 12
      return sum + amount
    }, 0)
    
    const percentage = budget > 0 ? (totalSpent / budget) * 100 : 0
    return { spent: totalSpent, percent: percentage }
  }, [subscriptions, budget])

  const getStatus = () => {
    if (totals.spent > budget && budget > 0) return { text: `❌ Budget exceeded by ₹${(totals.spent - budget).toFixed(0)}`, color: '#FF6363', animate: true }
    if (totals.percent >= 91) return { text: "🚨 Almost at your limit", color: '#FF6363' }
    if (totals.percent >= 71) return { text: "⚠️ Approaching your budget limit", color: '#FF9F43' }
    return { text: "✅ You're within budget", color: '#4CFF8F' }
  }

  const ringColor = totals.percent > 100 ? '#FF6363' : totals.percent > 90 ? '#FF6363' : totals.percent > 70 ? '#FF9F43' : '#4CFF8F'
  const status = getStatus()

  const content = (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <style>{`
        @keyframes pulse-red {
          0% { filter: drop-shadow(0 0 0 rgba(255, 99, 99, 0)); }
          50% { filter: drop-shadow(0 0 15px rgba(255, 99, 99, 0.4)); }
          100% { filter: drop-shadow(0 0 0 rgba(255, 99, 99, 0)); }
        }
      `}</style>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        
        {/* Left Col: Setup & Tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Budget Input Card */}
          <div style={{ 
            background: '#1A1A2A', 
            borderRadius: '24px', 
            padding: '32px', 
            border: '1px solid #2A2A3E' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(108, 99, 255, 0.1)', padding: '10px', borderRadius: '12px', color: '#6C63FF' }}>
                <Target size={24} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Define Goal</h2>
            </div>
            <p style={{ color: '#9999BB', fontSize: '14px', marginBottom: '24px' }}>How much do you want to spend on subscriptions each month?</p>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666680', fontWeight: '700' }}>₹</span>
                <input 
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: '#0F0F1A',
                    border: '1px solid #2A2A3E',
                    borderRadius: '14px',
                    padding: '14px 14px 14px 32px',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>
              <button 
                onClick={saveBudget}
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px 24px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save
              </button>
            </div>
          </div>

          {/* Breakdown List */}
          <div style={{ 
            background: '#13131F', 
            borderRadius: '24px', 
            padding: '32px', 
            border: '1px solid #1E1E2E' 
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '24px' }}>Spending Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {subscriptions.sort((a,b) => b.amount - a.amount).map(sub => (
                <div key={sub.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#E8E8F0', fontSize: '14px', fontWeight: '600' }}>{sub.name}</span>
                    <span style={{ color: '#666680', fontSize: '12px' }}>₹{sub.amount}/mo</span>
                  </div>
                  <div style={{ height: '6px', background: '#1A1A2A', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min((sub.amount / (budget || 1)) * 100, 100)}%`, 
                      background: 'linear-gradient(90deg, #6C63FF, #3ECFCF)',
                      borderRadius: '100px'
                    }} />
                  </div>
                </div>
              ))}
              {subscriptions.length === 0 && <p style={{ color: '#666680', textAlign: 'center' }}>No active subscriptions</p>}
            </div>
          </div>
        </div>

        {/* Right Col: Progress Ring */}
        <div style={{ 
          background: '#1A1A2A', 
          borderRadius: '24px', 
          padding: '40px', 
          border: '1px solid #2A2A3E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* SVG Ring */}
          <div style={{ position: 'relative', width: '200px', height: '200px', animation: status.animate ? 'pulse-red 2s infinite ease-in-out' : 'none' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#0F0F1A" strokeWidth="16" />
              <circle 
                cx="100" cy="100" r="80" 
                fill="none" 
                stroke={ringColor} 
                strokeWidth="16" 
                strokeDasharray={`${(Math.min(totals.percent, 100) / 100) * 502.6} 502.6`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dasharray 1s ease-in-out, stroke 0.3s' }}
              />
            </svg>
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>{Math.round(totals.percent)}%</span>
              <span style={{ fontSize: '12px', color: '#666680', fontWeight: '700', textTransform: 'uppercase' }}>Used</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              ₹{totals.spent.toFixed(0)} <span style={{ fontSize: '16px', color: '#666680', fontWeight: '500' }}>/ ₹{budget}</span>
            </p>
            <p style={{ color: status.color, fontWeight: '700', fontSize: '15px' }}>{status.text}</p>
          </div>

          {/* Insights Box */}
          <div style={{ 
            marginTop: '40px', 
            width: '100%', 
            padding: '24px', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid #1E1E2E',
            borderRadius: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(76, 255, 143, 0.1)', padding: '6px', borderRadius: '8px', color: '#4CFF8F' }}>
                <TrendingDown size={18} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#E8E8F0', margin: 0 }}>Budget Insights</h3>
            </div>
            <p style={{ color: '#9999BB', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
              {totals.percent > 100 
                ? "You're over budget! Consider cancelling your least used subscription to save money."
                : totals.percent > 80
                ? "You're getting close to your limit. Avoid adding new services this month."
                : "Great job! Your subscription spending is perfectly optimized."}
            </p>
          </div>
        </div>

      </div>
    </div>
  )

  return isPro ? content : <ProGate featureName="Budget Management">{content}</ProGate>
}
