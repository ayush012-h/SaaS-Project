import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, BarChart3, Bell,
  ScanText, Settings, LogOut, Zap, TrendingUp, HelpCircle,
  Menu, ChevronUp, Lock, User as UserIcon, Crown,
  Calendar, FileText, Copy, MessageSquare
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import toast from 'react-hot-toast'
import { useState, useRef, useEffect } from 'react'
import HelpPanel from '../HelpPanel'
import { smartCheckout } from '../../lib/payment'
import Avatar from '../Avatar'

// Main nav — shown to all users
const mainNavItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subscriptions', icon: CreditCard,       label: 'Subscriptions' },
  { to: '/analytics',     icon: BarChart3,        label: 'Analytics' },
  { to: '/alerts',        icon: Bell,             label: 'Alerts' },
  { to: '/settings',      icon: Settings,         label: 'Settings' },
]

// Pro nav — shown in a separate section
const proNavItems = [
  { to: '/scanner',            icon: ScanText,        label: 'Email Scanner' },
  { to: '/cancel-guide',       icon: HelpCircle,      label: 'Cancel Guide' },
  { to: '/budget',             icon: TrendingUp,      label: 'Budget' },
  { to: '/yearly-report',      icon: BarChart3,       label: 'Yearly Report' },
  { to: '/duplicate-detector', icon: Copy,            label: 'Duplicates' },
  { to: '/calendar-view',      icon: Calendar,        label: 'Calendar View' },
  { to: '/export',             icon: FileText,        label: 'Export' },
]

function Tooltip({ children, content, isCollapsed }) {
  const [show, setShow] = useState(false)
  if (!isCollapsed && !content.includes('Upgrade')) return <>{children}</>
  return (
    <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, x: 5 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0 }}
            className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Thin wrapper that shows FeedbackWidget as a centered modal
import FeedbackWidget from '../FeedbackWidget'
function FeedbackModal({ onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
      }}>
        <FeedbackWidget _asModal onModalClose={onClose} />
      </div>
    </>
  )
}

export default function Sidebar({ style, isCollapsed, setIsCollapsed }) {
  const { user, profile, isPro, signOut } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [helpOpen, setHelpOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      className={`fixed left-0 bottom-0 bg-bg-surface border-r border-border flex flex-col z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}
      style={{ top: 0, ...style }}
    >
      {/* Logo & Toggle */}
      <div className={`p-4 border-b border-border flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-purple to-brand-teal shadow-[0_0_15px_rgba(108,99,255,0.4)]">
            <TrendingUp size={16} className="text-white" />
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
              <span className="text-text-primary font-bold text-lg tracking-tight">SubTrackr</span>
            </motion.div>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-1.5 rounded-lg text-text-muted hover:bg-bg-hover transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar overflow-x-hidden" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

        {/* ── Main nav items ── */}
        {mainNavItems.map(({ to, icon: Icon, label }) => (
          <Tooltip key={to} content={label} isCollapsed={isCollapsed}>
            <div>
              <NavLink
                to={to}
                className={({ isActive }) => `flex items-center rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'} ${isActive ? 'bg-brand-purple/10 text-brand-purple font-semibold shadow-[inset_3px_0_0_#6C63FF]' : 'text-text-muted hover:bg-bg-hover hover:text-text-primary'}`}
              >
                <Icon size={isCollapsed ? 20 : 18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </NavLink>
            </div>
          </Tooltip>
        ))}

        {/* ── Pro Features divider ── */}
        {!isCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 4px 6px', marginTop: 4 }}>
            <Crown size={11} style={{ color: '#FFD700', flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#555570', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
              Pro Features
            </span>
            <div style={{ flex: 1, height: 1, background: '#1E1E2E' }} />
          </div>
        ) : (
          <div style={{ margin: '8px 0', display: 'flex', justifyContent: 'center' }}>
            <Crown size={12} style={{ color: '#FFD700', opacity: 0.6 }} />
          </div>
        )}

        {/* ── Pro nav items ── */}
        {proNavItems.map(({ to, icon: Icon, label }) => (
          <Tooltip key={to} content={!isPro ? 'Upgrade to Pro' : label} isCollapsed={isCollapsed}>
            <div>
              <NavLink
                to={to}
                className={({ isActive }) => `flex items-center rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'} ${isActive ? 'bg-brand-purple/10 text-brand-purple font-semibold shadow-[inset_3px_0_0_#6C63FF]' : !isPro ? 'text-text-muted/40 hover:bg-bg-hover/50' : 'text-text-muted hover:bg-bg-hover hover:text-text-primary'}`}
              >
                <Icon size={isCollapsed ? 20 : 18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
                {!isPro && !isCollapsed && (
                  <Lock size={12} className="ml-auto text-brand-purple opacity-60 shrink-0" />
                )}
                {!isPro && isPro && isCollapsed && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_6px_#6C63FF]" />
                )}
              </NavLink>
            </div>
          </Tooltip>
        ))}
      </nav>

      {/* Pro Upgrade Banner */}
      {!isPro && (
        <div className="p-3">
          <Tooltip content="Upgrade to Pro" isCollapsed={isCollapsed}>
            <button 
              onClick={() => smartCheckout().catch(err => toast.error(err.message))}
              className={`w-full flex items-center justify-center gap-2 text-xs font-bold text-white py-2.5 rounded-xl transition-all hover:opacity-90 border-none bg-gradient-to-r from-brand-purple to-brand-teal`}
            >
              <Zap size={16} className="shrink-0" />
              {!isCollapsed && <span className="truncate">Get Pro — ₹49/mo</span>}
            </button>
          </Tooltip>
        </div>
      )}

      {/* User Card */}
      <div className="relative p-3 border-t border-border bg-black/20" ref={menuRef}>
        <div 
          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-bg-hover transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Avatar 
            url={profile?.avatar_url} 
            name={profile?.full_name || user?.email} 
            size={36} 
            isPro={isPro}
          />
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-text-primary truncate">
                  {profile?.full_name || 'User'}
                </div>
                <div className="text-[10px] text-text-muted truncate">
                  {user?.email}
                </div>
              </div>
              <ChevronUp size={16} className={`text-text-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </div>

        {/* User Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute bottom-full mb-2 bg-bg-elevated border border-border rounded-xl shadow-xl py-1 z-50 overflow-hidden ${isCollapsed ? 'left-4 w-48' : 'left-3 right-3'}`}
            >
              {isCollapsed && (
                <div className="px-4 py-3 border-b border-border mb-1">
                  <div className="text-sm font-bold text-text-primary truncate">{profile?.full_name || 'User'}</div>
                  <div className="text-[10px] text-text-muted truncate">{user?.email}</div>
                </div>
              )}
              <button onClick={() => { navigate('/settings'); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-bg-hover transition-colors">
                <UserIcon size={16} /> Profile
              </button>
              <button onClick={() => { navigate('/settings'); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-bg-hover transition-colors">
                <Settings size={16} /> Settings
              </button>
              <button
                onClick={() => { setFeedbackOpen(true); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-bg-hover transition-colors border-b border-border"
              >
                <MessageSquare size={16} style={{ color: '#6C63FF' }} /> Send Feedback
              </button>
              <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-status-danger hover:bg-status-danger/10 transition-colors mt-1">
                <LogOut size={16} /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>

    <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />

    {/* Feedback modal — triggered from user menu */}
    {feedbackOpen && (
      <FeedbackModal onClose={() => setFeedbackOpen(false)} />
    )}
    </>
  )
}
