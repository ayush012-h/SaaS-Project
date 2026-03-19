import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, BarChart3, Bell,
  ScanText, Settings, LogOut, Zap, TrendingUp, Sun, Moon, HelpCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import toast from 'react-hot-toast'
import { useState } from 'react'
import HelpPanel from '../HelpPanel'
import { redirectToCheckout } from '../../lib/razorpay'

import { useUser } from '../../context/UserContext'
import Avatar from '../Avatar'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/scanner', icon: ScanText, label: 'Email Scanner', pro: true },
  { to: '/cancel-guide', icon: HelpCircle, label: 'Cancel Guide', pro: true },
  { to: '/budget', icon: CreditCard, label: 'Budget', pro: true },
  { to: '/yearly-report', icon: BarChart3, label: 'Yearly Report', pro: true },
  { to: '/duplicate-detector', icon: ScanText, label: 'Duplicate Detector', pro: true },
  { to: '/calendar-view', icon: LayoutDashboard, label: 'Calendar View', pro: true },
  { to: '/export', icon: LayoutDashboard, label: 'Export', pro: true },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ style }) {
  const { user, signOut } = useAuth()
  const { profile, isPro } = useUser()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [helpOpen, setHelpOpen] = useState(false)

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login')
    } catch {
      toast.error('Sign out failed')
    }
  }

  return (
    <>
    <aside 
      className="fixed left-0 bottom-0 w-64 bg-bg-surface border-r border-border flex flex-col z-40"
      style={{ top: 0, ...style }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }}>
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <span className="text-text-primary font-bold text-lg tracking-tight">SubTrackr</span>
            <div className="text-xs text-text-muted">Subscription Manager</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, pro }) => (
          <motion.div key={to} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <NavLink
              to={to}
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Icon size={18} />
              <span>{label}</span>
              {pro && !isPro && (
                <span className="ml-auto badge-pro text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))',
                    border: '1px solid rgba(108,99,255,0.4)',
                    color: '#6C63FF',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}>
                  PRO
                </span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Pro Upgrade Banner */}
      {!isPro && (
        <div className="mx-4 mb-4 p-4 rounded-xl border border-brand-purple/30 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(62,207,207,0.05))' }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-brand-purple" />
            <span className="text-xs font-semibold text-text-primary">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-text-muted mb-3">AI insights, unlimited subs & more</p>
          <button 
            onClick={async (e) => {
              const target = e.currentTarget
              target.disabled = true
              target.innerText = 'Connecting...'
              try {
                await redirectToCheckout()
              } finally {
                target.disabled = false
                target.innerText = 'Get Pro — ₹199/mo'
              }
            }}
            className="w-full text-center text-xs font-semibold text-white py-2 rounded-lg transition-opacity hover:opacity-90 cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }}>
            Get Pro — ₹199/mo
          </button>
        </div>
      )}

      {/* User Card */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1E1E2E', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            url={profile?.avatar_url} 
            name={profile?.full_name} 
            size={40} 
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#E8E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              {profile?.full_name || 'User'}
            </div>
            <div style={{ fontSize: '11px', color: '#555570', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              {user?.email}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => navigate('/settings')}
              style={{ background: 'none', border: 'none', color: '#666680', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={handleSignOut}
              style={{ background: 'none', border: 'none', color: '#666680', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
