import { useMemo, useEffect } from 'react'
import { DollarSign, CreditCard, TrendingUp, Bell, Calendar, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format, subMonths } from 'date-fns'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { useAuth } from '../../contexts/AuthContext'
import { useCurrencyRates, getCurrencySymbol } from '../../hooks/useCurrencyRates'
import StatCard from '../../components/UI/StatCard'
import StatusBadge from '../../components/UI/StatusBadge'
import { Link } from 'react-router-dom'
import { ServiceLogo } from '../../lib/logos'
import { SkeletonDashboard } from '../../components/Skeleton'
import { EmptySubscriptions, EmptyAlerts } from '../../components/EmptyState'
import { motion } from 'framer-motion'
import WhatsNewBanner from '../../components/WhatsNewBanner'


const CATEGORY_COLORS = ['#6C63FF', '#3ECFCF', '#FFD700', '#FF6363', '#4CFF8F', '#FF63B3', '#63B3FF', '#FF9F63']

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
  show: { opacity: 1, y: 0 }
}

const CustomTooltip = ({ active, payload, label, currencySymbol }) => {
  if (active && payload?.length) {
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
      
      const cat = sub.category || 'Other'
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

  if (loading) {
    return <SkeletonDashboard />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <WhatsNewBanner />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
          </h1>
          <p className="text-text-muted mt-1">Here's your subscription overview</p>
        </div>
        <div className="text-right">
          <p className="text-text-muted text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Monthly Spend"
            value={`${currencySymbol}${convMonthlyTotal.toFixed(2)}`}
            subtitle={displayCurrency !== 'INR' ? `Converted from original` : "All active subscriptions"}
            icon={DollarSign}
            color="#6C63FF"
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Yearly Estimate"
            value={`${currencySymbol}${convYearlyTotal.toFixed(0)}`}
            subtitle="Projected annual cost"
            icon={TrendingUp}
            color="#3ECFCF"
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Active Subs"
            value={activeSubscriptions.length}
            subtitle={`of ${subscriptions.length} total`}
            icon={CreditCard}
            color="#4CFF8F"
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <StatCard
            title="Upcoming Renewals"
            value={upcomingRenewals.length}
            subtitle="Next 7 days"
            icon={Bell}
            color="#FFD700"
          />
        </motion.div>
      </motion.div>

      {/* Feature 2: Budget Progress (Pro) */}
      {isPro && budget > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`card overflow-hidden relative ${isOverBudget ? 'border-status-danger/30' : ''}`}
        >
          <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                Monthly Budget Goal
                {isOverBudget && <span className="bg-status-danger/10 text-status-danger text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Over Limit</span>}
              </h3>
              <p className="text-text-muted text-xs">
                You've spent {currencySymbol}{convMonthlyTotal.toFixed(0)} of {currencySymbol}{budget.toFixed(0)} budget
              </p>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black ${isOverBudget ? 'text-status-danger' : 'text-brand-teal'}`}>
                {Math.round(budgetProgress)}%
              </span>
            </div>
          </div>
          
          <div className="h-3 w-full bg-bg-elevated rounded-full overflow-hidden border border-border">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${isOverBudget ? 'bg-status-danger shadow-glow-red' : 'bg-brand-teal shadow-glow-teal'}`}
              style={{ background: isOverBudget ? 'linear-gradient(90deg, #FF6363, #FF3E3E)' : 'linear-gradient(90deg, #3ECFCF, #63FFBD)' }}
            />
          </div>

          {isOverBudget && (
            <p className="mt-3 text-[11px] text-status-danger font-medium flex items-center gap-1">
              <AlertCircle size={12} />
              Warning: You have exceeded your monthly budget by {currencySymbol}{(convMonthlyTotal - budget).toFixed(0)}.
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
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Monthly Spending Trend</h2>
          {trendData.every(d => d.amount === 0) ? (
            <div className="h-52 flex flex-col items-center justify-center text-text-muted">
              <TrendingUp size={32} className="mb-3 opacity-30" />
              <p className="text-sm">Add subscriptions to see your spending trend</p>
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
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-6">By Category</h2>
          {categoryChartData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-text-muted">
              <CreditCard size={32} className="mb-3 opacity-30" />
              <p className="text-sm text-center">No subscriptions yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={4} dataKey="value">
                    {categoryChartData.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${currencySymbol}${v.toFixed(2)}/mo`, '']}
                    contentStyle={{ background: '#13131F', border: '1px solid #1E1E2E', borderRadius: '12px', color: '#E8E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryChartData.slice(0, 4).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      <span className="text-xs text-text-secondary">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-text-primary">{currencySymbol}{item.value.toFixed(0)}/mo</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Upcoming Renewals + Recent Subs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Renewals */}
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary">Upcoming Renewals</h2>
            <Link to="/alerts" className="text-brand-purple text-sm hover:underline">View all →</Link>
          </div>
          {upcomingRenewals.length === 0 ? (
            <div className="py-2">
              <EmptyAlerts />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="space-y-3"
            >
              {upcomingRenewals.map(sub => {
                const days = Math.ceil((new Date(sub.next_renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
                return (
                  <motion.div
                    key={sub.id}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border hover:bg-bg-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ServiceLogo name={sub.name} size={36} color={sub.color || '#6C63FF'} />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{sub.name}</p>
                        <p className="text-xs text-text-muted">{sub.currency || '₹'}{sub.amount}/{sub.billing_cycle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${days <= 2 ? 'text-status-danger' : days <= 5 ? 'text-status-warning' : 'text-text-secondary'}`}>
                        {days === 0 ? 'Today' : `${days}d`}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Recent Subscriptions */}
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary">Recent Subscriptions</h2>
            <Link to="/subscriptions" className="text-brand-purple text-sm hover:underline">View all →</Link>
          </div>
          {subscriptions.length === 0 ? (
            <div className="py-2">
              <EmptySubscriptions onAddClick={() => { /* Navigation to subs or open modal */ }} />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="space-y-3"
            >
              {[...subscriptions].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map(sub => (
                <motion.div
                  key={sub.id}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ServiceLogo name={sub.name} size={36} color={sub.color || '#6C63FF'} />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{sub.name}</p>
                      <p className="text-xs text-text-muted">{sub.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">{sub.currency || '₹'}{sub.amount}</p>
                    <StatusBadge status={sub.status} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
