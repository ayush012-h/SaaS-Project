import { useState, useEffect } from 'react'
import { X, Pencil, Trash2, Calendar, Tag, CreditCard, FileText, Check, AlertCircle, DollarSign, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge'
import { ServiceLogo } from '../../lib/logos'

const CATEGORIES = ['Entertainment', 'Productivity', 'Health & Fitness', 'News & Media',
  'Cloud Storage', 'Gaming', 'Education', 'Finance', 'Music', 'Design', 'Developer Tools', 'Other']
const BILLING_CYCLES = ['monthly', 'yearly', 'weekly']
const STATUSES = ['active', 'trial', 'paused', 'cancelled']

export default function SubscriptionDetailModal({ sub, onClose, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ ...sub, currency: sub.currency || '₹' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm({ ...sub, currency: sub.currency || '₹' })
  }, [sub])

  if (!sub) return null

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...form,
        amount: parseFloat(form.amount) || 0,
      })
      setIsEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content max-w-lg overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-bg-surface sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ServiceLogo name={form.name} size={40} color={form.color || '#6C63FF'} />
            <div>
              <h2 className="text-xl font-bold text-text-primary">{isEditing ? 'Edit Subscription' : form.name}</h2>
              {!isEditing && (
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusBadge status={form.status} />
                  <span className="text-xs text-text-muted capitalize">• {form.billing_cycle}</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {isEditing ? (
            <form id="edit-sub-form" onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Service Name *</label>
                  <input className="input" placeholder="Netflix, Spotify..." value={form.name}
                    onChange={e => update('name', e.target.value)} required />
                </div>

                <div>
                  <label className="label">Amount *</label>
                  <div className="relative flex items-center">
                    <span 
                      style={{ 
                        position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', 
                        fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1 
                      }}
                    >
                      {form.currency}
                    </span>
                    <input 
                      className="input" 
                      style={{ paddingLeft: '40px', paddingRight: '48px' }}
                      type="number" 
                      step="0.01" 
                      placeholder="9.99"
                      value={form.amount} 
                      onChange={e => update('amount', e.target.value)} 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => update('currency', form.currency === '₹' ? '$' : '₹')}
                      style={{ 
                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', 
                        padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', 
                        backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', 
                        fontSize: '10px', fontWeight: 800, cursor: 'pointer' 
                      }}
                    >
                      {form.currency === '₹' ? '$' : '₹'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">Billing Cycle</label>
                  <select className="select" value={form.billing_cycle} onChange={e => update('billing_cycle', e.target.value)}>
                    {BILLING_CYCLES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Category</label>
                  <select className="select" value={form.category} onChange={e => update('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={e => update('status', e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="label">Next Renewal Date</label>
                  <input className="input" type="date" value={form.next_renewal_date}
                    onChange={e => update('next_renewal_date', e.target.value)} />
                </div>

                <div className="col-span-2">
                  <label className="label">Cancellation Instructions (optional)</label>
                  <textarea className="input resize-none" rows={2} placeholder="How to cancel? (e.g., Go to Account > Billing)"
                    value={form.cancellation_instructions || ''} onChange={e => update('cancellation_instructions', e.target.value)} />
                </div>

                <div className="col-span-2">
                  <label className="label">Notes (optional)</label>
                  <textarea className="input resize-none" rows={2} placeholder="Any notes..."
                    value={form.notes || ''} onChange={e => update('notes', e.target.value)} />
                </div>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-8 animate-fade-in">
              {/* Main Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="detail-label">Monthly Cost</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {form.currency}{Number(form.amount).toFixed(2)}
                    <span className="text-sm font-medium text-text-muted ml-1">/ {form.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="detail-label">Next Billing</p>
                  <div className="flex items-center justify-end gap-2 text-text-primary text-lg font-semibold">
                    <Calendar size={18} className="text-brand-purple" />
                    {form.next_renewal_date ? format(new Date(form.next_renewal_date), 'MMM d, yyyy') : 'Not set'}
                  </div>
                </div>
              </div>

              <div className="divider border-t border-border opacity-50"></div>

              {/* Details List */}
              <div className="grid grid-cols-2 gap-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0">
                    <Tag size={16} />
                  </div>
                  <div>
                    <p className="detail-label">Category</p>
                    <p className="detail-value">{form.category || 'Uncategorized'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="detail-label">Payment</p>
                    <p className="detail-value">{form.payment_method || 'Default Card'}</p>
                  </div>
                </div>

                {form.notes && (
                  <div className="col-span-2 flex items-start gap-3 pt-2">
                    <div className="w-8 h-8 rounded-lg bg-status-info/10 flex items-center justify-center text-status-info shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="detail-label">Notes</p>
                      <p className="detail-value leading-relaxed text-text-secondary italic">"{form.notes}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cancellation Guide */}
              <div className="p-4 rounded-xl border border-border bg-brand-purple/5 space-y-3">
                <div className="flex items-center gap-2 text-brand-purple font-bold text-sm">
                  <AlertCircle size={16} />
                  Cancellation Guide
                </div>
                {form.cancellation_instructions ? (
                  <p className="text-sm text-text-secondary leading-relaxed bg-bg-surface/50 p-3 rounded-lg border border-border/50">
                    {form.cancellation_instructions}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted italic bg-bg-surface/50 p-3 rounded-lg border border-border/50">
                    No specific instructions provided. Tip: Most subscriptions can be cancelled via the service's "Account Settings" or "Billing" page.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-bg-surface sticky bottom-0">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                form="edit-sub-form"
                type="submit"
                className="btn-primary flex-1 justify-center gap-2"
                disabled={loading}
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={18} />}
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex-1 justify-center gap-2"
              >
                <Pencil size={18} />
                Quick Edit
              </button>
              <button
                onClick={() => onDelete(form)}
                className="btn-danger flex-1 justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
