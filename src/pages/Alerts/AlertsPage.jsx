import { useState, useEffect } from 'react'
import { Bell, Clock, X, BookOpen, ChevronRight, Loader2, BellOff, ArrowLeft } from 'lucide-react'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { format } from 'date-fns'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { SkeletonSubscriptionRow } from '../../components/Skeleton'
import { ServiceLogo } from '../../lib/logos'
import { EmptyAlerts } from '../../components/EmptyState'

export default function AlertsPage() {
  const { upcomingRenewals, snoozedSubscriptions, snoozeSubscription, unsnoozeSubscription, loading } = useSubscriptions()
  const [guideOpen, setGuideOpen] = useState(null)
  const [guide, setGuide] = useState('')
  const [guideLoading, setGuideLoading] = useState(false)
  const [showSnoozed, setShowSnoozed] = useState(false)

  useEffect(() => {
    document.title = 'Renewal Alerts — SubTrackr'
  }, [])

  async function handleSnooze(id) {
    try {
      await snoozeSubscription(id, 7)
      toast.success('Alert snoozed for 7 days')
    } catch (err) {
      toast.error('Failed to snooze alert')
    }
  }

  async function handleUnsnooze(id) {
    try {
      await unsnoozeSubscription(id)
      toast.success('Alert unsnoozed')
    } catch (err) {
      toast.error('Failed to unsnooze')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div style={{ height: '32px', width: '200px', backgroundColor: '#1A1A2A', borderRadius: '8px', marginBottom: '32px' }} className="animate-pulse" />
        {[...Array(5)].map((_, i) => <SkeletonSubscriptionRow key={i} />)}
      </div>
    )
  }

  async function openCancelGuide(sub) {
    setGuideOpen(sub)
    setGuide('')
    setGuideLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-cancel-guide', {
        body: { service_name: sub.name }
      })
      if (error) throw error
      setGuide(data.guide || 'No guide available.')
    } catch {
      setGuide(`To cancel ${sub.name}:\n1. Log in to your account at ${sub.name.toLowerCase().replace(/\s+/g, '')}.com\n2. Go to Account Settings or Billing\n3. Find the Subscription or Plan section\n4. Click "Cancel Subscription" or "Cancel Plan"\n5. Follow the confirmation prompts\n6. Check your email for a confirmation\n\nNote: Some services require you to cancel before the renewal date to avoid charges.`)
    } finally {
      setGuideLoading(false)
    }
  }

  function getDaysColor(days) {
    if (days <= 2) return 'text-status-danger'
    if (days <= 7) return 'text-status-warning'
    return 'text-text-secondary'
  }

  function getDaysBg(days) {
    if (days <= 2) return 'bg-status-danger/10 border-status-danger/30'
    if (days <= 7) return 'bg-status-warning/10 border-status-warning/30'
    return 'bg-bg-elevated border-border'
  }

  if (showSnoozed) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => setShowSnoozed(false)}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-all mb-2"
            >
              <ArrowLeft size={16} />
              Back to Alerts
            </button>
            <h1 className="text-3xl font-bold text-text-primary">Snoozed Alerts</h1>
            <p className="text-text-muted mt-1">Subscriptions you've temporarily hidden</p>
          </div>
        </div>

        {snoozedSubscriptions.length === 0 ? (
          <div className="card text-center py-16">
            <Bell size={48} className="mx-auto mb-4 text-text-muted opacity-20" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No snoozed alerts</h3>
            <p className="text-text-muted">You haven't snoozed any renewal alerts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {snoozedSubscriptions.map(sub => (
              <div key={sub.id} className="card flex items-center gap-4 border-dashed opacity-80 transition-all hover:opacity-100">
                <ServiceLogo name={sub.name} size={48} color={sub.color || '#6C63FF'} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary">{sub.name}</h3>
                  <p className="text-text-muted text-sm">
                    Snoozed until {format(new Date(sub.snoozed_until), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => handleUnsnooze(sub.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:underline px-4 py-2 border border-brand-purple/30 rounded-lg hover:bg-brand-purple/5"
                >
                  <Bell size={14} />
                  Unsnooze
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Renewal Alerts</h1>
          <p className="text-text-muted mt-1">Subscriptions renewing in the next 30 days</p>
        </div>
        {snoozedSubscriptions.length > 0 && (
          <button 
            onClick={() => setShowSnoozed(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated border border-border hover:border-brand-purple/40 text-text-secondary hover:text-brand-purple transition-all"
          >
            <BellOff size={18} />
            <span className="font-semibold">Snoozed ({snoozedSubscriptions.length})</span>
          </button>
        )}
      </div>

      {upcomingRenewals.length === 0 ? (
        <EmptyAlerts />
      ) : (
        <div className="space-y-4">
          {upcomingRenewals.map(sub => {
            const daysLeft = Math.ceil((new Date(sub.next_renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
            return (
              <div key={sub.id} className="card flex items-center gap-4 hover:border-border-light transition-all duration-200">
                {/* Icon */}
                <ServiceLogo name={sub.name} size={48} color={sub.color || '#6C63FF'} />
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary">{sub.name}</h3>
                    {daysLeft <= 3 && (
                      <span className="text-xs font-bold text-status-danger bg-status-danger/10 px-2 py-0.5 rounded-full border border-status-danger/30">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-text-muted text-sm">
                    {sub.currency || '₹'}{Number(sub.amount).toFixed(2)}/{sub.billing_cycle} · Renews {format(new Date(sub.next_renewal_date), 'MMMM d, yyyy')}
                  </p>
                </div>

                {/* Days left */}
                <div className={`rounded-xl px-4 py-2 border text-center shrink-0 ${getDaysBg(daysLeft)}`}>
                  <p className={`text-2xl font-bold ${getDaysColor(daysLeft)}`}>
                    {daysLeft <= 0 ? '!' : daysLeft}
                  </p>
                  <p className="text-xs text-text-muted">{daysLeft <= 0 ? 'today' : 'days'}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openCancelGuide(sub)}
                    className="flex items-center gap-1.5 text-xs font-medium text-brand-purple hover:underline px-3 py-2 rounded-lg hover:bg-brand-purple/10 transition-all">
                    <BookOpen size={14} />
                    Cancel Guide
                  </button>
                  <button
                    onClick={() => handleSnooze(sub.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary px-3 py-2 rounded-lg hover:bg-bg-elevated transition-all">
                    <Clock size={14} />
                    Snooze
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Guide Modal */}
      {guideOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setGuideOpen(null)}>
          <div className="modal-content">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-brand-purple" />
                <h2 className="text-xl font-bold text-text-primary">
                  How to Cancel {guideOpen.name}
                </h2>
              </div>
              <button onClick={() => setGuideOpen(null)} className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {guideLoading ? (
                <div className="flex items-center justify-center py-12 gap-3 text-text-muted">
                  <Loader2 size={20} className="animate-spin" />
                  Generating guide...
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-text-secondary font-sans leading-relaxed bg-bg-elevated rounded-xl p-4 border border-border">
                    {guide}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
