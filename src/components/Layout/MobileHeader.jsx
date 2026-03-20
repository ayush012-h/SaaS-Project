import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, TrendingUp, LayoutDashboard, CreditCard, BarChart3,
  Bell, ScanText, Settings, HelpCircle, Zap, Lock, LogOut,
  Crown, Calendar, FileText, Copy
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from '../Avatar'
import { redirectToCheckout } from '../../lib/razorpay'
import toast from 'react-hot-toast'

// ── Page title map ────────────────────────────────────────
const PAGE_TITLES = {
  '/dashboard':          'Dashboard',
  '/subscriptions':      'Subscriptions',
  '/analytics':          'Analytics',
  '/alerts':             'Alerts',
  '/scanner':            'Email Scanner',
  '/cancel-guide':       'Cancel Guide',
  '/budget':             'Budget',
  '/yearly-report':      'Yearly Report',
  '/duplicate-detector': 'Duplicates',
  '/calendar-view':      'Calendar',
  '/export':             'Export',
  '/settings':           'Settings',
}

const MAIN_NAV = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subscriptions', icon: CreditCard,       label: 'Subscriptions' },
  { to: '/analytics',     icon: BarChart3,        label: 'Analytics' },
  { to: '/alerts',        icon: Bell,             label: 'Alerts' },
  { to: '/scanner',       icon: ScanText,         label: 'Email Scanner', pro: true },
  { to: '/settings',      icon: Settings,         label: 'Settings' },
]

const PRO_NAV = [
  { to: '/cancel-guide',       icon: HelpCircle, label: 'Cancel Guide' },
  { to: '/budget',             icon: TrendingUp, label: 'Budget' },
  { to: '/yearly-report',      icon: BarChart3,  label: 'Yearly Report' },
  { to: '/duplicate-detector', icon: Copy,       label: 'Duplicates' },
  { to: '/calendar-view',      icon: Calendar,   label: 'Calendar View' },
  { to: '/export',             icon: FileText,   label: 'Export' },
]

// ── NavItem defined OUTSIDE component ────────────────────
// This is the fix — defining inside caused re-creation on
// every render which crashed React Router's NavLink
function NavItem({ to, icon: Icon, label, pro, isPro, pathname, onClose }) {
  const isActive = pathname === to
  const locked = pro && !isPro

  return (
    <NavLink
      to={to}
      onClick={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 16px',
        borderRadius: 12,
        textDecoration: 'none',
        color: isActive ? '#6C63FF' : locked ? '#444460' : '#9999BB',
        background: isActive ? 'rgba(108,99,255,0.1)' : 'transparent',
        fontWeight: isActive ? 700 : 500,
        fontSize: 14,
        transition: 'all 0.15s',
        marginBottom: 2,
        borderLeft: isActive ? '3px solid #6C63FF' : '3px solid transparent',
      }}
    >
      <Icon
        size={18}
        style={{
          flexShrink: 0,
          color: isActive ? '#6C63FF' : locked ? '#333348' : '#666680',
        }}
      />
      <span style={{ flex: 1 }}>{label}</span>
      {locked && (
        <Lock size={12} style={{ color: '#6C63FF', opacity: 0.6 }} />
      )}
      {pro && isPro && (
        <span style={{
          fontSize: 9, fontWeight: 800, color: '#FFD700',
          background: 'rgba(255,215,0,0.1)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: 4, padding: '2px 5px',
          letterSpacing: '0.05em',
        }}>
          PRO
        </span>
      )}
    </NavLink>
  )
}

// ── Main Component ────────────────────────────────────────
export default function MobileHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, isPro, signOut } = useAuth()

  const currentTitle = PAGE_TITLES[location.pathname] || 'SubTrackr'

  function closeDrawer() {
    setDrawerOpen(false)
  }

  async function handleSignOut() {
    try {
      await signOut()
      closeDrawer()
      navigate('/login')
    } catch {
      toast.error('Sign out failed')
    }
  }

  return (
    <>
      {/* ── Sticky Mobile Header ─────────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: 'rgba(15,15,26,0.96)',
        borderBottom: '1px solid #1E1E2E',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 900,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(108,99,255,0.4)',
          }}>
            <TrendingUp size={14} color="#fff" />
          </div>
          <span style={{
            fontSize: 15, fontWeight: 800,
            color: '#E8E8F0', letterSpacing: '-0.3px',
          }}>
            SubTrackr
          </span>
        </div>

        {/* Current page title — centered */}
        <span style={{
          fontSize: 14, fontWeight: 700, color: '#9999BB',
          position: 'absolute', left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          {currentTitle}
        </span>

        {/* Hamburger button */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #1E1E2E',
            borderRadius: 10,
            width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#9999BB',
          }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ── Drawer + Backdrop ────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1100,
              }}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer-panel"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{
                type: 'spring',
                damping: 26,
                stiffness: 300,
              }}
              style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: 280,
                background: '#0F0F1A',
                borderRight: '1px solid #1E1E2E',
                boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1200,
                overflowY: 'auto',
              }}
            >
              {/* Drawer Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 16px 12px',
                borderBottom: '1px solid #1E1E2E',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 14px rgba(108,99,255,0.4)',
                  }}>
                    <TrendingUp size={16} color="#fff" />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#E8E8F0' }}>
                    SubTrackr
                  </span>
                </div>
                <button
                  onClick={closeDrawer}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid #1E1E2E',
                    borderRadius: 8,
                    width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#666680',
                  }}
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              {/* User Profile */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid #1E1E2E',
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(108,99,255,0.03)',
              }}>
                <Avatar
                  url={profile?.avatar_url}
                  name={profile?.full_name || user?.email}
                  size={40}
                  isPro={isPro}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: '#E8E8F0', marginBottom: 2,
                  }}>
                    {profile?.full_name || 'User'}
                  </div>
                  <div style={{
                    fontSize: 11, color: '#666680',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {user?.email}
                  </div>
                </div>
                {isPro ? (
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: '#FFD700',
                    background: 'rgba(255,215,0,0.12)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    borderRadius: 6, padding: '3px 8px',
                  }}>PRO</span>
                ) : (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#666680',
                    background: '#1A1A2A', border: '1px solid #1E1E2E',
                    borderRadius: 6, padding: '3px 8px',
                  }}>FREE</span>
                )}
              </div>

              {/* Nav Content */}
              <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>

                {/* Main nav items */}
                <div style={{ marginBottom: 8 }}>
                  {MAIN_NAV.map(item => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      pro={item.pro}
                      isPro={isPro}
                      pathname={location.pathname}
                      onClose={closeDrawer}
                    />
                  ))}
                </div>

                {/* Pro section divider */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 4px', marginBottom: 4,
                }}>
                  <Crown size={12} style={{ color: '#FFD700' }} />
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: '#666680',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    Pro Features
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#1E1E2E' }} />
                </div>

                {/* Pro nav items */}
                {PRO_NAV.map(item => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    pro={true}
                    isPro={isPro}
                    pathname={location.pathname}
                    onClose={closeDrawer}
                  />
                ))}

                {/* Upgrade button for free users */}
                {!isPro && (
                  <button
                    onClick={() => { redirectToCheckout(); closeDrawer() }}
                    style={{
                      width: '100%', marginTop: 16, padding: '12px 0',
                      background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                      border: 'none', borderRadius: 12,
                      color: '#fff', fontWeight: 800, fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8,
                      boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
                    }}
                  >
                    <Zap size={16} /> Get Pro — ₹499/mo
                  </button>
                )}
              </div>

              {/* Sign out footer */}
              <div style={{ padding: '12px', borderTop: '1px solid #1E1E2E' }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%', padding: '11px 16px',
                    background: 'rgba(255,99,99,0.06)',
                    border: '1px solid rgba(255,99,99,0.2)',
                    borderRadius: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    color: '#FF6363', fontWeight: 700, fontSize: 14,
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}