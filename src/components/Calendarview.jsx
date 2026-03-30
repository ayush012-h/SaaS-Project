import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProGate from '../components/ProGate'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS_FULL = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']

export default function CalendarView({ userPlan }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [subscriptions, setSubscriptions] = useState([])
  const [view, setView] = useState('month') // 'month' | 'week'
  const [hoveredDay, setHoveredDay] = useState(null)

  useEffect(() => { fetchSubs() }, [])

  async function fetchSubs() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
    setSubscriptions(data || [])
  }

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  function goToday() {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  // Get days in month
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0=Sun, adjust to Mon=0)
  function getFirstDayOfMonth(month, year) {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  // Get renewals for a specific day
  function getRenewalsForDay(day) {
    return subscriptions.filter(sub => {
      if (!sub.next_renewal_date) return false
      const d = new Date(sub.next_renewal_date)
      return d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
    })
  }

  // Get all renewals this month sorted
  function getMonthRenewals() {
    return subscriptions
      .filter(sub => {
        if (!sub.next_renewal_date) return false
        const d = new Date(sub.next_renewal_date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .sort((a, b) => new Date(a.next_renewal_date) - new Date(b.next_renewal_date))
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
  const monthRenewals = getMonthRenewals()
  const monthTotal = monthRenewals.reduce((s, sub) => s + parseFloat(sub.amount || 0), 0)

  // Build calendar grid
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  function getDateBadgeColor(dateStr) {
    if (!dateStr) return '#555'
    const d = new Date(dateStr)
    const now = new Date()
    const diff = (d - now) / (1000 * 60 * 60 * 24)
    if (diff < 0) return '#555'
    if (diff <= 1) return '#FF6363'
    if (diff <= 7) return '#FF9F43'
    return '#3ECFCF'
  }

  const accentColors = ['#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#312E81']

  const pageContent = (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Renewal Calendar
          </h1>
          <p style={{ color: '#666680', margin: 0, fontSize: 14 }}>
            See all your renewals spread across the month
          </p>
        </div>
        {/* View toggle */}
        <div style={{
          display: 'flex',
          background: '#1A1A2A',
          border: '1px solid #2A2A3A',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {['month', 'week'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '8px 16px',
                background: view === v ? 'linear-gradient(135deg, #6C63FF, #3ECFCF)' : 'transparent',
                border: 'none',
                color: view === v ? '#fff' : '#888',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'capitalize',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        {/* Calendar */}
        <div style={{
          background: '#0F0F1A',
          border: '1px solid #1E1E2E',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {/* Month navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid #1E1E2E',
          }}>
            <button
              onClick={prevMonth}
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: '#1A1A2A',
                border: '1px solid #2A2A3A',
                color: '#E8E8F0',
                cursor: 'pointer',
                fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >←</button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                {MONTHS_FULL[currentMonth]} {currentYear}
              </div>
              <div style={{ fontSize: 12, color: '#6C63FF', fontWeight: 600 }}>
                ₹{monthTotal.toFixed(0)} this month
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={goToday}
                style={{
                  padding: '6px 12px',
                  background: '#1A1A2A',
                  border: '1px solid #2A2A3A',
                  borderRadius: 8,
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: '#1A1A2A',
                  border: '1px solid #2A2A3A',
                  color: '#E8E8F0',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >→</button>
            </div>
          </div>

          {/* Day headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid #1E1E2E',
          }}>
            {DAYS.map(day => (
              <div key={day} style={{
                padding: '10px 0',
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#555570',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}>
            {calendarDays.map((day, i) => {
              if (!day) {
                return <div key={`empty-${i}`} style={{ minHeight: 80, background: '#0A0A0F', borderRight: '1px solid #1A1A2A', borderBottom: '1px solid #1A1A2A' }} />
              }

              const renewals = getRenewalsForDay(day)
              const isToday = day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
              const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
              const isHovered = hoveredDay === `${currentMonth}-${day}`

              return (
                <div
                  key={day}
                  onMouseEnter={() => setHoveredDay(`${currentMonth}-${day}`)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    minHeight: 80,
                    padding: 8,
                    borderRight: '1px solid #1A1A2A',
                    borderBottom: '1px solid #1A1A2A',
                    background: isToday
                      ? 'rgba(108,99,255,0.08)'
                      : renewals.length > 0
                      ? `${accentColors[renewals[0].id?.charCodeAt(0) % accentColors.length] || '#6C63FF'}08`
                      : 'transparent',
                    border: isToday ? '1px solid rgba(108,99,255,0.3)' : undefined,
                    opacity: isPast ? 0.5 : 1,
                    cursor: renewals.length > 0 ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                    transform: isHovered && renewals.length > 0 ? 'translateY(-1px)' : 'none',
                    position: 'relative',
                  }}
                >
                  {/* Day number */}
                  <div style={{
                    fontSize: 12,
                    fontWeight: isToday ? 800 : 500,
                    color: isToday ? '#A89CFF' : '#888',
                    marginBottom: 4,
                    width: 22, height: 22,
                    borderRadius: '50%',
                    background: isToday ? 'rgba(108,99,255,0.2)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {day}
                  </div>

                  {/* Renewal dots */}
                  {renewals.slice(0, 2).map((sub, ri) => (
                    <div key={sub.id} style={{
                      fontSize: 10,
                      color: '#C0C0D0',
                      marginBottom: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: accentColors[ri % accentColors.length],
                        flexShrink: 0,
                      }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 9 }}>
                        ₹{sub.amount}
                      </span>
                    </div>
                  ))}
                  {renewals.length > 2 && (
                    <div style={{ fontSize: 9, color: '#6C63FF', fontWeight: 700 }}>
                      +{renewals.length - 2} more
                    </div>
                  )}

                  {/* Hover tooltip */}
                  {isHovered && renewals.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#0F0F1A',
                      border: '1px solid #2A2A4A',
                      borderRadius: 10,
                      padding: '10px 14px',
                      zIndex: 100,
                      minWidth: 160,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                    }}>
                      {renewals.map(sub => (
                        <div key={sub.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 12,
                          fontSize: 12,
                          marginBottom: 4,
                        }}>
                          <span style={{ color: '#C0C0D0' }}>{sub.name}</span>
                          <span style={{ color: '#6C63FF', fontWeight: 700 }}>₹{sub.amount}</span>
                        </div>
                      ))}
                      <div style={{
                        borderTop: '1px solid #2A2A3A',
                        marginTop: 6,
                        paddingTop: 6,
                        fontSize: 11,
                        color: '#555',
                        textAlign: 'center',
                      }}>
                        {MONTHS_FULL[currentMonth]} {day}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Side panel */}
        <div style={{
          background: '#0F0F1A',
          border: '1px solid #1E1E2E',
          borderRadius: 16,
          overflow: 'hidden',
          height: 'fit-content',
        }}>
          <div style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid #1E1E2E',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {MONTHS_FULL[currentMonth]} Renewals
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#6C63FF' }}>
              ₹{monthTotal.toFixed(0)}
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
              {monthRenewals.length} renewal{monthRenewals.length !== 1 ? 's' : ''} this month
            </div>
          </div>

          <div style={{ padding: '16px 20px', maxHeight: 400, overflowY: 'auto' }}>
            {monthRenewals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#555' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 13 }}>No renewals this month</div>
              </div>
            ) : (
              monthRenewals.map(sub => {
                const badgeColor = getDateBadgeColor(sub.next_renewal_date)
                const d = new Date(sub.next_renewal_date)
                return (
                  <div key={sub.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 0',
                    borderBottom: '1px solid #1A1A2A',
                  }}>
                    <div style={{
                      width: 32, height: 32,
                      borderRadius: 8,
                      background: `${badgeColor}22`,
                      border: `1px solid ${badgeColor}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: badgeColor,
                      flexShrink: 0,
                    }}>
                      {d.getDate()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#555' }}>
                        {MONTHS_FULL[d.getMonth()].slice(0, 3)} {d.getDate()}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#6C63FF', flexShrink: 0 }}>
                      ₹{sub.amount}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Total */}
          {monthRenewals.length > 0 && (
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid #1E1E2E',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#6C63FF' }}>
                ₹{monthTotal.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (userPlan !== 'pro') {
    return <ProGate featureName="Calendar View">{pageContent}</ProGate>
  }

  return pageContent
}