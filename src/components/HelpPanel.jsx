import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

const FAQS = [
  {
    q: 'How do I add a subscription?',
    a: 'Go to "My Subscriptions" and click "Add Subscription". Fill in the service name, amount, billing cycle, and renewal date. You can also use the Email Scanner (Pro) to auto-detect them from your emails.',
  },
  {
    q: 'How does AI detection work?',
    a: 'The Email Scanner uses GPT-4o-mini to analyse text you paste from your Gmail or bank statements. It extracts service names, amounts, and billing cycles — then lets you add them in one click. No email access is requested; you paste the text yourself.',
  },
  {
    q: 'How do I cancel my Pro plan?',
    a: 'Go to Settings → Plan & Billing → "Manage Billing via Razorpay". From there you can cancel your subscription. You\'ll keep Pro access until the end of your billing period.',
  },
  {
    q: 'Is my bank data safe?',
    a: 'Yes. SubTrackr never connects to your bank directly. When you use the Email Scanner, you paste text manually — it is sent to OpenAI for processing and never stored on our servers.',
  },
  {
    q: 'How do renewal alerts work?',
    a: 'When you add a subscription with a renewal date, SubTrackr tracks it and shows upcoming renewals in the Alerts tab. Subscriptions renewing within 7 days are highlighted. You can also snooze alerts for 7 days.',
  },
  {
    q: 'What is the free plan limit?',
    a: 'The free plan lets you track up to 5 subscriptions. Upgrade to Pro (₹199/month) for unlimited subscriptions, AI insights, and the email scanner.',
  },
]

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '11px 0', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#C8C8E0', lineHeight: 1.4 }}>
          {faq.q}
        </span>
        {open
          ? <ChevronUp size={14} style={{ color: '#6C63FF', flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: '#666680', flexShrink: 0 }} />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontSize: 12, color: '#888898', lineHeight: 1.6, paddingBottom: 10, margin: 0 }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPanel({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="help-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 49,
              background: 'rgba(0,0,0,0.4)',
            }}
          />

          {/* Panel — slides in from the left, attached to sidebar */}
          <motion.div
            key="help-panel"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 256, opacity: 1 }}   // 256px = sidebar width (w-64)
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            style={{
              position: 'fixed', left: 0, top: 0, bottom: 0,
              width: 300, zIndex: 50,
              background: '#13131F',
              borderRight: '1px solid #1E1E2E',
              boxShadow: '4px 0 32px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 20px 16px',
              borderBottom: '1px solid #1E1E2E',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <h2 style={{ color: '#E8E8F0', fontSize: 16, fontWeight: 800, margin: 0 }}>Help & FAQ</h2>
                <p style={{ color: '#666680', fontSize: 11, margin: '2px 0 0' }}>Common questions answered</p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #1E1E2E',
                  borderRadius: 8, padding: 6, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', color: '#666680',
                }}
                aria-label="Close help panel"
              >
                <X size={15} />
              </button>
            </div>

            {/* FAQ list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
              {FAQS.map((faq, i) => (
                <FaqItem key={i} faq={faq} />
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #1E1E2E',
              background: 'rgba(108,99,255,0.04)',
            }}>
              <p style={{ color: '#666680', fontSize: 11, margin: 0 }}>
                Still stuck?{' '}
                <a
                  href="mailto:support@subtrackr.co"
                  style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}
                >
                  Email support →
                </a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
