import { useState, useEffect } from 'react'
import { X, Calendar, DollarSign, Type, Tag, CreditCard, Info, Check, ChevronDown, Bell, Minus, Plus } from 'lucide-react'
import { ServiceLogo } from '../../lib/logos'
import { useAuth } from '../../contexts/AuthContext'

const SUGGESTIONS = [
  { name: 'Netflix', color: '#E50914' },
  { name: 'Spotify', color: '#1DB954' },
  { name: 'Adobe', color: '#FF0000' },
  { name: 'Notion', color: '#000000' },
  { name: 'GitHub', color: '#24292e' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'YouTube', color: '#FF0000' },
]

const CATEGORIES = [
  { id: 'Entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'Music', name: 'Music', icon: '🎵' },
  { id: 'Productivity', name: 'Productivity', icon: '💼' },
  { id: 'Cloud', name: 'Cloud', icon: '☁️' },
  { id: 'Dev Tools', name: 'Dev Tools', icon: '⚙️' },
  { id: 'Health', name: 'Health', icon: '🏥' },
  { id: 'Education', name: 'Education', icon: '📚' },
  { id: 'Lifestyle', name: 'Lifestyle', icon: '🏠' },
  { id: 'Other', name: 'Other', icon: '📦' },
]

const PRESET_COLORS = ['#E50914', '#1DB954', '#FF0000', '#6C63FF', '#FF9900', '#00A8E0', '#FFD700', '#3ECFCF']

export default function AddSubscriptionModal({ isOpen, onClose, onSave, initial = null, darkMode = true }) {
  const [form, setForm] = useState(initial || {
    name: '',
    amount: '',
    billing_cycle: 'monthly',
    category: 'Other',
    next_renewal_date: '',
    color: '#6C63FF',
    reminder_enabled: false,
    reminder_days: 3,
    currency: '₹',
    tags: []
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCycleOpen, setIsCycleOpen] = useState(false)

  const { isPro } = useAuth()
  const [tagInput, setTagInput] = useState('')

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(initial || {
        name: '',
        amount: '',
        billing_cycle: 'monthly',
        category: 'Other',
        next_renewal_date: '',
        color: '#6C63FF',
        reminder_enabled: false,
        reminder_days: 3,
        currency: '₹',
        tags: []
      })
      setErrors({})
    }
  }, [isOpen, initial])

  if (!isOpen) return null

  const theme = {
    bg: darkMode ? '#0F0F1A' : '#FFFFFF',
    inputBg: darkMode ? '#1A1A2A' : '#F5F5F8',
    inputBorder: darkMode ? '#2A2A3A' : '#E0E0E8',
    text: darkMode ? '#E8E8F0' : '#1A1A2A',
    muted: darkMode ? '#A0A0B8' : '#444460',
    placeholder: darkMode ? '#444460' : '#AAAABC',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Please enter a name'
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Please enter a valid price'
    if (!form.next_renewal_date) newErrors.next_renewal_date = 'Renewal date is required'
    else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (new Date(form.next_renewal_date) < today) {
        newErrors.next_renewal_date = 'Date must be today or in the future'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    // Simulate spinner as requested
    await new Promise(r => setTimeout(r, 800))
    
    try {
      await onSave({
        ...form,
        amount: parseFloat(form.amount)
      })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickDate = (months) => {
    const d = new Date()
    d.setMonth(d.getMonth() + months)
    setForm({ ...form, next_renewal_date: d.toISOString().split('T')[0] })
  }

  const addTag = () => {
    if (!tagInput.trim() || form.tags.includes(tagInput.trim())) return
    setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
    setTagInput('')
  }

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        animation: 'modalFadeIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          width: '100%', maxWidth: '480px', maxHeight: '90vh',
          backgroundColor: theme.bg, color: theme.text,
          borderRadius: '20px', border: `1px solid ${theme.border}`,
          padding: '32px', position: 'relative', overflowY: 'auto'
        }}
      >
        {/* Header */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', color: theme.muted, cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Add Subscription</h2>
          <p style={{ fontSize: '13px', color: theme.muted, marginTop: '4px' }}>Track a new recurring payment</p>
          <div style={{ width: '60px', height: '3px', background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', marginTop: '12px', borderRadius: '2px' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Service Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. Netflix, Spotify, Adobe..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6C63FF'
                  e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.inputBorder
                  e.target.style.boxShadow = 'none'
                }}
                style={{
                  width: '100%', height: '48px', backgroundColor: theme.inputBg, border: `1px solid ${errors.name ? '#FF6363' : theme.inputBorder}`,
                  borderRadius: '10px', padding: '0 16px', color: theme.text, fontSize: '14px', outline: 'none', transition: 'all 0.15s ease'
                }}
              />
              {errors.name && <p style={{ color: '#FF6363', fontSize: '11px', marginTop: '4px' }}>{errors.name}</p>}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {SUGGESTIONS.filter(s => s.name.toLowerCase().includes(form.name.toLowerCase()) || form.name === '').slice(0, 4).map(s => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setForm({ ...form, name: s.name, color: s.color })}
                  style={{
                    padding: '6px 12px', borderRadius: '20px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                    color: theme.text, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <ServiceLogo name={s.name} size={16} color={s.color} /> {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price + Cycle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</label>
              <div style={{ display: 'flex', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: theme.muted, fontSize: '14px', fontWeight: 600, pointerEvents: 'none', zIndex: 1 }}>{form.currency}</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  style={{
                    width: '100%', height: '48px', backgroundColor: theme.inputBg, border: `1px solid ${errors.amount ? '#FF6363' : theme.inputBorder}`,
                    borderRadius: '10px', padding: '0 48px 0 32px', color: theme.text, fontSize: '14px', outline: 'none'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setForm({ ...form, currency: form.currency === '₹' ? '$' : '₹' })}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px', borderRadius: '6px', border: `1px solid ${theme.inputBorder}`, backgroundColor: darkMode ? '#2A2A3A' : '#E8E8EF', color: theme.text, fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  {form.currency === '₹' ? '$' : '₹'}
                </button>
              </div>
              {errors.amount && <p style={{ color: '#FF6363', fontSize: '11px' }}>{errors.amount}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cycle</label>
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setIsCycleOpen(!isCycleOpen)}
                  style={{
                    height: '48px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{form.billing_cycle}</span>
                  <ChevronDown size={16} style={{ color: '#6C63FF' }} />
                </div>
                {isCycleOpen && (
                  <div style={{ position: 'absolute', top: '54px', left: 0, right: 0, backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px', zIndex: 10, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                    {['weekly', 'monthly', 'yearly', 'custom'].map(opt => (
                      <div 
                        key={opt}
                        onClick={() => { setForm({ ...form, billing_cycle: opt }); setIsCycleOpen(false); }}
                        style={{ padding: '12px 16px', fontSize: '14px', cursor: 'pointer', backgroundColor: form.billing_cycle === opt ? '#6C63FF' : 'transparent', color: form.billing_cycle === opt ? '#fff' : theme.text }}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</label>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
              {CATEGORIES.map(cat => {
                const isSelected = form.category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.id })}
                    style={{
                      flexShrink: 0, padding: '10px 16px', borderRadius: '30px', border: isSelected ? 'none' : `1px solid ${theme.inputBorder}`,
                      backgroundColor: isSelected ? '#6C63FF' : theme.inputBg,
                      backgroundImage: isSelected ? 'linear-gradient(135deg, #6C63FF, #3ECFCF)' : 'none',
                      color: isSelected ? '#fff' : theme.muted, fontSize: '13px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'transform 0.1s ease',
                      transform: isSelected ? 'scale(1)' : 'scale(1)'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Renewal Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Renewal Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: theme.muted, pointerEvents: 'none', zIndex: 1 }} />
              <input 
                type="date"
                value={form.next_renewal_date}
                onChange={(e) => setForm({ ...form, next_renewal_date: e.target.value })}
                style={{
                   width: '100%', height: '48px', backgroundColor: theme.inputBg, border: `1px solid ${errors.next_renewal_date ? '#FF6363' : theme.inputBorder}`,
                   borderRadius: '10px', padding: '0 48px 0 16px', color: theme.text, fontSize: '14px', outline: 'none', position: 'relative', zIndex: 0
                }}
              />
            </div>
            {errors.next_renewal_date && <p style={{ color: '#FF6363', fontSize: '11px' }}>{errors.next_renewal_date}</p>}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'In 1 month', val: 1 },
                { label: 'In 3 months', val: 3 },
                { label: 'In 1 year', val: 12 },
              ].map(q => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleQuickDate(q.val)}
                  style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.muted, cursor: 'pointer' }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Color */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brand Color</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {PRESET_COLORS.map(c => {
                 const isSelected = form.color === c
                 return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c, border: isSelected ? `3px solid ${theme.text}` : 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isSelected ? `0 0 0 2px ${c}` : 'none'
                      }}
                    >
                      {isSelected && <Check size={14} color="#fff" />}
                    </button>
                 )
              })}
            </div>
          </div>

          {/* Tags (Pro) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tags</label>
              {!isPro && <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C63FF', background: 'rgba(108,99,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>PRO</span>}
            </div>
            {isPro ? (
              <div style={{ spaceY: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    className="input" 
                    placeholder="Add tag (e.g. Work, Family)" 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    style={{ height: '40px', fontSize: '13px' }}
                  />
                  <button type="button" onClick={addTag} className="btn-secondary" style={{ padding: '0 12px', height: '40px' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {form.tags.map(tag => (
                    <span key={tag} style={{ 
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                      background: 'rgba(108,99,255,0.1)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.2)'
                    }}>
                      {tag}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => setForm({ ...form, tags: form.tags.filter(t => t !== tag) })} />
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: '12px', borderRadius: '10px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                   Upgrade to Pro to use custom tags
                </p>
              </div>
            )}
          </div>

          {/* Reminder Toggle */}
          <div style={{ backgroundColor: theme.inputBg, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', border: `1px solid ${theme.inputBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell size={18} style={{ color: form.reminder_enabled ? '#6C63FF' : theme.muted }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Set reminder before renewal</span>
              </div>
              <div 
                onClick={() => setForm({ ...form, reminder_enabled: !form.reminder_enabled })}
                style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: form.reminder_enabled ? '#6C63FF' : theme.inputBorder, position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                <div style={{ position: 'absolute', top: '2px', left: form.reminder_enabled ? '22px' : '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
              </div>
            </div>

            {form.reminder_enabled && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '13px', color: theme.muted }}>Remind me (days before)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setForm({ ...form, reminder_days: Math.max(1, form.reminder_days - 1) })}
                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.bg, color: theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 800, width: '24px', textAlign: 'center' }}>{form.reminder_days}</span>
                  <button 
                    type="button"
                    onClick={() => setForm({ ...form, reminder_days: Math.min(30, form.reminder_days + 1) })}
                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.bg, color: theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, height: '56px', borderRadius: '14px', border: 'none', backgroundColor: darkMode ? '#1A1A2A' : '#F5F5F8', color: '#888', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 2, height: '56px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 10px 20px rgba(108, 99, 255, 0.2)',
                transition: 'all 0.15s ease',
                transform: isSubmitting ? 'scale(0.98)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.1)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {isSubmitting ? (
                <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                'Create Subscription'
              )}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 40px;
          height: 100%;
          cursor: pointer;
        }
      `}} />
    </div>
  )
}
