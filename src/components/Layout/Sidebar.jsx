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

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/scanner', icon: ScanText, label: 'Email Scanner', pro: true },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ style }) {
  const { user, profile, isPro, signOut } = useAuth()
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

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

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
        {/* eslint-disable-next-line no-unused-vars */}
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
          <NavLink to="/settings"
            className="block text-center text-xs font-semibold text-white py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }}>
            Get Pro — $6/mo
          </NavLink>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-primary truncate">
              {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </div>
            <div className={`text-xs font-semibold ${isPro ? 'text-brand-purple' : 'text-text-muted'}`}>
              {isPro ? '⚡ Pro Plan' : 'Free Plan'}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setHelpOpen(true)}
              className="p-2 rounded-lg text-text-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-all duration-200"
              title="Help & FAQ"
            >
              <HelpCircle size={16} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all duration-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-all duration-200"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
