import { useMemo, useEffect, useState } from 'react'
import { DollarSign, CreditCard, TrendingUp, Bell, Calendar, AlertCircle, MessageSquare } from 'lucide-react'
import { format, subMonths } from 'date-fns'
import React, { lazy, Suspense } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useSubscriptions } from '../../contexts/SubscriptionsContext'
import { useAuth } from '../../contexts/AuthContext'
import { useCurrencyRates, getCurrencySymbol } from '../../hooks/useCurrencyRates'
import StatCard from '../../components/UI/StatCard'
import StatusBadge from '../../components/UI/StatusBadge'
import { Link } from 'react-router-dom'
import { ServiceLogo } from '../../lib/logos'
import { SkeletonDashboard } from '../../components/Skeleton'
import { EmptySubscriptions, EmptyAlerts } from '../../components/EmptyState'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Square, X } from 'lucide-react'
import WhatsNewBanner from '../../components/WhatsNewBanner'
import { useIsMobile } from '../../hooks/useIsMobile'
import FeedbackWidget from '../../components/FeedbackWidget'

import { ChevronRight } from 'lucide-react'

const SubscriptionRow = React.memo(function SubscriptionRow({ sub, isMobile, days, type = 'renewal' }) {
  if (type === 'renewal') {
    return (
      <Link to="/subscriptions" className="block outline-none">
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-bg-elevated/40 border border-border/50 hover:bg-bg-elevated/60 transition-all duration-200"
        >
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <ServiceLogo name={sub.name} size={isMobile ? 28 : 36} color={sub.color || '#6C63FF'} />
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-text-primary truncate">{sub.name}</p>
              <p className="text-[10px] text-text-muted truncate">{sub.currency || '₹'}{sub.amount}</p>
            </div>
          </div>
          <div className="shrink-0 text-right flex items-center gap-2">
            <span className={`text-[11px] font-black uppercase ${days <= 2 ? 'text-status-danger' : days <= 5 ? 'text-status-warning' : 'text-text-secondary'}`}>
              {days === 0 ? 'Today' : `${days}d`}
            </span>
            <ChevronRight size={14} className="text-text-muted/50" />
          </div>
        </motion.div>
      </Link>
    )
  }
  return (
    <Link to="/subscriptions" className="block outline-none">
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between p-2.5 sm:p-4 rounded-lg sm:rounded-xl hover:bg-bg-hover transition-all duration-200"
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <ServiceLogo name={sub.name} size={isMobile ? 28 : 36} color={sub.color || '#6C63FF'} />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-text-primary truncate">{sub.name}</p>
            <p className="text-[10px] text-text-muted truncate capitalize">{sub.category || 'Other'}</p>
          </div>
        </div>
        <div className="shrink-0 text-right flex items-center gap-2">
          <div>
            <p className="text-[13px] font-black text-text-primary">{sub.currency || '₹'}{sub.amount}</p>
            <div className="scale-75 origin-right -mt-1"><StatusBadge status={sub.status} /></div>
          </div>
          <ChevronRight size={14} className="text-text-muted/50" />
        </div>
      </motion.div>
    </Link>
  )
})

function FeedbackModal({ onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
      }}>
        <FeedbackWidget _asModal onModalClose={onClose} />
      </div>
    </>
  )
}


const CATEGORY_COLORS = ['#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#312E81', '#3730A3', '#4F46E5', '#6366F1']

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  style: { willChange: 'transform, opacity' }
}

const CustomTooltip = ({ active, payload, label, currencySymbol }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-bg-elevated border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="text-text-muted text-xs mb-1">{label}</p>
        <p className="text-text-primary font-bold">{currencySymbol}{payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { subscriptions, activeSubscriptions, upcomingRenewals, loading } = useSubscriptions()
  const { profile, isPro } = useAuth()
  const { convert } = useCurrencyRates()
  
  const displayCurrency = profile?.display_currency || 'INR'
  const currencySymbol = getCurrencySymbol(displayCurrency)

  useEffect(() => {
    document.title = 'Dashboard — SubTrackr'
  }, [])

  // Calculate totals in display currency
  const { convMonthlyTotal, convYearlyTotal, convCategoryBreakdown } = useMemo(() => {
    let mTotal = 0
    let yTotal = 0
    const catBreakdown = {}

    activeSubscriptions.forEach(sub => {
      const amountInDisplay = convert(sub.amount, sub.currency || '₹', displayCurrency)
      
      let monthly = 0
      if (sub.billing_cycle === 'monthly') monthly = amountInDisplay
      else if (sub.billing_cycle === 'yearly') monthly = amountInDisplay / 12
      else if (sub.billing_cycle === 'weekly') monthly = amountInDisplay * 4.33
      
      mTotal += monthly
      yTotal += monthly * 12
      
      let cat = sub.category || 'Other'
      cat = cat.charAt(0).toUpperCase() + cat.slice(1)
      catBreakdown[cat] = (catBreakdown[cat] || 0) + monthly
    })

    return { 
      convMonthlyTotal: mTotal, 
      convYearlyTotal: yTotal, 
      convCategoryBreakdown: catBreakdown 
    }
  }, [activeSubscriptions, displayCurrency, convert])

  const budget = profile?.monthly_budget || 0
  const budgetProgress = budget > 0 ? (convMonthlyTotal / budget) * 100 : 0
  const isOverBudget = budget > 0 && convMonthlyTotal > budget
  // Monthly spending trend (last 6 months)
  const trendData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i))
    return months.map(month => {
      const total = subscriptions
        .filter(s => {
          const created = new Date(s.created_at)
          return created <= month && s.status !== 'cancelled'
        })
        .reduce((sum, s) => {
          const amountInDisplay = convert(s.amount, s.currency || '₹', displayCurrency)
          if (s.billing_cycle === 'monthly') return sum + amountInDisplay
          if (s.billing_cycle === 'yearly') return sum + amountInDisplay / 12
          if (s.billing_cycle === 'weekly') return sum + amountInDisplay * 4.33
          return sum
        }, 0)
      return { month: format(month, 'MMM'), amount: parseFloat(total.toFixed(2)) }
    })
  }, [subscriptions, displayCurrency, convert])

  const categoryChartData = Object.entries(convCategoryBreakdown).map(([name, value]) => ({
    name, value: parseFloat(value.toFixed(2))
  }))

  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const isMobile = useIsMobile()

  if (loading) {
    return <SkeletonDashboard />
  }

  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-8'} animate-fade-in`}>
      <div className="hidden md:block">
        <WhatsNewBanner />
      </div>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-text-primary tracking-tight`}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}{profile?.full_name ? `, ${String(profile.full_name).split(' ')[0]}` : ''}! 👋
          </h1>
          <p className={`${isMobile ? 'text-xs' : 'text-sm mt-1'} text-text-muted font-medium`}>Subscription overview</p>
        </div>
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="text-right">
              <p className="text-text-muted text-sm font-semibold">{format(new Date(), 'EEEE, MMMM d')}</p>
            </div>
          )}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated border border-border text-text-muted hover:text-white transition-all group shadow-sm active:scale-95"
          >
            <MessageSquare size={16} className="text-brand-purple group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold tracking-tight">Feedback</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      </AnimatePresence>

      {/* Onboarding Checklist */}
      {!localStorage.getItem('dashboard_checklist_dismissed') && (
        <DashboardChecklist 
          profile={profile} 
          subscriptions={subscriptions} 
          onDismiss={() => {
            localStorage.setItem('dashboard_checklist_dismissed', 'true')
            window.location.reload()
          }} 
        />
      )}

      {/* Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Monthly Spend"
            value={`${currencySymbol}${convMonthlyTotal.toFixed(2)}`}
            subtitle={displayCurrency !== 'INR' ? `Converted from original` : "All active subscriptions"}
            icon={DollarSign}
            color="#6C63FF"
            trend={trendData.length > 1 && trendData[4].amount ? Math.round(((trendData[5].amount - trendData[4].amount) / trendData[4].amount) * 100) : 0}
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Yearly Estimate"
            value={`${currencySymbol}${convYearlyTotal.toFixed(0)}`}
            subtitle="Projected annual cost"
            icon={TrendingUp}
            color="#3ECFCF"
            trend={trendData.length > 1 && trendData[4].amount ? Math.round(((trendData[5].amount - trendData[4].amount) / trendData[4].amount) * 100) : 0}
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Active Subs"
            value={activeSubscriptions.length}
            subtitle={`of ${subscriptions.length} total`}
            icon={CreditCard}
            color="#4CFF8F"
            trend={0}
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Upcoming Renewals"
            value={upcomingRenewals.length}
            subtitle="Next 7 days"
            icon={Bell}
            color="#FFD700"
            trend={0}
          />
        </motion.div>
      </motion.div>

      {/* Feature 2: Budget Progress (Pro) */}
      {isPro && budget > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`card overflow-hidden relative p-4 sm:p-5 ${isOverBudget ? 'border-status-danger/30' : ''}`}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-4">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-text-primary flex items-center gap-2">
                Monthly Budget
                {isOverBudget && <span className="bg-status-danger/10 text-status-danger text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Over</span>}
              </h3>
              <p className="text-text-muted text-[10px] sm:text-xs">
                {currencySymbol}{convMonthlyTotal.toFixed(0)} / {currencySymbol}{budget.toFixed(0)}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xl sm:text-2xl font-black ${isOverBudget ? 'text-status-danger' : 'text-brand-teal'}`}>
                {Math.round(budgetProgress)}%
              </span>
            </div>
          </div>
          
          <div className="h-2 sm:h-3 w-full bg-bg-elevated rounded-full overflow-hidden border border-border">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${isOverBudget ? 'bg-status-danger shadow-glow-red' : 'bg-brand-teal shadow-glow-teal'}`}
              style={{ background: isOverBudget ? 'linear-gradient(90deg, #FF6363, #FF3E3E)' : 'linear-gradient(90deg, #3ECFCF, #63FFBD)' }}
            />
          </div>

          {!isMobile && isOverBudget && (
            <p className="mt-3 text-[11px] text-status-danger font-medium flex items-center gap-1">
              <AlertCircle size={12} />
              Warning: Budget exceeded by {currencySymbol}{(convMonthlyTotal - budget).toFixed(0)}.
            </p>
          )}
        </motion.div>
      )}

      {/* Charts Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Monthly Trend */}
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card lg:col-span-2" style={{ minWidth: 0 }}>
          <h2 className="text-lg font-semibold text-text-primary mb-6">Monthly Spending Trend</h2>
          {trendData.every(d => d.amount === 0) ? (
            <div className="h-52 flex flex-col items-center justify-center text-text-muted text-center p-4 rounded-xl border border-dashed border-border/50 bg-bg-elevated/20">
              <div className="w-16 h-16 bg-brand-purple/10 flex items-center justify-center rounded-full mb-4 shadow-[0_0_15px_rgba(108,99,255,0.2)]">
                <TrendingUp size={28} className="text-brand-purple" />
              </div>
              <p className="text-sm text-text-primary font-medium mb-1">Visualize your spending</p>
              <p className="text-xs text-text-muted mb-4 max-w-xs">Add your first subscription to see your spending trend over time.</p>
              <button 
                 onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }))}
                 className="btn-primary py-1.5 px-4 text-xs">
                + Add Subscription
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#666680', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666680', fontSize: 12 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${currencySymbol}${v}`} />
                <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
                <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#3ECFCF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card" style={{ minWidth: 0 }}>
          <h2 className="text-lg font-semibold text-text-primary mb-6">By Category</h2>
          {categoryChartData.length === 0 ? (
            <div className="h-48 flex flex-col justify-center items-center">
              <div className="w-28 h-28 rounded-full border-[10px] border-border relative opacity-40 shadow-inner -mt-4">
                <div className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center text-text-muted/60">
                  <CreditCard size={24} />
                </div>
              </div>
              <div className="w-full flex-1 flex flex-col justify-center gap-2 mt-4 px-4">
                {['Streaming', 'Software', 'Utilities', 'Other'].map((cat, i) => (
                  <div key={cat} className="flex items-center justify-between opacity-30">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[i] }} />
                       <span className="text-xs text-text-muted font-medium">{cat}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-text-muted">—</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-col lg:h-[220px]">
              <div className="relative w-[200px] h-[200px] mx-auto lg:w-full lg:h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={isMobile ? 60 : 45} outerRadius={isMobile ? 90 : 70}
                      paddingAngle={4} dataKey="value">
                      {categoryChartData.map((_, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${currencySymbol}${v.toFixed(2)}/mo`, '']}
                      contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 w-full mx-auto md:max-w-none md:flex md:flex-col">
                {categoryChartData.slice(0, 4).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      <span className="text-xs text-text-secondary truncate max-w-[70px]">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-text-primary ml-1">{currencySymbol}{item.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Upcoming Renewals + Recent Subs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Renewals */}
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-bold text-text-primary uppercase tracking-tight">Renewals</h2>
            <Link to="/alerts" className="text-brand-purple text-[10px] sm:text-sm font-bold uppercase tracking-wider hover:opacity-80">View all →</Link>
          </div>
          {upcomingRenewals.length === 0 ? (
            <div className="py-4 text-center text-text-muted text-xs border border-dashed border-border/50 rounded-xl bg-bg-elevated/20 flex flex-col items-center justify-center" style={{ minHeight: '130px' }}>
              <Bell size={20} className="mb-2 opacity-30 text-brand-teal" />
              No upcoming renewals
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="space-y-2"
            >
              {upcomingRenewals.slice(0, 4).map(sub => {
                const days = Math.ceil((new Date(sub.next_renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
                return <SubscriptionRow key={sub.id} sub={sub} isMobile={isMobile} days={days} type="renewal" />
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Recent Subscriptions */}
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-bold text-text-primary uppercase tracking-tight">Recent</h2>
            <Link to="/subscriptions" className="text-brand-purple text-[10px] sm:text-sm font-bold uppercase tracking-wider hover:opacity-80">All →</Link>
          </div>
          {subscriptions.length === 0 ? (
            <div className="py-4 px-2">
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-border/40 text-[10px] flex items-center justify-center font-bold text-text-muted">{i}</div>
                    <div className="flex-1 h-3 bg-border/20 rounded max-w-[120px]" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="space-y-2"
            >
              {[...subscriptions].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4).map(sub => (
                <SubscriptionRow key={sub.id} sub={sub} isMobile={isMobile} type="recent" />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function DashboardChecklist({ profile, subscriptions, onDismiss }) {
  const isMobile = useIsMobile()
  const steps = [
    { id: 'sub', label: 'First Sub', done: subscriptions.length > 0 },
    { id: 'budget', label: 'Budget', done: Boolean(profile?.monthly_budget) },
    { id: 'alerts', label: 'Alerts', done: profile?.preferences?.email_alerts || profile?.preferences?.push_alerts },
    { id: 'scanner', label: 'Scanner', done: false },
  ]
  
  const completedCount = steps.filter(s => s.done).length

  return (
    <div className={`card bg-gradient-to-r from-brand-purple/10 to-transparent border-brand-purple/20 relative animate-fade-in ${isMobile ? 'my-2 p-3' : 'my-6 p-5'}`}>
      <button onClick={onDismiss} className="absolute top-2 right-2 p-1.5 text-text-muted hover:text-white bg-bg-elevated rounded-lg transition-colors">
        <X size={14} />
      </button>

      {isMobile ? (
        <div className="flex flex-col pr-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              🚀 Setup
            </h3>
            <span className="text-[10px] font-bold text-brand-purple">{Math.round((completedCount/steps.length)*100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-purple transition-all duration-500 ease-out" 
              style={{ width: `${(completedCount/steps.length)*100}%` }} 
            />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              🚀 Get started
            </h3>
            <p className="text-xs text-text-muted mt-0.5">{completedCount} of {steps.length} done</p>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 p-2 rounded-lg bg-bg-elevated/50 border border-border">
                {step.done ? (
                  <CheckSquare size={14} className="text-brand-teal shrink-0" />
                ) : (
                  <Square size={14} className="text-text-muted/50 shrink-0" />
                )}
                <span className={`text-xs truncate ${step.done ? 'text-text-muted line-through font-normal' : 'text-text-primary font-bold'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
