import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, BarChart2, Bell, Settings } from 'lucide-react'

const BOTTOM_NAV_ITEMS = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Home'    },
  { to: '/subscriptions',  icon: CreditCard,      label: 'Subs'    },
  { to: '/analytics',      icon: BarChart2,       label: 'Analytics' },
  { to: '/alerts',         icon: Bell,            label: 'Alerts'  },
  { to: '/settings',       icon: Settings,        label: 'Settings' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: 'rgba(15, 15, 26, 0.96)',
        borderTop: '1px solid #1E1E2E',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {BOTTOM_NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to ||
          (to !== '/dashboard' && location.pathname.startsWith(to))

        return (
          <NavLink
            key={to}
            to={to}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textDecoration: 'none',
              color: isActive ? '#6C63FF' : '#555570',
              background: isActive ? 'rgba(108,99,255,0.08)' : 'transparent',
              borderRadius: 12,
              margin: '6px 4px',
              minHeight: 48,
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Active dot indicator */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                boxShadow: '0 0 6px rgba(108,99,255,0.8)',
              }} />
            )}
            <Icon
              size={22}
              style={{
                color: isActive ? '#6C63FF' : '#555570',
                strokeWidth: isActive ? 2.5 : 1.8,
                transition: 'all 0.2s',
              }}
            />
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: isActive ? '#6C63FF' : '#555570',
              letterSpacing: '0.01em',
              lineHeight: 1,
            }}>
              {label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
