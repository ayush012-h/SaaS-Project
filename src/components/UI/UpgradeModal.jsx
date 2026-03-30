import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, Sparkles, Zap, Shield, BarChart3, Mail } from 'lucide-react';
import { smartCheckout } from '../../lib/payment';
import toast from 'react-hot-toast';

export default function UpgradeModal({ isOpen, onClose }) {
  const [upgrading, setUpgrading] = React.useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await smartCheckout();
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#12141D] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header/Banner */}
            <div className="h-32 bg-gradient-to-br from-[#6366F1] to-[#a855f7] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]" />
              </div>
              <Crown size={48} className="text-white drop-shadow-lg z-10" />
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={12} />
                Premium Offer
              </div>

              <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                Unlock All Features
              </h2>
              <p className="text-[#94A3B8] text-sm mb-6">
                Get the full power of SubTrackr for less than a cup of coffee.
              </p>

              {/* Features List */}
              <div className="text-left space-y-3 mb-8">
                {[
                  { icon: Zap, text: 'AI Spending Insights' },
                  { icon: Mail, text: 'Automated Email Scanner' },
                  { icon: Shield, text: 'Duplicate Detection' },
                  { icon: BarChart3, text: 'Advanced Analytics \u0026 Reports' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[#6366F1]">
                      <item.icon size={14} />
                    </div>
                    <span>{item.text}</span>
                    <Check size={14} className="ml-auto text-[#10B981]" />
                  </div>
                ))}
              </div>

              {/* Pricing Section */}
              <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-white">₹49</span>
                  <span className="text-[#94A3B8] font-bold">/month</span>
                </div>
                <p className="text-[10px] text-[#94A3B8] font-medium mt-1 uppercase tracking-widest">
                  Cancel Anytime • Secure Payment
                </p>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-4 bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white font-black rounded-2xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {upgrading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Crown size={18} />
                    <span>Get Pro Now — ₹49</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
