import { useState } from 'react'
import { 
  TrendingUp, CreditCard, Zap, Bell, 
  ArrowRight, Pause, XCircle, Search,
  Filter, Plus, Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ServiceLogo } from '../../lib/logos'
import { useAuth } from '../../contexts/AuthContext'

const MOCK_SUBS = [
  { id: 1, name: 'Netflix', cycle: 'Monthly', cost: 649, date: 'Apr 12, 2026', color: '#E50914' },
  { id: 2, name: 'Disney+ Hotstar', cycle: 'Yearly', cost: 899, date: 'Oct 24, 2026', color: '#0046AD' },
  { id: 3, name: 'Amazon Prime', cycle: 'Monthly', cost: 149, date: 'Apr 03, 2026', color: '#00A8E1' },
  { id: 4, name: 'Spotify Premium', cycle: 'Monthly', cost: 179, date: 'Apr 15, 2026', color: '#1DB954' },
  { id: 5, name: 'Swiggy One', cycle: 'Monthly', cost: 129, date: 'Apr 08, 2026', color: '#FC8019' },
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { profile } = useAuth()

  return (
    <div className="space-y-8 animate-fade-in transition-colors duration-300">
      
      {/* 1. TOP BANNER / HEADER */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl transition-all duration-500">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-[var(--text-muted)] mt-1 font-medium italic">
              Your personal financial command center is ready.
            </p>
          </div>
          
          {/* AI Insight Box */}
          <div className="bg-[var(--bg-elevated)]/60 backdrop-blur-md rounded-2xl p-4 border border-[var(--brand-purple)]/30 flex items-start gap-3 max-w-md shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-purple)]/20 flex items-center justify-center shrink-0">
              <Zap size={20} className="text-[var(--brand-purple)]" />
            </div>
            <div>
              <h4 className="text-[var(--text-primary)] text-sm font-bold flex items-center gap-2">
                AI Insight — Subscription Alert
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                ⚠️ <span className="text-[var(--text-primary)] font-semibold">Heads up!</span> Your Amazon Prime subscription renews in 3 days. You haven't used Prime Video this month.
              </p>
              <button className="text-[var(--brand-purple)] text-[10px] font-bold uppercase tracking-widest mt-2 hover:opacity-80 transition-opacity">
                Cancel Now →
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative corner orb */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--brand-purple)]/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* 2. THREE METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Spend */}
        <div className="bg-[var(--bg-surface)] rounded-3xl p-6 border border-[var(--border-subtle)] hover:border-[var(--brand-purple)]/50 transition-all group overflow-hidden relative shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-purple)]/10 flex items-center justify-center text-[var(--brand-purple)]">
              <TrendingUp size={22} />
            </div>
            <span className="text-[var(--brand-teal)] text-xs font-bold bg-[var(--brand-teal)]/10 px-2 py-1 rounded-lg">
              +₹250 <span className="font-normal opacity-60">vs last mo</span>
            </span>
          </div>
          <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">Monthly Spend</div>
          <div className="text-3xl font-black text-[var(--text-primary)] mt-1">₹3,450</div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform pointer-events-none">
             <TrendingUp size={120} />
          </div>
        </div>

        {/* Active Subs */}
        <div className="bg-[var(--bg-surface)] rounded-3xl p-6 border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50 transition-all group overflow-hidden relative shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/10 flex items-center justify-center text-[var(--brand-teal)]">
              <CreditCard size={22} />
            </div>
            <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest">Verified</span>
          </div>
          <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">Active Subscriptions</div>
          <div className="text-3xl font-black text-[var(--text-primary)] mt-1">12</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-2">
            <span className="text-[var(--brand-teal)]">4 Entertainment</span> · 3 Software · 5 Basic
          </p>
        </div>

        {/* AI Savings */}
        <div className="bg-[var(--bg-surface)] rounded-3xl p-6 border border-[var(--border-subtle)] hover:border-[var(--brand-purple)]/50 transition-all group overflow-hidden relative shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-purple)]/10 flex items-center justify-center text-[var(--brand-purple)]">
              <Zap size={22} />
            </div>
            <div className="flex-1 ml-3 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
               <div className="w-3/4 h-full bg-[var(--brand-purple)]" />
            </div>
          </div>
          <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">Money Saved</div>
          <div className="text-3xl font-black text-[var(--brand-teal)] mt-1">₹998<span className="text-lg opacity-50 font-medium tracking-normal text-[var(--text-primary)]">/mo</span></div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-2">Potential savings detected by AI</p>
        </div>
      </div>

      {/* 3. MAIN CONTENT: RECENT SUBSCRIPTIONS */}
      <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              Recent Subscriptions
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">ALL DATA</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--brand-purple)] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search services..." 
                  className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-purple)]/50 w-48 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Filter size={16} />
             </button>
             <button className="flex items-center gap-2 bg-gradient-to-r from-[var(--brand-purple)] to-[var(--brand-teal)] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all">
                <Plus size={16} /> Add New
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Service & Name</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Billing Cycle</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Cost</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Next Payment</th>
                <th className="py-4 px-6 text-right text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {MOCK_SUBS.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sub.color}20` }}>
                        <ServiceLogo name={sub.name} size={24} color={sub.color} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-purple)] transition-colors">{sub.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-tighter">Verified Provider</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sub.cycle === 'Yearly' ? 'bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]' : 'bg-[var(--brand-purple)]/10 text-[var(--brand-purple)]'}`}>
                      {sub.cycle}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-black text-[var(--text-primary)]">₹{sub.cost}</div>
                    <div className="text-[9px] text-[var(--text-muted)]">Tax Incl.</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{sub.date}</div>
                    {sub.id === 3 && <div className="text-[9px] text-[var(--brand-teal)] font-bold bg-[var(--brand-teal)]/10 px-1 rounded inline-block">Renewing Soon</div>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/10 transition-all" title="Pause">
                          <Pause size={14} />
                       </button>
                       <button className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all" title="Cancel">
                          <XCircle size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Pagination Placeholder */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex items-center justify-between px-6">
           <p className="text-[10px] text-[var(--text-muted)] font-bold">SHOWING 5 OF 12 SUBSCRIPTIONS</p>
           <button className="text-[10px] font-black uppercase text-[var(--brand-purple)] hover:underline underline-offset-4">View All Subscriptions →</button>
        </div>
      </div>

    </div>
  )
}
