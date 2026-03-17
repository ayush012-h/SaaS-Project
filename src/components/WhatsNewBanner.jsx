import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const BANNER_KEY = 'banner_v1.1'

export default function WhatsNewBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(BANNER_KEY) === 'true'
  )

  if (dismissed) return null

  function dismiss() {
    setDismissed(true)
    localStorage.setItem(BANNER_KEY, 'true')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(62,207,207,0.08))',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🎉</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#E8E8F0' }}>
            <span style={{ color: '#6C63FF', fontWeight: 700 }}>New in v1.1: </span>
            AI spending insights now available for Pro users — try it in Analytics!
          </span>
        </div>
        <button
          onClick={dismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#666680',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 4,
            borderRadius: 6,
            flexShrink: 0,
          }}
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
