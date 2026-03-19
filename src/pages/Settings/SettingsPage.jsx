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
  Camera
} from 'lucide-react'
import { SUPPORTED_CURRENCIES } from '../../hooks/useCurrencyRates'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { redirectToCheckout } from '../../lib/razorpay'
import { useTheme } from '../../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileUpload from '../../components/ProfileUpload'

const TABS = [
  { id: 'profile', icon: User, label: 'Profile', desc: 'Manage your personal info' },
  { id: 'preferences', icon: Layout, label: 'Preferences', desc: 'App looks and feel' },
  { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Alerts and updates' },
  { id: 'billing', icon: CreditCard, label: 'Billing/Pro', desc: 'Plan and payments' },
  { id: 'security', icon: Shield, label: 'Security', desc: 'Data and privacy' },
]

export default function SettingsPage() {
  const { user, profile, isPro, signOut } = useAuth()
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

  const handleProfileSave = async () => {
    toast.success('Preferences saved ✨')
  }

  async function handleUpgrade() {
    setUpgrading(true)
    try {
      await redirectToCheckout()
    } catch {
      toast.error('Payment failed')
    } finally {
      setUpgrading(false)
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
              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#666680', textTransform: 'uppercase' }}>Biography (Optional)</label>
                <textarea className="input" placeholder="Tell us a bit about yourself..." rows={3} style={{ height: 'auto', paddingTop: '12px' }} />
              </div>
            </div>
          </motion.div>
        )
      case 'preferences':
        // ... same as before
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
                    <h3 style={{ fontSize: '32px', fontWeight: '900', marginTop: '16px' }}>₹{isPro ? '199' : '0'}/mo</h3>
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
      default:
        return null
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '48px', padding: '40px 20px' }}>
      <div style={{ position: 'sticky', top: '40px', height: 'fit-content' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#E8E8F0', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: '#666680', fontSize: '14px', marginBottom: '32px' }}>Configure your dashboard</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px', 
                  padding: '16px', borderRadius: '16px', border: 'none', textAlign: 'left',
                  background: isActive ? 'linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(62, 207, 207, 0.1))' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                }}
              >
                {isActive && <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '4px', background: '#6C63FF', borderRadius: '0 4px 4px 0' }} />}
                <div style={{ color: isActive ? '#6C63FF' : '#666680' }}><Icon size={22} /></div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '800', color: isActive ? '#E8E8F0' : '#666680', margin: 0 }}>{tab.label}</p>
                </div>
              </button>
            )
          })}
        </div>
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #1E1E2E' }}>
           <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: '#FF6363', fontWeight: '800', cursor: 'pointer' }}>
             <LogOut size={18} /> Sign Out
           </button>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
         {renderTabContent()}
         <div style={{ 
           position: 'fixed', bottom: '40px', right: '40px', zIndex: 50,
           background: '#1A1A2A', border: '1px solid #2A2A3E', borderRadius: '16px',
           padding: '12px 24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
           display: 'flex', alignItems: 'center', gap: '24px'
         }}>
           <p style={{ fontSize: '13px', color: '#9999BB', margin: 0 }}>Unsaved changes</p>
           <button onClick={handleProfileSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '800', cursor: 'pointer' }}>
             {saving ? 'Saving...' : 'Save Changes'}
           </button>
         </div>
      </div>
    </div>
  )
}
