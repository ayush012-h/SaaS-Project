import { useState, useEffect } from 'react'
import { User, Bell, Zap, ExternalLink, Save, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { redirectToCheckout } from '../../lib/razorpay'

export default function SettingsPage() {
  const { user, profile, isPro, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [daysBefore, setDaysBefore] = useState('7')
  const [saving, setSaving] = useState(false)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    document.title = 'Settings — SubTrackr'
  }, [])

  async function handleProfileSave() {
    setSaving(true)
    try {
      const promise = updateProfile({ full_name: fullName })
      toast.promise(promise, {
        loading: 'Saving...',
        success: 'Settings saved',
        error: (err) => err.message || 'Failed to update profile'
      })
      await promise
    } catch (err) {
      // handled
    } finally {
      setSaving(false)
    }
  }

  async function handleUpgrade() {
    setUpgrading(true)
    try {
      await redirectToCheckout()
    } catch (err) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)' }}>
            <User size={18} className="text-brand-purple" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={user?.email || ''} disabled readOnly
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className={`text-sm font-medium px-3 py-1.5 rounded-lg ${isPro ? 'badge-pro' : 'badge-free'}`}
              style={isPro ? { background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))', border: '1px solid rgba(108,99,255,0.4)', color: '#6C63FF' } : {}}>
              {isPro ? '⚡ Pro Plan' : '🆓 Free Plan'}
            </div>
            <button onClick={handleProfileSave} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <Bell size={18} className="text-status-warning" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary text-sm font-medium">Email Renewal Alerts</p>
              <p className="text-text-muted text-xs">Get notified before subscriptions renew</p>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${emailAlerts ? 'bg-brand-purple' : 'bg-border'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${emailAlerts ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div>
            <label className="label">Alert me before renewal</label>
            <select className="select" value={daysBefore} onChange={e => setDaysBefore(e.target.value)}>
              <option value="1">1 day before</option>
              <option value="3">3 days before</option>
              <option value="7">7 days before</option>
              <option value="14">14 days before</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upgrade / Billing */}
      <div className="card" style={{ background: !isPro ? 'radial-gradient(circle at 50% 0%, rgba(108,99,255,0.08), transparent 60%)' : undefined, borderColor: !isPro ? 'rgba(108,99,255,0.2)' : undefined }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))', border: '1px solid rgba(108,99,255,0.4)' }}>
            <Zap size={18} className="text-brand-purple" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Plan & Billing</h2>
        </div>

        {isPro ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-brand-purple/30"
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(62,207,207,0.05))' }}>
              <p className="font-semibold text-text-primary">⚡ Pro Plan — $6/month</p>
              <p className="text-text-muted text-sm mt-1">Unlimited subscriptions, AI insights, email scanner</p>
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <ExternalLink size={16} />
              Manage Billing via Razorpay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {['Unlimited subscriptions', 'AI spending insights', 'Email scanner', 'Priority support'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="text-status-savings font-bold">✓</span> {f}
                </div>
              ))}
            </div>
            <button onClick={handleUpgrade} disabled={upgrading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Zap size={18} />
              {upgrading ? 'Redirecting...' : 'Upgrade to Pro — $6/month'}
            </button>
            <p className="text-text-muted text-xs text-center">Cancel anytime. Secure payment via Razorpay.</p>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card border border-status-danger/20">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} className="text-status-danger" />
          <h2 className="text-base font-semibold text-text-primary">Danger Zone</h2>
        </div>
        <p className="text-text-muted text-sm mb-4">Once you delete your account, there is no going back.</p>
        <button className="btn-danger">Delete Account</button>
      </div>
    </div>
  )
}
