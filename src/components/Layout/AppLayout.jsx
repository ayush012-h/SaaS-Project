import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import OnboardingModal from '../OnboardingModal'
import { useState, useEffect } from 'react'
import SubscriptionModal from '../UI/SubscriptionModal'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useAuth, AuthProvider } from '../../contexts/AuthContext'
import GlobalSearch from '../GlobalSearch'

export default function AppLayout() {
  const bannerHeight = 0 // Removed BetaBanner
  
  // Collapsible sidebar state
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
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        setAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleAdd(data) {
    if (!isPro && subscriptions.length >= FREE_LIMIT) {
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
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <OnboardingModal />
      <div className="flex flex-1 relative">
        <div style={{ width: isCollapsed ? 48 : 256, transition: 'width 0.3s ease' }} className="shrink-0 z-50"> {/* Sidebar placeholder */}
          <Sidebar style={{ top: bannerHeight }} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <main className="flex-1 min-h-screen overflow-auto relative">
          <div className="p-8 max-w-7xl mx-auto animate-fade-in pb-20">
            <Outlet />
          </div>
          
          {/* Global FAB */}
          <button 
            onClick={() => setAddOpen(true)}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-teal text-white p-4 rounded-full shadow-[0_8px_32px_rgba(108,99,255,0.4)] hover:shadow-[0_12px_40px_rgba(108,99,255,0.6)] hover:-translate-y-1 transition-all md:px-6 md:py-3 cursor-pointer border-none"
          >
            <Plus size={24} />
            <span className="hidden md:inline font-bold text-sm">Add Subscription</span>
          </button>
        </main>
      </div>
      
      {/* Global Add Modal */}
      <SubscriptionModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />
      
      {/* Search and Checkout overlay modals */}
      <GlobalSearch />
    </div>
  )
}
