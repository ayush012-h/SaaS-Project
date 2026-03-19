import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ChevronRight, Sparkles, LayoutDashboard, CreditCard, PieChart, Mail, Bell, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscriptions } from '../hooks/useSubscriptions'

const ONBOARDING_KEY = 'onboarded_v2'

const QUICK_ADD_SERVICES = [
  { name: 'Netflix',         category: 'Entertainment', amount: 649,  billing_cycle: 'monthly', color: '#E50914' },
  { name: 'Spotify',         category: 'Music',         amount: 119,  billing_cycle: 'monthly', color: '#1DB954' },
  { name: 'YouTube Premium', category: 'Entertainment', amount: 129,  billing_cycle: 'monthly', color: '#FF0000' },
  { name: 'Amazon Prime',    category: 'Shopping',      amount: 299,  billing_cycle: 'monthly', color: '#FF9900' },
  { name: 'Disney+ Hotstar', category: 'Entertainment', amount: 299,  billing_cycle: 'monthly', color: '#0063E5' },
  { name: 'Adobe CC',        category: 'Productivity',  amount: 1675, billing_cycle: 'monthly', color: '#FF0000' },
]

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview of your spending & alerts' },
  { icon: CreditCard, label: 'Subscriptions', desc: 'Manage & add your active services' },
  { icon: PieChart, label: 'Analytics', desc: 'Deep dive into spending patterns' },
  { icon: Mail, label: 'Email Scanner', desc: 'Find hidden subs in your inbox (Pro)' },
]

const overlayVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1 },
}
const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  show:   { opacity: 1, scale: 1,    y: 0, transition: { type: 'spring', damping: 22, stiffness: 300 } },
  exit:   { opacity: 0, scale: 0.96, y: 10 },
}

export default function OnboardingModal() {
  const { session } = useAuth()
  const { addSubscription } = useSubscriptions()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [added, setAdded] = useState([])
  const [adding, setAdding] = useState(null)

  // Show only for logged-in users who haven't onboarded
  useEffect(() => {
    if (session && !localStorage.getItem(ONBOARDING_KEY)) {
      // Small delay so the dashboard loads first
      const t = setTimeout(() => setOpen(true), 800)
      return () => clearTimeout(t)
    }
  }, [session])

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setOpen(false)
  }

  async function handleQuickAdd(service) {
    if (added.includes(service.name)) return
    setAdding(service.name)
    try {
      await addSubscription({
        name: service.name,
        category: service.category,
        amount: service.amount,
        billing_cycle: service.billing_cycle,
        color: service.color,
        status: 'active',
        currency: '₹',
      })
      setAdded(prev => [...prev, service.name])
    } catch { /* silently ignore */ }
    finally { setAdding(null) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="onboarding-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            key="onboarding-modal"
            variants={modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              background: '#13131F',
              border: '1px solid #1E1E2E',
              borderRadius: 24,
              width: '100%',
              maxWidth: 500,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Top gradient bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #6C63FF, #3ECFCF)' }} />

            {/* Step indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '24px 24px 0' }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{
                  height: 4, flex: 1, maxWidth: 60, borderRadius: 4,
                  background: s <= step ? 'linear-gradient(90deg, #6C63FF, #3ECFCF)' : '#1E1E2E',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px 0' }}>
              <button onClick={dismiss} style={{ background: 'none', border: 'none', color: '#666680', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8 }}>
                <X size={20} />
              </button>
            </div>

            {/* Step content */}
            <div style={{ padding: '0 32px 32px' }}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>👋</div>
                    <h2 style={{ color: '#E8E8F0', fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>Welcome to SubTrackr!</h2>
                    <p style={{ color: '#9494B8', fontSize: 15, lineHeight: 1.7, margin: '0 0 28px' }}>
                      Ready to take control of your subscriptions? SubTrackr helps you <strong style={{ color: '#fff' }}>save money</strong> by tracking every recurring charge in one beautiful place.
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="group"
                      style={{
                        width: '100%', padding: '16px', border: 'none', borderRadius: 14,
                        background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                        color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 8px 32px rgba(108, 99, 255, 0.3)',
                      }}
                    >
                      Show me around <ChevronRight size={20} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ padding: 10, borderRadius: 12, background: 'rgba(62, 207, 207, 0.1)' }}>
                        <CreditCard size={24} style={{ color: '#3ECFCF' }} />
                      </div>
                      <h2 style={{ color: '#E8E8F0', fontSize: 20, fontWeight: 800, margin: 0 }}>Add your first subs</h2>
                    </div>
                    <p style={{ color: '#9494B8', fontSize: 14, margin: '0 0 20px' }}>Tap any popular service below to add it instantly to your dashboard.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                      {QUICK_ADD_SERVICES.map(service => {
                        const isAdded = added.includes(service.name)
                        const isLoading = adding === service.name
                        return (
                          <button
                            key={service.name}
                            onClick={() => handleQuickAdd(service)}
                            disabled={isAdded || isLoading}
                            style={{
                              padding: '12px',
                              border: `1px solid ${isAdded ? service.color + '60' : '#2A2A3A'}`,
                              borderRadius: 12,
                              background: isAdded ? service.color + '10' : '#0A0A0F',
                              color: '#E8E8F0',
                              cursor: isAdded ? 'default' : 'pointer',
                              display: 'flex', alignItems: 'center', gap: 10,
                              fontSize: 13, fontWeight: 600, textAlign: 'left',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: service.color, flexShrink: 0 }} />
                            <span style={{ flex: 1 }}>{service.name}</span>
                            {isAdded
                              ? <CheckCircle2 size={16} style={{ color: '#4CFF8F', flexShrink: 0 }} />
                              : isLoading
                              ? <div style={{ width: 14, height: 14, border: '2px solid #666', borderTopColor: '#6C63FF', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                              : <span style={{ color: '#666680', fontSize: 11 }}>₹{service.amount}</span>
                            }
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 14,
                        background: '#1E1E2E', border: '1px solid #2A2A3A',
                        color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {added.length > 0 ? `Continue with ${added.length} added` : 'Skip for now'} <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ padding: 10, borderRadius: 12, background: 'rgba(108, 99, 255, 0.1)' }}>
                        <LayoutDashboard size={24} style={{ color: '#6C63FF' }} />
                      </div>
                      <h2 style={{ color: '#E8E8F0', fontSize: 20, fontWeight: 800, margin: 0 }}>How to navigate</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                      {NAV_ITEMS.map((item, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', alignItems: 'center', gap: 16, 
                          padding: 14, borderRadius: 16, background: '#0A0A0F', 
                          border: '1px solid #1E1E2E' 
                        }}>
                          <div style={{ color: '#666680' }}><item.icon size={20} /></div>
                          <div>
                            <p style={{ color: '#E8E8F0', fontSize: 14, fontWeight: 700, margin: 0 }}>{item.label}</p>
                            <p style={{ color: '#666680', fontSize: 12, margin: 0 }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(4)}
                      style={{
                        width: '100%', padding: '16px', border: 'none', borderRadius: 14,
                        background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                        color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      Got it, what's next? <ChevronRight size={20} />
                    </button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
                    <h2 style={{ color: '#E8E8F0', fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>You're ready!</h2>
                    <p style={{ color: '#9494B8', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
                      Everything is set up. You can now track spending, set reminders, and find savings.
                    </p>
                    
                    <div style={{
                      background: 'rgba(108, 99, 255, 0.05)',
                      border: '1px solid rgba(108, 99, 255, 0.2)',
                      borderRadius: 16, padding: '16px', marginBottom: 28,
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                      <div style={{ padding: 6, borderRadius: 8, background: 'rgba(108, 99, 255, 0.1)', flexShrink: 0 }}>
                        <Sparkles size={16} style={{ color: '#6C63FF' }} />
                      </div>
                      <div>
                        <p style={{ color: '#A8A8C0', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                          <strong style={{ color: '#E8E8F0' }}>Pro Tip:</strong> Link your Gmail to automatically scan for hidden subscriptions you might have forgotten about.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={dismiss}
                      style={{
                        width: '100%', padding: '16px', border: 'none', borderRadius: 14,
                        background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                        color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(62, 207, 207, 0.3)',
                      }}
                    >
                      Start Tracking Now 🚀
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
