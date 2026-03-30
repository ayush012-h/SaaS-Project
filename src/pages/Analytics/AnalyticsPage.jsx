import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { subMonths, format } from 'date-fns'
import { useSubscriptions } from '../../contexts/SubscriptionsContext'
import { useAuth } from '../../contexts/AuthContext'
import { useCurrencyRates, getCurrencySymbol } from '../../hooks/useCurrencyRates'
import { useMemo } from 'react'
import { smartCheckout, prefetchOrder } from '../../lib/payment'
import { supabase } from '../../lib/supabase'
import ProGate from '../../components/UI/ProGate'
import { Sparkles, RefreshCw, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { SkeletonAnalytics, SkeletonBox } from '../../components/Skeleton'
import { EmptyInsights } from '../../components/EmptyState'
import { useIsMobile } from '../../hooks/useIsMobile'

const COLORS = ['#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#312E81']

const INSIGHT_ICONS = { overlap: AlertTriangle, unused: TrendingUp, downgrade: DollarSign }
const INSIGHT_COLORS = { overlap: '#F59E0B', unused: '#EF4444', downgrade: '#10B981' }

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

  const isMobile = useIsMobile()
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
        
        let cat = sub.category || 'Other'
        cat = cat.charAt(0).toUpperCase() + cat.slice(1)
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
    <div className={`${isMobile ? 'space-y-4' : 'space-y-8'} animate-fade-in`}>
      <div>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-black text-text-primary tracking-tight`}>Analytics</h1>
        <p className="text-text-muted text-[11px] sm:text-sm font-bold uppercase tracking-widest mt-0.5">Subscription insights</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 p-4 sm:p-5">
          <h2 className="text-sm sm:text-lg font-bold text-text-primary mb-6 uppercase tracking-tight">Spending Trend</h2>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <BarChart data={trendData} barSize={isMobile ? 24 : 36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#666680', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666680', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${currencySymbol}${v}`} />
              <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
              <Bar dataKey="amount" fill="url(#barGrad2)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#3ECFCF" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4 sm:p-5">
          <h2 className="text-sm sm:text-lg font-bold text-text-primary mb-4 uppercase tracking-tight">By Category</h2>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted text-xs uppercase font-bold italic tracking-wide">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={isMobile ? 150 : 180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={isMobile ? 40 : 50} outerRadius={isMobile ? 65 : 75} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${currencySymbol}${v.toFixed(2)}/mo`]} contentStyle={{ background: '#13131F', border: '1px solid #1E1E2E', borderRadius: '12px', color: '#E8E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {categoryData.slice(0, 4).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[11px] font-bold text-text-secondary truncate max-w-[80px]">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-text-primary">{currencySymbol}{item.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className={`card ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between mb-6'}`}>
          <div className="flex items-center gap-3">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg sm:rounded-xl flex items-center justify-center`}
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))', border: '1px solid rgba(108,99,255,0.4)' }}>
              <Sparkles size={isMobile ? 15 : 18} className="text-brand-purple" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">AI Insights</h2>
              <p className="text-[10px] text-text-muted uppercase font-black tracking-widest leading-none mt-0.5">GPT-4o</p>
            </div>
          </div>
          {isPro && (
            <button 
              onClick={generateInsights} 
              disabled={insightsLoading}
              className={`flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider py-2 px-4 rounded-xl transition-all ${insightsLoading ? 'bg-bg-elevated text-text-muted cursor-not-allowed' : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/30 hover:bg-brand-purple/20'}`}
            >
              <RefreshCw size={14} className={insightsLoading ? 'animate-spin' : ''} />
              {insightsLoading ? 'Analyzing...' : 'Generate Insights'}
            </button>
          )}
        </div>

        {!isPro ? (
          <div className="mt-6"><ProGate feature="AI spending insights" /></div>
        ) : insightsLoading ? (
          <div className="space-y-4 mt-6">
             <SkeletonBox width="100%" height="80px" borderRadius={12} />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="p-4 rounded-xl border border-border bg-bg-elevated space-y-3">
                   <div className="flex gap-3">
                     <SkeletonBox width="30px" height="30px" borderRadius={8} />
                     <div className="flex-1 space-y-2">
                       <SkeletonBox width="50%" height="10px" />
                       <SkeletonBox width="80%" height="14px" />
                     </div>
                   </div>
                   <SkeletonBox width="100%" height="30px" />
                 </div>
               ))}
             </div>
          </div>
        ) : insights.length === 0 ? (
          <div className="mt-2"><EmptyInsights onGenerateClick={generateInsights} /></div>
        ) : (
          <div className="mt-6">
            {totalSavings > 0 && (
              <div className="mb-6 p-4 rounded-xl border border-status-savings/30"
                style={{ background: 'rgba(76,255,143,0.05)' }}>
                <p className="text-status-savings font-black text-base sm:text-lg tracking-tight">
                  💰 Savings: {currencySymbol}{convert(totalSavings, '₹', displayCurrency).toFixed(0)}/mo
                </p>
                <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest mt-0.5">That's {currencySymbol}{(convert(totalSavings, '₹', displayCurrency) * 12).toFixed(0)} per year!</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, i) => {
                const Icon = INSIGHT_ICONS[insight.type] || Sparkles
                const color = INSIGHT_COLORS[insight.type] || '#6C63FF'
                return (
                  <div key={i} className="p-4 rounded-xl border border-border bg-bg-elevated/40">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>
                          {insight.type}
                        </span>
                        <p className="text-[13px] font-bold text-text-primary mt-0.5 truncate">{insight.title}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-3 line-clamp-3">{insight.explanation}</p>
                    {insight.saving_amount > 0 && (
                      <div className="pt-2 border-t border-border/40 font-black text-[12px] text-status-savings italic">
                        SAVE {currencySymbol}{convert(insight.saving_amount, '₹', displayCurrency).toFixed(0)}/MO
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
