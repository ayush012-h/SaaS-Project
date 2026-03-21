import { useState, useEffect } from 'react'
import { 
  User, 
  Bell, 
  Zap, 
  ExternalLink, 
  Save, 
  Shield, 
  Target, 
  Globe, 
  Layout, 
  Lock, 
  Database, 
  CheckCircle, 
  CreditCard, 
  ChevronRight, 
  LogOut, 
  Settings as SettingsIcon, 
  Check,
  FileText,
  Camera,
  HelpCircle,
  Send         // ← ADDED for newsletter button icon
} from 'lucide-react'
import { SUPPORTED_CURRENCIES } from '../../hooks/useCurrencyRates'
import { useAuth } from '../../contexts/AuthContext'
import { smartCheckout } from '../../lib/payment'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { useTheme } from '../../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileUpload from '../../components/ProfileUpload'
import { sendNewsletterToAllUsers } from '../../lib/emails'  // ← ADDED

const TABS = [
  { id: 'profile', icon: User, label: 'Profile', desc: 'Manage your personal info' },
  { id: 'preferences', icon: Layout, label: 'Preferences', desc: 'App looks and feel' },
  { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Alerts and updates' },
  { id: 'billing', icon: CreditCard, label: 'Billing/Pro', desc: 'Plan and payments' },
  { id: 'security', icon: Shield, label: 'Security', desc: 'Data and privacy' },
  { id: 'faq', icon: HelpCircle, label: 'FAQ', desc: 'Answers to common questions' },
]

// ── YOUR EMAIL — only you see the newsletter section ──────
const FOUNDER_EMAIL = 'ayushkumar00467@gmail.com'

export default function SettingsPage() {
  const { user, profile, isPro, signOut, updateProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  // Form States
  const [monthlyBudget, setMonthlyBudget] = useState(profile?.monthly_budget || '')
  const [displayCurrency, setDisplayCurrency] = useState(profile?.display_currency || 'INR')
  const [emailAlerts, setEmailAlerts] = useState(profile?.preferences?.email_alerts !== false)
  const [pushAlerts, setPushAlerts] = useState(profile?.preferences?.push_alerts !== false)
  const [daysBefore, setDaysBefore] = useState(profile?.preferences?.days_before || '7')
  const [upgrading, setUpgrading] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Profile Editable States
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')

  // ── Newsletter state (founder only) ──────────────────────
  const [newsletterMonth, setNewsletterMonth] = useState('March 2026')
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [newsletterResult, setNewsletterResult] = useState(null)
  const [newsletterFeatures, setNewsletterFeatures] = useState([
    { icon: '📄', title: 'Cancellation Guides', desc: 'Cancel any subscription in 2 minutes with AI' },
    { icon: '💰', title: 'Budget Alerts', desc: 'Set monthly limits and get warned before overspending' },
    { icon: '📅', title: 'Calendar View', desc: 'See all your renewals spread across the month' },
  ])

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  const handleProfileSave = async (field, value) => {
    try {
      await updateProfile({ [field]: value })
      toast.success('Saved ✓', {
        style: {
          background: '#13131F', color: '#fff', border: '1px solid #1E1E2E'
        },
        iconTheme: { primary: '#4CFF8F', secondary: '#13131F' }
      })
    } catch {
      toast.error('Failed to save')
    }
  }

  function handleUpgrade() {
    smartCheckout().catch(err => toast.error(err.message))
  }

  // ── Send newsletter to all users ─────────────────────────
  async function handleSendNewsletter() {
    if (!window.confirm(`Send feature update email to ALL users for ${newsletterMonth}?\n\nThis cannot be undone.`)) return

    setSendingNewsletter(true)
    setNewsletterResult(null)

    try {
      const result = await sendNewsletterToAllUsers('feature_update', {
        month: newsletterMonth,
        features: newsletterFeatures,
      })
      setNewsletterResult(result)
      if (result.success) {
        toast.success(`Newsletter sent to ${result.sent} users!`)
      } else {
        toast.error(`Failed: ${result.error}`)
      }
    } catch (err) {
      toast.error('Newsletter failed: ' + err.message)
    } finally {
      setSendingNewsletter(false)
    }
  }

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <div style={{
          padding: '12px', borderRadius: '14px',
          background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.2)',
          color: '#6C63FF'
        }}>
          <Icon size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#E8E8F0', margin: 0 }}>{title}</h2>
          <p style={{ color: '#9999BB', fontSize: '14px', margin: '4px 0 0 0' }}>{subtitle}</p>
        </div>
      </div>
    </div>
  )

  const Toggle = ({ enabled, setEnabled, label, sublabel }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#13131F', borderRadius: '16px', border: '1px solid #1E1E2E' }}>
      <div>
        <p style={{ color: '#E8E8F0', fontWeight: '700', fontSize: '15px', margin: 0 }}>{label}</p>
        <p style={{ color: '#666680', fontSize: '12px', margin: '4px 0 0 0' }}>{sublabel}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        style={{
          width: '48px', height: '26px', borderRadius: '100px', padding: '3px', cursor: 'pointer', border: 'none',
          backgroundColor: enabled ? '#6C63FF' : '#2A2A3E',
          transition: 'background 0.3s ease', position: 'relative'
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
          transform: `translateX(${enabled ? '22px' : '0'})`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }} />
      </button>
    </div>
  )

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <ProfileUpload />

            <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px' }}>
              <SectionHeader icon={Shield} title="Extended Profile" subtitle="Biography and public info" />
              <div className="space-y-6">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#666680', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Display Name</label>
                  <input
                    className="input w-full"
                    placeholder="E.g., Crypto King, Budget Master..."
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    onBlur={() => {
                      if (displayName !== profile?.display_name) handleProfileSave('display_name', displayName)
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#666680', textTransform: 'uppercase' }}>Biography (Optional)</label>
                    <span className="text-[10px] font-bold text-text-muted">{bio.length}/200</span>
                  </div>
                  <textarea
                    className="input w-full"
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                    style={{ height: 'auto', paddingTop: '12px', resize: 'vertical' }}
                    maxLength={200}
                    value={bio}
                    onChange={e => {
                      if (e.target.value.length <= 200) setBio(e.target.value)
                    }}
                    onBlur={() => {
                      if (bio !== profile?.bio) handleProfileSave('bio', bio)
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── FOUNDER ONLY: Newsletter Section ─────────────── */}
            {user?.email === FOUNDER_EMAIL && (
              <div style={{
                background: 'rgba(108, 99, 255, 0.05)',
                border: '1px solid rgba(108, 99, 255, 0.3)',
                borderRadius: '24px',
                padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    background: 'rgba(255,99,99,0.1)',
                    border: '1px solid rgba(255,99,99,0.3)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#FF6363',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    🔒 Founder Only
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#E8E8F0' }}>
                    Send Newsletter to All Users
                  </span>
                </div>

                {/* Month input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#666680', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Month Label
                  </label>
                  <input
                    className="input w-full"
                    value={newsletterMonth}
                    onChange={e => setNewsletterMonth(e.target.value)}
                    placeholder="e.g. March 2026"
                  />
                </div>

                {/* Features list */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#666680', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
                    Features to Announce ({newsletterFeatures.length})
                  </label>
                  {newsletterFeatures.map((f, i) => (
                    <div key={i} style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 1fr auto',
                      gap: 8,
                      marginBottom: 8,
                      alignItems: 'center',
                    }}>
                      <input
                        className="input"
                        value={f.icon}
                        onChange={e => {
                          const updated = [...newsletterFeatures]
                          updated[i].icon = e.target.value
                          setNewsletterFeatures(updated)
                        }}
                        placeholder="Icon"
                        style={{ textAlign: 'center', fontSize: 20 }}
                      />
                      <input
                        className="input"
                        value={f.title}
                        onChange={e => {
                          const updated = [...newsletterFeatures]
                          updated[i].title = e.target.value
                          setNewsletterFeatures(updated)
                        }}
                        placeholder="Feature title"
                      />
                      <input
                        className="input"
                        value={f.desc}
                        onChange={e => {
                          const updated = [...newsletterFeatures]
                          updated[i].desc = e.target.value
                          setNewsletterFeatures(updated)
                        }}
                        placeholder="Short description"
                      />
                      <button
                        onClick={() => setNewsletterFeatures(newsletterFeatures.filter((_, idx) => idx !== i))}
                        style={{
                          background: 'rgba(255,99,99,0.1)',
                          border: '1px solid rgba(255,99,99,0.2)',
                          borderRadius: 8,
                          color: '#FF6363',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setNewsletterFeatures([...newsletterFeatures, { icon: '✨', title: '', desc: '' }])}
                    style={{
                      background: 'transparent',
                      border: '1px dashed rgba(108,99,255,0.4)',
                      borderRadius: 10,
                      color: '#6C63FF',
                      cursor: 'pointer',
                      padding: '8px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendNewsletter}
                  disabled={sendingNewsletter || newsletterFeatures.length === 0}
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    background: sendingNewsletter
                      ? '#1A1A2A'
                      : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                    border: 'none',
                    borderRadius: 12,
                    color: sendingNewsletter ? '#666' : '#fff',
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: sendingNewsletter ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {sendingNewsletter ? (
                    <>
                      <div style={{
                        width: 16, height: 16,
                        border: '2px solid #444',
                        borderTop: '2px solid #888',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Newsletter to All Users
                    </>
                  )}
                </button>

                {/* Result */}
                {newsletterResult && (
                  <div style={{
                    marginTop: 12,
                    padding: '12px 16px',
                    background: newsletterResult.success ? 'rgba(76,255,143,0.08)' : 'rgba(255,99,99,0.08)',
                    border: `1px solid ${newsletterResult.success ? 'rgba(76,255,143,0.2)' : 'rgba(255,99,99,0.2)'}`,
                    borderRadius: 10,
                    fontSize: 13,
                  }}>
                    {newsletterResult.success ? (
                      <span style={{ color: '#4CFF8F' }}>
                        ✅ Sent to {newsletterResult.sent} users
                        {newsletterResult.failed > 0 && ` · ${newsletterResult.failed} failed`}
                      </span>
                    ) : (
                      <span style={{ color: '#FF6363' }}>
                        ❌ Error: {newsletterResult.error}
                      </span>
                    )}
                  </div>
                )}

                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            )}
            {/* ─────────────────────────────────────────────────── */}

          </motion.div>
        )

      case 'preferences':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <SectionHeader icon={Layout} title="App Preferences" subtitle="Customize your experience" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><Globe size={18} color="#6C63FF" /> Localization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Base Currency</label>
                    <select className="select" value={displayCurrency} onChange={e => setDisplayCurrency(e.target.value)}>
                      {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Monthly Budget Goal</label>
                    <div className="relative">
                      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '900', color: '#666680' }}>₹</span>
                      <input className="input pl-10" value={monthlyBudget} onChange={e => setMonthlyBudget(e.target.value)} type="number" />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><SettingsIcon size={18} color="#3ECFCF" /> Interface</h3>
                <div className="space-y-4">
                  <Toggle enabled={theme === 'dark'} setEnabled={toggleTheme} label="Dark Mode" sublabel="Saves battery on OLED" />
                  <Toggle enabled={true} setEnabled={() => {}} label="Glassmorphism" sublabel="Enable frosted glass effects" />
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <SectionHeader icon={Bell} title="Notifications" subtitle="Stay ahead of renewals" />
            <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px' }} className="space-y-6">
              <Toggle enabled={emailAlerts} setEnabled={setEmailAlerts} label="Email Renewal Alerts" sublabel="Receive detailed info via email" />
              <Toggle enabled={pushAlerts} setEnabled={setPushAlerts} label="Push Notifications" sublabel="Alerts on your browser/phone" />
              <div style={{ paddingTop: '24px', borderTop: '1px solid #1E1E2E' }}>
                <label className="label">Alert Timing</label>
                <select className="select" value={daysBefore} onChange={e => setDaysBefore(e.target.value)}>
                  <option value="1">1 day before</option>
                  <option value="3">3 days before</option>
                  <option value="7">7 days before</option>
                  <option value="14">14 days before</option>
                </select>
              </div>
            </div>
          </motion.div>
        )

      case 'billing':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <SectionHeader icon={CreditCard} title="Billing & Plans" subtitle="Subscription status and invoices" />
            <div style={{
              background: isPro ? 'linear-gradient(135deg, #1A1A2A, #0A0A0F)' : '#13131F',
              borderRadius: '24px', border: isPro ? '2px solid #6C63FF' : '1px solid #1E1E2E',
              padding: '32px', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ background: isPro ? 'rgba(108, 99, 255, 0.1)' : 'rgba(102, 102, 128, 0.1)', color: isPro ? '#6C63FF' : '#666680', fontSize: '11px', fontWeight: '900', padding: '6px 12px', borderRadius: '8px', textTransform: 'uppercase' }}>
                    Current Plan: {isPro ? 'Pro' : 'Free'}
                  </span>
                  <h3 style={{ fontSize: '32px', fontWeight: '900', marginTop: '16px' }}>₹{isPro ? '49' : '0'}/mo</h3>
                  {isPro && <p style={{ color: '#9999BB', fontSize: '14px' }}>Next payment: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
                </div>
                {!isPro && <button onClick={handleUpgrade} disabled={upgrading} className="btn-primary">Upgrade</button>}
              </div>
            </div>
          </motion.div>
        )

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <SectionHeader icon={Shield} title="Security & Data" subtitle="Protect your account and data" />
            <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px' }} className="space-y-8">
              <button className="btn-secondary" style={{ width: '100%' }}>Change Password</button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button className="btn-secondary">Download Export</button>
                <button className="btn-secondary">Clear Cache</button>
              </div>
              <button className="btn-danger" style={{ width: '100%' }}>Delete Account</button>
            </div>
          </motion.div>
        )

      case 'faq':
        const faqs = [
          { q: 'How does SubTrackr track my money?', a: 'SubTrackr calculates your total subscription costs across monthly, yearly, and weekly cycles. You can set a monthly budget to monitor your goals.' },
          { q: 'Is my data secure?', a: 'Yes, we use Supabase (PostgreSQL) with industry-standard encryption. Your bank details are never stored unless you manually enter them.' },
          { q: 'How do I cancel a subscription?', a: 'SubTrackr provides cancellation guides for most popular services in the Cancel Guide section. We don\'t cancel them for you yet, but we show you how.' },
          { q: 'What are the Pro features?', a: 'Pro includes AI spending insights, email scanning, duplicate detection, calendar views, and advanced export options.' },
          { q: 'Can I export my data?', a: 'Yes! Pro users can export their entire subscription history as CSV or PDF for financial audits.' }
        ]
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" subtitle="Quick answers to common doubts" />
            <div className="grid grid-cols-1 gap-4">
              {faqs.map((f, i) => (
                <div key={i} style={{ background: '#13131F', border: '1px solid #1E1E2E', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#E8E8F0', marginBottom: '12px', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#6C63FF' }}>Q.</span> {f.q}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#9999BB', lineHeight: '1.6', margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '24px', background: 'rgba(108, 99, 255, 0.05)', border: '1px dashed rgba(108, 99, 255, 0.3)', borderRadius: '20px', textAlign: 'center' }}>
              <p style={{ color: '#E8E8F0', fontSize: '14px', margin: '0 0 12px 0' }}>Still have questions?</p>
              <button className="btn-secondary" style={{ border: 'none', background: 'white', color: 'black' }}>Contact Support</button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 pb-24 md:pb-12">
      {/* Sidebar Navigation */}
      <div className="md:w-64 shrink-0 flex flex-col">
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
          <p className="text-sm font-medium text-text-muted">Configure your dashboard</p>
        </div>

        {/* Mobile Pills / Desktop List */}
        <div className="flex overflow-x-auto md:flex-col gap-2 pb-4 md:pb-0 mb-6 md:mb-0 snap-x hide-scrollbar">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 md:py-4 rounded-xl border-none text-left cursor-pointer transition-all shrink-0 snap-start relative ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple/15 to-brand-teal/10'
                    : 'bg-transparent hover:bg-bg-hover'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-purple rounded-r-md hidden md:block" />}
                <div className={`${isActive ? 'text-brand-purple' : 'text-text-muted'}`}><Icon size={20} /></div>
                <div>
                  <p className={`text-sm font-bold m-0 ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>{tab.label}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {renderTabContent()}

        {/* Sign Out Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-text-primary">Sign out of your account</h3>
            <p className="text-xs text-text-muted mt-1">You will be required to log back in.</p>
          </div>
          {showLogoutConfirm ? (
            <div className="flex gap-3 animate-fade-in">
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-secondary py-2 px-4 text-sm font-semibold">Cancel</button>
              <button onClick={signOut} className="btn-danger py-2 px-4 text-sm font-semibold flex items-center gap-2">
                <LogOut size={16} /> Confirm
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-transparent border border-border text-status-danger font-bold hover:bg-status-danger/10 hover:border-status-danger/30 transition-all cursor-pointer"
            >
              <LogOut size={18} /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}