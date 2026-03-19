import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { subMonths, format } from 'date-fns'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { useAuth } from '../../contexts/AuthContext'
import { useCurrencyRates, getCurrencySymbol } from '../../hooks/useCurrencyRates'
import { useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import ProGate from '../../components/UI/ProGate'
import { Sparkles, RefreshCw, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { SkeletonAnalytics, SkeletonBox } from '../../components/Skeleton'
import { EmptyInsights } from '../../components/EmptyState'

const COLORS = ['#6C63FF', '#3ECFCF', '#FFD700', '#FF6363', '#4CFF8F', '#FF63B3', '#63B3FF', '#FF9F63']

const INSIGHT_ICONS = { overlap: AlertTriangle, unused: TrendingUp, downgrade: DollarSign }
const INSIGHT_COLORS = { overlap: '#FFD700', unused: '#FF6363', downgrade: '#4CFF8F' }

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

export default function AnalyticsPage() {
  const { subscriptions, loading: subsLoading } = useSubscriptions()
  const { user, profile, isPro } = useAuth()
  const { convert } = useCurrencyRates()
  
  const displayCurrency = profile?.display_currency || 'INR'
  const currencySymbol = getCurrencySymbol(displayCurrency)
  const [insights, setInsights] = useState([])
  const [insightsLoading, setInsightsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Analytics — SubTrackr'
  }, [])

  const { trendData, categoryData } = useMemo(() => {
    // Trend Data
    const tData = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i)).map(month => {
      const total = subscriptions
        .filter(s => new Date(s.created_at) <= month && s.status !== 'cancelled')
        .reduce((sum, s) => {
          const amountInDisplay = convert(s.amount, s.currency || '₹', displayCurrency)
          if (s.billing_cycle === 'monthly') return sum + amountInDisplay
          if (s.billing_cycle === 'yearly') return sum + amountInDisplay / 12
          if (s.billing_cycle === 'weekly') return sum + amountInDisplay * 4.33
          return sum
        }, 0)
      return { month: format(month, 'MMM yy'), amount: parseFloat(total.toFixed(2)) }
    })

    // Category Data
    const catBreakdown = {}
    subscriptions
      .filter(s => s.status !== 'cancelled')
      .forEach(sub => {
        const amountInDisplay = convert(sub.amount, sub.currency || '₹', displayCurrency)
        let monthly = 0
        if (sub.billing_cycle === 'monthly') monthly = amountInDisplay
        else if (sub.billing_cycle === 'yearly') monthly = amountInDisplay / 12
        else if (sub.billing_cycle === 'weekly') monthly = amountInDisplay * 4.33
        
        const cat = sub.category || 'Other'
        catBreakdown[cat] = (catBreakdown[cat] || 0) + monthly
      })

    const cData = Object.entries(catBreakdown)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)

    return { trendData: tData, categoryData: cData }
  }, [subscriptions, convert, displayCurrency])

  async function generateInsights() {
    setInsightsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { user_id: user.id }
      })
      if (error) throw error
      setInsights(data.insights || [])
      toast.success('Insights generated!')
    } catch (err) {
      toast.error('Failed to generate insights. Check your OpenAI API key.')
      console.error(err)
    } finally {
      setInsightsLoading(false)
    }
  }

  if (subsLoading) return <SkeletonAnalytics />

  const totalSavings = insights.reduce((sum, i) => sum + (i.saving_amount || 0), 0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
        <p className="text-text-muted mt-1">Deep dive into your subscription spending</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Monthly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#666680', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666680', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${currencySymbol}${v}`} />
              <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
              <Bar dataKey="amount" fill="url(#barGrad2)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#3ECFCF" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Spending by Category</h2>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${currencySymbol}${v.toFixed(2)}/mo`]} contentStyle={{ background: '#13131F', border: '1px solid #1E1E2E', borderRadius: '12px', color: '#E8E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {categoryData.slice(0, 5).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-text-secondary">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-text-primary">{currencySymbol}{item.value.toFixed(0)}/mo</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))', border: '1px solid rgba(108,99,255,0.4)' }}>
              <Sparkles size={18} className="text-brand-purple" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">AI Spending Insights</h2>
              <p className="text-text-muted text-xs">Powered by GPT-4o-mini</p>
            </div>
          </div>
          {isPro && (
            <button onClick={generateInsights} disabled={insightsLoading}
              className="btn-secondary flex items-center gap-2 text-sm">
              <RefreshCw size={15} className={insightsLoading ? 'animate-spin' : ''} />
              {insightsLoading ? 'Analyzing...' : 'Generate Insights'}
            </button>
          )}
        </div>

        {!isPro ? (
          <ProGate feature="AI spending insights" />
        ) : insightsLoading ? (
          <div className="space-y-4">
             <SkeletonBox width="100%" height="80px" borderRadius={12} />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="p-5 rounded-xl border border-border bg-bg-elevated space-y-3">
                   <div className="flex gap-3">
                     <SkeletonBox width="36px" height="36px" borderRadius={10} />
                     <div className="flex-1 space-y-2">
                       <SkeletonBox width="50%" height="12px" />
                       <SkeletonBox width="70%" height="16px" />
                     </div>
                   </div>
                   <SkeletonBox width="100%" height="40px" />
                 </div>
               ))}
             </div>
          </div>
        ) : insights.length === 0 ? (
          <EmptyInsights onGenerateClick={generateInsights} />
        ) : (
          <>
            {totalSavings > 0 && (
              <div className="mb-6 p-4 rounded-xl border border-status-savings/30"
                style={{ background: 'rgba(76,255,143,0.05)' }}>
                <p className="text-status-savings font-bold text-lg">
                  💰 Total potential savings: {currencySymbol}{convert(totalSavings, '₹', displayCurrency).toFixed(2)}/month
                </p>
                <p className="text-text-muted text-sm">That's {currencySymbol}{(convert(totalSavings, '₹', displayCurrency) * 12).toFixed(0)} per year!</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, i) => {
                const Icon = INSIGHT_ICONS[insight.type] || Sparkles
                const color = INSIGHT_COLORS[insight.type] || '#6C63FF'
                return (
                  <div key={i} className="p-5 rounded-xl border border-border bg-bg-elevated">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
                          {insight.type}
                        </span>
                        <p className="text-sm font-semibold text-text-primary mt-0.5">{insight.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mb-3">{insight.explanation}</p>
                    {insight.saving_amount > 0 && (
                      <p className="text-status-savings text-sm font-bold">
                        Save {currencySymbol}{convert(insight.saving_amount, '₹', displayCurrency).toFixed(2)}/mo
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
