import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, BarChart3, Bell,
  ScanText, Settings, LogOut, Zap, TrendingUp, HelpCircle,
  Menu, ChevronUp, Lock, User as UserIcon, Crown,
  Calendar, FileText, Copy, MessageSquare, Sun, Moon
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
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/subscriptions', label: 'My Subscriptions', icon: CreditCard },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings#billing', label: 'Payment Methods', icon: Zap },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login')
    } catch {
      toast.error('Sign out failed')
    }
  }

  return (
    <aside 
      className={`fixed left-0 bottom-0 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex flex-col z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}
      style={{ top: 0, ...style }}
    >
      {/* 1. TOP PROFILE SNIPPET */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar 
            url={profile?.avatar_url} 
            name={profile?.full_name || user?.email} 
            size={isCollapsed ? 32 : 40} 
            isPro={profile?.plan === 'pro'}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[var(--text-primary)] truncate">
                {profile?.full_name || 'User'}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-xl transition-all duration-200 
              ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'} 
              ${isActive 
                ? 'bg-gradient-to-r from-[var(--brand-purple)]/20 to-[var(--brand-teal)]/10 text-[var(--text-primary)] font-bold border-l-4 border-[var(--brand-purple)] shadow-sm' 
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            <Icon size={isCollapsed ? 20 : 18} />
            {!isCollapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        {/* LOG OUT LINK */}
        <button
          onClick={handleSignOut}
          className={`
            w-full flex items-center gap-3 rounded-xl text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-all
            ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
          `}
        >
          <LogOut size={isCollapsed ? 20 : 18} />
          {!isCollapsed && <span className="font-medium">Log Out</span>}
        </button>
      </nav>

      {/* FOOTER TOGGLE */}
      <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
        {!isCollapsed && (
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-auto transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>
    </aside>
  )
}
