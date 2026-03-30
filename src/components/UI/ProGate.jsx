import { Zap } from 'lucide-react'
import { smartCheckout, prefetchOrder } from '../../lib/payment'
import React from 'react'
import toast from 'react-hot-toast'

export default function ProGate({ feature = 'this feature' }) {
  const handleUpgrade = () => {
    smartCheckout().catch(err => toast.error(err.message))
  }

  return (
    <div className="pro-gate">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))', border: '1px solid rgba(108,99,255,0.4)' }}>
        <Zap size={24} className="text-brand-purple" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">Pro Feature</h3>
      <p className="text-text-muted mb-6 max-w-sm mx-auto text-sm">
        Upgrade to Pro to unlock {feature}, AI insights, unlimited subscriptions, and more.
      </p>
      <button 
        onClick={handleUpgrade}
        onMouseEnter={prefetchOrder}
        className="btn-primary inline-block cursor-pointer border-none"
        style={{ 
          background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', 
          color: '#fff', 
          padding: '10px 28px', 
          borderRadius: '12px', 
          fontWeight: 600, 
          textDecoration: 'none',
        }}>
        Upgrade to Pro — ₹49/month
      </button>
      <p className="text-text-muted text-xs mt-4">Cancel anytime. No hidden fees.</p>
    </div>
  )
}
