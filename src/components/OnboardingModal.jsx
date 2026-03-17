import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscriptions } from '../hooks/useSubscriptions'

const ONBOARDING_KEY = 'onboarded'

const QUICK_ADD_SERVICES = [
  { name: 'Netflix',         category: 'Entertainment', amount: 649,  billing_cycle: 'monthly', color: '#E50914' },
  { name: 'Spotify',         category: 'Music',         amount: 119,  billing_cycle: 'monthly', color: '#1DB954' },
  { name: 'YouTube Premium', category: 'Entertainment', amount: 129,  billing_cycle: 'monthly', color: '#FF0000' },
  { name: 'Amazon Prime',    category: 'Shopping',      amount: 299,  billing_cycle: 'monthly', color: '#FF9900' },
  { name: 'Disney+ Hotstar', category: 'Entertainment', amount: 299,  billing_cycle: 'monthly', color: '#0063E5' },
  { name: 'Adobe CC',        category: 'Productivity',  amount: 1675, billing_cycle: 'monthly', color: '#FF0000' },
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
  const { addSubscription, monthlyTotal } = useSubscriptions()
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
    } catch (_) { /* silently ignore */ }
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
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
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
              borderRadius: 20,
              width: '100%',
              maxWidth: 480,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Top gradient bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #6C63FF, #3ECFCF)' }} />

            {/* Step indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '20px 24px 0' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{
                  height: 4, flex: 1, maxWidth: 60, borderRadius: 4,
                  background: s <= step ? 'linear-gradient(90deg, #6C63FF, #3ECFCF)' : '#1E1E2E',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px 0' }}>
              <button onClick={dismiss} style={{ background: 'none', border: 'none', color: '#666680', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Step content */}
            <div style={{ padding: '8px 28px 28px' }}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
                    <h2 style={{ color: '#E8E8F0', fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>Welcome to SubTrackr!</h2>
                    <p style={{ color: '#666680', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' }}>
                      SubTrackr helps you <strong style={{ color: '#A8A8C0' }}>track all your subscriptions</strong> in one place — so you never get blindsided by a charge again. Get renewal alerts, AI insights, and see exactly how much you spend each month.
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      style={{
                        width: '100%', padding: '13px', border: 'none', borderRadius: 12,
                        background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                        color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      Get started <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>⚡</div>
                    <h2 style={{ color: '#E8E8F0', fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Add your first subscriptions</h2>
                    <p style={{ color: '#666680', fontSize: 13, margin: '0 0 18px' }}>Tap one-click to add popular services, or skip to add them manually later.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                      {QUICK_ADD_SERVICES.map(service => {
                        const isAdded = added.includes(service.name)
                        const isLoading = adding === service.name
                        return (
                          <button
                            key={service.name}
                            onClick={() => handleQuickAdd(service)}
                            disabled={isAdded || isLoading}
                            style={{
                              padding: '10px 12px',
                              border: `1px solid ${isAdded ? service.color + '60' : '#2A2A3A'}`,
                              borderRadius: 10,
                              background: isAdded ? service.color + '15' : '#0A0A0F',
                              color: '#E8E8F0',
                              cursor: isAdded ? 'default' : 'pointer',
                              display: 'flex', alignItems: 'center', gap: 8,
                              fontSize: 13, fontWeight: 600, textAlign: 'left',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: service.color, flexShrink: 0 }} />
                            <span style={{ flex: 1 }}>{service.name}</span>
                            {isAdded
                              ? <CheckCircle2 size={14} style={{ color: '#4CFF8F', flexShrink: 0 }} />
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
                        width: '100%', padding: '13px', border: 'none', borderRadius: 12,
                        background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                        color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {added.length > 0 ? `Continue with ${added.length} added` : 'Skip for now'} <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                    <h2 style={{ color: '#E8E8F0', fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>You're all set!</h2>
                    {added.length > 0 ? (
                      <div style={{ background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
                        <p style={{ color: '#666680', fontSize: 12, margin: '0 0 4px' }}>Subscriptions tracked</p>
                        <p style={{ color: '#E8E8F0', fontSize: 28, fontWeight: 800, margin: 0 }}>
                          {added.length} <span style={{ fontSize: 14, fontWeight: 500, color: '#666680' }}>services added</span>
                        </p>
                      </div>
                    ) : (
                      <p style={{ color: '#666680', fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' }}>
                        Head to <strong style={{ color: '#A8A8C0' }}>My Subscriptions</strong> to start adding your services. Set up renewal alerts so you're never caught off-guard!
                      </p>
                    )}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(62,207,207,0.06))',
                      border: '1px solid rgba(108,99,255,0.25)',
                      borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <Sparkles size={16} style={{ color: '#6C63FF', flexShrink: 0 }} />
                      <p style={{ color: '#A8A8C0', fontSize: 13, margin: 0 }}>
                        <strong style={{ color: '#E8E8F0' }}>Pro tip:</strong> Upgrade to Pro to scan your Gmail for hidden subscriptions automatically.
                      </p>
                    </div>
                    <button
                      onClick={dismiss}
                      style={{
                        width: '100%', padding: '13px', border: 'none', borderRadius: 12,
                        background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                        color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                      }}
                    >
                      Go to Dashboard 🚀
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
