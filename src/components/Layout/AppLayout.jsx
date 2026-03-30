import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import OnboardingModal from '../OnboardingModal'
import { useState, useEffect } from 'react'
import SubscriptionModal from '../UI/SubscriptionModal'
import { useSubscriptions } from '../../contexts/SubscriptionsContext'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import GlobalSearch from '../GlobalSearch'
import { useIsMobile } from '../../hooks/useIsMobile'
import BottomNav from './BottomNav'
import MobileHeader from './MobileHeader'

export default function AppLayout() {
  const bannerHeight = 0
  const isMobile = useIsMobile()

  // Collapsible sidebar state (desktop only)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isCollapsed)
  }, [isCollapsed])

  // Global "Add Subscription" modal
  const [addOpen, setAddOpen] = useState(false)
  const { addSubscription, subscriptions } = useSubscriptions()
  const { isPro } = useAuth()
  const FREE_LIMIT = 5

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't fire in form fields or rich-text editors
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        setAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    // NOTE: No keepalive needed — Supabase client handles autoRefreshToken internally
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleAdd(data) {
    // Guard against subscriptions being undefined while still loading
    if (!isPro && (subscriptions?.length ?? 0) >= FREE_LIMIT) {
      return toast.error(`Free plan limited to ${FREE_LIMIT} subscriptions. Upgrade to Pro!`)
    }
    try {
      const promise = addSubscription(data)
      toast.promise(promise, {
        loading: 'Saving...',
        success: '✓ Subscription added',
        error: (err) => err.message || 'Failed to add'
      })
      await promise
      setAddOpen(false)
    } catch {
      // toast will handle
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-primary)', overflowX: 'hidden' }}>
      <OnboardingModal />

      {/* ── Mobile Header (top bar + drawer) ── */}
      {isMobile && <MobileHeader />}

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* ── Desktop Sidebar ── */}
        {!isMobile && (
          <div style={{ width: isCollapsed ? 48 : 256, transition: 'width 0.3s ease', flexShrink: 0, zIndex: 50 }}>
            <Sidebar style={{ top: bannerHeight }} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
        )}

        {/* ── Main Content ── */}
        <main style={{
          flex: 1,
          minHeight: '100vh',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative',
        }}>
          <div style={{
            padding: isMobile ? '16px 16px 88px 16px' : '2rem',
            maxWidth: isMobile ? '100%' : '80rem',
            margin: '0 auto',
            animation: 'fadeIn 0.3s ease-in-out',
          }}>
            <Outlet />
          </div>

          {/* ── FAB: Add Subscription ── */}
          <button
            onClick={() => setAddOpen(true)}
            style={{
              position: 'fixed',
              bottom: isMobile ? 76 : 32,
              right: isMobile ? 16 : 32,
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
              color: '#fff',
              padding: isMobile ? '14px' : '12px 20px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
              fontWeight: 700,
              fontSize: 14,
              minWidth: 48,
              minHeight: 48,
            }}
            aria-label="Add Subscription"
          >
            <Plus size={22} />
            {!isMobile && <span>Add Subscription</span>}
          </button>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      {isMobile && <BottomNav />}

      {/* ── Global Modals ── */}
      <SubscriptionModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />
      <GlobalSearch />
    </div>
  )
}
