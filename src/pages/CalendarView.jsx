import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react'
import ProGate from '../components/ProGate'

export default function CalendarView({ userPlan }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month')
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  const isPro = userPlan === 'pro'

  useEffect(() => {
    fetchSubs()
  }, [])

  async function fetchSubs() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id)
      if (data) setSubscriptions(data)
    } finally {
      setLoading(false)
    }
  }

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7 // Mon-Sun start
    const daysInMonth = lastDayOfMonth.getDate()

    const today = new Date()
    const days = []

    // Pre-month empty slots
    for (let i = 0; i < startOffset; i++) days.push({ type: 'empty' })

    // Month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = new Date(year, month, d).toISOString().split('T')[0]
      const dayRenews = subscriptions.filter(s => {
        const subDate = new Date(s.next_renewal_date)
        return subDate.getDate() === d && subDate.getMonth() === month && subDate.getFullYear() === year
      })
      
      const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

      days.push({ 
        day: d, 
        type: 'date', 
        renewals: dayRenews, 
        isPast, 
        isToday,
        dateStr
      })
    }
    
    return { days, year, monthName: new Date(year, month).toLocaleString('default', { month: 'long' }) }
  }, [currentDate, subscriptions])

  const monthlyTotal = useMemo(() => {
    return calendarData.days.reduce((sum, d) => {
      if (d.type === 'date') return sum + d.renewals.reduce((s, r) => s + r.amount, 0)
      return sum
    }, 0)
  }, [calendarData])

  const navigateMonth = (step) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + step, 1))
  }

  const content = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', padding: '24px' }}>
      {/* Calendar Area */}
      <div>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#E8E8F0', margin: 0 }}>
              {calendarData.monthName} {calendarData.year}
            </h1>
            <div style={{ display: 'flex', background: '#1A1A2A', borderRadius: '12px', padding: '4px', border: '1px solid #2A2A3E' }}>
              <button onClick={() => navigateMonth(-1)} style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#666680' }}><ChevronLeft size={18} /></button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                style={{ background: 'none', border: 'none', padding: '6px 16px', cursor: 'pointer', color: '#E8E8F0', fontWeight: '700', fontSize: '13px' }}
              >
                Today
              </button>
              <button onClick={() => navigateMonth(1)} style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#666680' }}><ChevronRight size={18} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: '#1A1A2A', borderRadius: '12px', padding: '4px', border: '1px solid #2A2A3E' }}>
             <button onClick={() => setView('month')} style={{ padding: '8px 16px', borderRadius: '8px', background: view === 'month' ? '#2A2A3E' : 'none', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px' }}>
                <LayoutGrid size={16} /> Month
             </button>
             <button onClick={() => setView('week')} style={{ padding: '8px 16px', borderRadius: '8px', background: view === 'week' ? '#2A2A3E' : 'none', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px' }}>
                <List size={16} /> Week
             </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#1E1E2E', border: '1px solid #1E1E2E', borderRadius: '16px', overflow: 'hidden' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(h => (
            <div key={h} style={{ background: '#0F0F1A', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: '#666680', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {h}
            </div>
          ))}
          {calendarData.days.map((d, i) => (
            <div key={i} style={{ 
              minHeight: '120px', 
              background: d.type === 'empty' ? '#0A0A0F' : '#1A1A2A',
              padding: '12px',
              border: d.isToday ? '2px solid #6C63FF' : 'none',
              borderRadius: d.isToday ? '8px' : '0',
              opacity: d.isPast ? 0.5 : 1,
              position: 'relative',
              transition: 'background 0.2s'
            }}>
              {d.type === 'date' && (
                <>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: d.isToday ? '#6C63FF' : '#666680' }}>{d.day}</span>
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {d.renewals.slice(0, 2).map((r, ri) => (
                      <div key={r.id} style={{ 
                        background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.2)',
                        padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', color: '#fff',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {r.name} · ₹{r.amount}
                      </div>
                    ))}
                    {d.renewals.length > 2 && (
                       <span style={{ fontSize: '10px', color: '#666680', fontWeight: '700', marginLeft: '4px' }}>+ {d.renewals.length - 2} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Side Panel */}
      <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px' }}>
        <div style={{ marginBottom: '40px' }}>
           <h2 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#666680', letterSpacing: '0.05em', marginBottom: '12px' }}>Monthly Estimate</h2>
           <p style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: 0 }}>₹{monthlyTotal.toFixed(0)}</p>
           <p style={{ fontSize: '12px', color: '#9999BB', marginTop: '4px' }}>Total across {calendarData.monthName}</p>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#E8E8F0', marginBottom: '24px' }}>Upcoming Renewals</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[...calendarData.days]
            .filter(d => d.type === 'date' && d.renewals.length > 0 && !d.isPast)
            .sort((a,b) => a.day - b.day)
            .map(d => d.renewals.map(r => (
              <div key={r.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  padding: '8px', 
                  borderRadius: '12px', 
                  background: '#1A1A2A',
                  textAlign: 'center',
                  minWidth: '50px'
                }}>
                  <p style={{ fontSize: '12px', color: '#666680', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>{new Date(currentDate.getFullYear(), currentDate.getMonth(), d.day).toLocaleString('default', { weekday: 'short' })}</p>
                  <p style={{ fontSize: '18px', color: d.isToday ? '#6C63FF' : '#fff', fontWeight: '900', margin: 0 }}>{d.day}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#E8E8F0', fontWeight: '700', fontSize: '14px', margin: '0 0 2px 0' }}>{r.name}</p>
                  <p style={{ color: '#666680', fontSize: '12px', margin: 0 }}>₹{r.amount} · {r.billing_cycle}</p>
                </div>
                {d.isToday && <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255, 99, 99, 0.1)', color: '#FF6363', fontSize: '10px', fontWeight: '900' }}>DUE</span>}
              </div>
            )))
          }
          {loading && <p style={{ color: '#666680', textAlign: 'center' }}>Loading events...</p>}
          {!loading && monthlyTotal === 0 && <p style={{ color: '#666680', textAlign: 'center' }}>No renewals this month</p>}
        </div>
      </div>
    </div>
  )

  return isPro ? content : <ProGate featureName="Personalized Sub Calendar">{content}</ProGate>
}
