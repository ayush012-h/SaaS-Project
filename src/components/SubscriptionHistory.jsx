import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { History, X, Clock, Edit3 } from 'lucide-react'
import { format } from 'date-fns'

const FIELD_LABELS = {
  amount: 'Price',
  billing_cycle: 'Billing Cycle',
  name: 'Name',
  category: 'Category',
  status: 'Status',
  next_renewal_date: 'Renewal Date',
  notes: 'Notes',
  reminder_days: 'Reminder Days',
  tags: 'Tags',
}

export default function SubscriptionHistory({ subscriptionId, subscriptionName, onClose }) {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      if (!user || !subscriptionId) return
      setLoading(true)
      const { data, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('user_id', user.id)
        .order('changed_at', { ascending: false })

      if (!error) setHistory(data || [])
      setLoading(false)
    }
    fetchHistory()
  }, [subscriptionId, user])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: '100%', maxWidth: '480px', maxHeight: '80vh',
        background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', padding: '28px', position: 'relative',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))',
            border: '1px solid rgba(108,99,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <History size={18} color="#6C63FF" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#E8E8F0' }}>Changelog</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#8888A0' }}>{subscriptionName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8888A0' }}>
            <X size={20} />
          </button>
        </div>

        {/* Timeline */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div style={{
                width: '24px', height: '24px',
                border: '2px solid rgba(108,99,255,0.2)',
                borderTopColor: '#6C63FF',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#8888A0' }}>
              <Clock size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No changes recorded yet</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.7 }}>Edits will appear here</p>
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '28px' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: '9px', top: '8px', bottom: '8px',
                width: '2px', background: 'linear-gradient(180deg, #6C63FF, transparent)',
                opacity: 0.25,
              }} />

              {history.map((entry, i) => (
                <div key={entry.id} style={{ marginBottom: '20px', position: 'relative' }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '-24px', top: '4px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: i === 0 ? '#6C63FF' : '#2A2A3A',
                    border: '2px solid',
                    borderColor: i === 0 ? '#6C63FF' : '#3A3A4A',
                  }} />

                  <div style={{
                    background: '#1A1A2A', borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Edit3 size={12} color="#6C63FF" />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#A0A0C0' }}>
                        {FIELD_LABELS[entry.field] || entry.field}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {entry.old_value && (
                        <span style={{
                          fontSize: '12px', color: '#FF6363', background: 'rgba(255,99,99,0.1)',
                          padding: '2px 8px', borderRadius: '6px', textDecoration: 'line-through',
                        }}>
                          {entry.old_value}
                        </span>
                      )}
                      {entry.old_value && <span style={{ color: '#8888A0', fontSize: '12px' }}>→</span>}
                      <span style={{
                        fontSize: '12px', color: '#4CFF8F', background: 'rgba(76,255,143,0.1)',
                        padding: '2px 8px', borderRadius: '6px',
                      }}>
                        {entry.new_value}
                      </span>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#5A5A70' }}>
                      {format(new Date(entry.changed_at), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
